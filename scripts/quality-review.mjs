import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import { createStaticSiteTools, normalizeBasePath } from "./lib/static-site-server.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const siteRoot = path.join(repoRoot, "_site");
const outputRoot = path.join(repoRoot, "output", "quality-review");
const port = Number(process.env.QUALITY_REVIEW_PORT || 4174);
const basePath = normalizeBasePath(process.env.SITE_BASE_PATH);
const staticSite = createStaticSiteTools({ siteRoot, basePath });

process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(repoRoot, ".cache", "ms-playwright");

const primaryRoutes = [
  { slug: "home", path: "/" },
  { slug: "publications", path: "/publications/" },
  { slug: "jonathan-abraham", path: "/jonathan-abraham/" },
  { slug: "team", path: "/team/" },
  { slug: "news", path: "/news/" },
  { slug: "contact", path: "/contact/" },
  { slug: "research", path: "/research/" }
];

const legacyRoutes = [
  { slug: "people", path: "/people/", target: "/team/" },
  { slug: "contact-us", path: "/contact-us/", target: "/contact/" },
  { slug: "meet-the-pi", path: "/meet-the-pi/", target: "/jonathan-abraham/" }
];

const compatibilityViewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet-portrait", width: 820, height: 1180 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 }
];

const stressViewports = [
  { name: "reflow-320", width: 320, height: 800 },
  { name: "narrow-window", width: 600, height: 960 },
  { name: "short-wide", width: 900, height: 600 },
  { name: "wide-desktop", width: 1600, height: 900 }
];

const accessibilityViewports = [
  compatibilityViewports[0],
  compatibilityViewports[1],
  compatibilityViewports[3]
];

const defaultBrowsers = ["chromium", "firefox", "webkit"];
const themes = ["light", "dark"];

function parseBrowsers(value) {
  if (!value) return defaultBrowsers;
  const names = value.split(",").map((entry) => entry.trim()).filter(Boolean);
  const invalid = names.filter((name) => !defaultBrowsers.includes(name));
  if (invalid.length) throw new Error(`Unknown browser engine: ${invalid.join(", ")}`);
  return [...new Set(names)];
}

const selectedBrowsers = parseBrowsers(process.env.QUALITY_REVIEW_BROWSERS);

function routeUrl(origin, routePath) {
  return `${origin}${basePath}${routePath}`;
}

function annotation(message) {
  return String(message)
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
}

async function preparePage(page, theme) {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
  await page.evaluate(async (activeTheme) => {
    if (document.fonts?.ready) await document.fonts.ready;
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.style.colorScheme = activeTheme;
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
  }, theme);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  try {
    await page.waitForFunction(
      () => [...document.images]
        .filter((image) => image.src.startsWith(location.origin))
        .every((image) => image.complete),
      { timeout: 2500 }
    );
  } catch {
    // The layout check below reports any local image that did not load.
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const selectorFor = (element) => {
      if (!(element instanceof Element)) return "unknown";
      if (element.id) return `#${element.id}`;
      const classes = [...element.classList].slice(0, 2).join(".");
      return `${element.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`;
    };
    const visible = (node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const textSelector = "h1,h2,h3,h4,p,a,button,address,li,dt,dd,time,strong,small";
    const edgeCollisions = [...document.querySelectorAll(textSelector)]
      .filter(visible)
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.left < -1 || rect.right > window.innerWidth + 1;
      })
      .slice(0, 10)
      .map((node) => ({ selector: selectorFor(node), text: node.textContent?.trim().slice(0, 80) || "" }));
    const clippedText = [...document.querySelectorAll(textSelector)]
      .filter(visible)
      .filter((node) => {
        const style = getComputedStyle(node);
        const clips = ["hidden", "clip"].includes(style.overflow) || ["hidden", "clip"].includes(style.overflowX) || ["hidden", "clip"].includes(style.overflowY);
        return clips && (node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1);
      })
      .slice(0, 10)
      .map((node) => ({ selector: selectorFor(node), text: node.textContent?.trim().slice(0, 80) || "" }));
    const duplicateIds = [...document.querySelectorAll("[id]")]
      .map((node) => node.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index);

    return {
      lang: document.documentElement.lang,
      h1Count: document.querySelectorAll("main h1").length,
      hasMain: Boolean(document.querySelector("main#main-content")),
      hasSkipTarget: Boolean(document.querySelector("#main-content")),
      documentOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      brokenImages: [...document.images]
        .filter((image) => image.src.startsWith(location.origin) && (!image.complete || image.naturalWidth === 0))
        .map((image) => image.getAttribute("src")),
      edgeCollisions,
      clippedText,
      duplicateIds: [...new Set(duplicateIds)]
    };
  });
}

function addLayoutFailures(failures, label, check) {
  if (check.lang !== "en") failures.push(`${label}: document language is not English.`);
  if (check.h1Count !== 1) failures.push(`${label}: expected one main heading, found ${check.h1Count}.`);
  if (!check.hasMain || !check.hasSkipTarget) failures.push(`${label}: main landmark or skip-link target is missing.`);
  if (check.documentOverflow > 1) failures.push(`${label}: horizontal overflow of ${check.documentOverflow}px.`);
  if (check.brokenImages.length) failures.push(`${label}: broken local images: ${check.brokenImages.join(", ")}.`);
  if (check.edgeCollisions.length) failures.push(`${label}: text crosses the viewport edge at ${check.edgeCollisions.map((item) => item.selector).join(", ")}.`);
  if (check.clippedText.length) failures.push(`${label}: clipped text at ${check.clippedText.map((item) => item.selector).join(", ")}.`);
  if (check.duplicateIds.length) failures.push(`${label}: duplicate IDs: ${check.duplicateIds.join(", ")}.`);
}

async function checkKeyboard(browser, browserName, origin, failures) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(routeUrl(origin, "/"), { waitUntil: "domcontentloaded" });
  await preparePage(page, "light");
  await page.keyboard.press("Tab");
  const skipCheck = await page.evaluate(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return { focused: false, visible: false, outline: 0 };
    const rect = active.getBoundingClientRect();
    const style = getComputedStyle(active);
    return {
      focused: active.classList.contains("skip-link"),
      visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
      outline: Number.parseFloat(style.outlineWidth) || 0
    };
  });
  if (!skipCheck.focused || !skipCheck.visible || skipCheck.outline < 2) {
    failures.push(`${browserName}: skip link is not the first visible keyboard focus target.`);
  }

  const toggle = page.locator(".nav-toggle");
  const toggleBox = await toggle.boundingBox();
  if (!toggleBox || toggleBox.width < 44 || toggleBox.height < 44) {
    failures.push(`${browserName}: mobile menu control is smaller than 44 by 44 CSS pixels.`);
  }
  await toggle.click();
  if (await page.locator(".site-nav.is-open").count() !== 1) {
    failures.push(`${browserName}: mobile navigation did not open.`);
  }
  await page.keyboard.press("Escape");
  if (await page.locator(".site-nav.is-open").count() !== 0) {
    failures.push(`${browserName}: mobile navigation did not close with Escape.`);
  }
  await context.close();
}

async function checkTextSpacing(browser, origin, failures) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  for (const route of primaryRoutes.filter((item) => ["home", "publications", "team", "contact"].includes(item.slug))) {
    const page = await context.newPage();
    const response = await page.goto(routeUrl(origin, route.path), { waitUntil: "domcontentloaded" });
    if (!response?.ok()) {
      failures.push(`text-spacing ${route.slug}: route did not load.`);
      await page.close();
      continue;
    }
    await preparePage(page, "light");
    await page.addStyleTag({
      content: `
        :where(p, li, dt, dd, address, a, button, h1, h2, h3, h4, span, strong, small, time) {
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
        p { margin-block-end: 2em !important; }
      `
    });
    const check = await inspectLayout(page);
    addLayoutFailures(failures, `text-spacing ${route.slug}`, check);
    await page.close();
  }
  await context.close();
}

async function runCompatibility(browser, browserName, origin, failures, records) {
  const viewports = browserName === "chromium"
    ? [...compatibilityViewports, ...stressViewports]
    : compatibilityViewports;

  for (const viewport of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme,
        reducedMotion: "reduce"
      });

      for (const route of primaryRoutes) {
        const page = await context.newPage();
        const label = `${browserName} ${route.slug} ${viewport.name} ${theme}`;
        const runtimeErrors = [];
        page.on("pageerror", (error) => runtimeErrors.push(error.message));
        page.on("console", (message) => {
          if (message.type() !== "error") return;
          const source = message.location().url || "";
          if (!source || source.startsWith(origin)) runtimeErrors.push(message.text());
        });
        const response = await page.goto(routeUrl(origin, route.path), { waitUntil: "domcontentloaded" });
        if (!response?.ok()) failures.push(`${label}: route returned ${response?.status() ?? "no response"}.`);
        await preparePage(page, theme);
        const check = await inspectLayout(page);
        addLayoutFailures(failures, label, check);
        if (runtimeErrors.length) failures.push(`${label}: runtime errors: ${runtimeErrors.join(" | ")}.`);
        records.push({ browser: browserName, route: route.slug, viewport, theme, check, runtimeErrors });
        await page.close();
      }

      await context.close();
    }
  }
}

async function runAxe(browser, AxeBuilder, origin, failures, axeResults) {
  for (const viewport of accessibilityViewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme,
        reducedMotion: "reduce"
      });

      for (const route of primaryRoutes) {
        const page = await context.newPage();
        const response = await page.goto(routeUrl(origin, route.path), { waitUntil: "domcontentloaded" });
        if (!response?.ok()) {
          failures.push(`axe ${route.slug} ${viewport.name} ${theme}: route did not load.`);
          await page.close();
          continue;
        }
        await preparePage(page, theme);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const compactViolations = results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary }))
        }));
        axeResults.push({ route: route.slug, viewport, theme, violations: compactViolations });
        for (const violation of compactViolations) {
          failures.push(
            `axe ${route.slug} ${viewport.name} ${theme}: ${violation.id} (${violation.impact || "unrated"}) at ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}.`
          );
        }
        await page.close();
      }

      await context.close();
    }
  }
}

async function checkLegacyRoutes(origin, failures) {
  for (const route of legacyRoutes) {
    const response = await fetch(routeUrl(origin, route.path));
    const html = await response.text();
    const targetWithBase = `${basePath}${route.target}`;
    if (!response.ok) failures.push(`${route.slug}: legacy route returned ${response.status}.`);
    if (!html.includes('name="robots" content="noindex,follow"')) failures.push(`${route.slug}: legacy route is not marked noindex.`);
    if (!html.includes('http-equiv="refresh"') || !html.includes(`url=${targetWithBase}`)) {
      failures.push(`${route.slug}: legacy route does not refresh to ${targetWithBase}.`);
    }
    if (!html.includes(`href="${targetWithBase}"`)) failures.push(`${route.slug}: visible destination link is missing.`);
  }
}

async function writeReports({ failures, records, axeResults }) {
  await fs.mkdir(outputRoot, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    standard: "WCAG 2.1 Level AA automated subset",
    browsers: selectedBrowsers,
    compatibilityViewports,
    stressViewports,
    primaryRoutes,
    legacyRoutes,
    failures,
    compatibilityChecks: records,
    accessibilityChecks: axeResults
  };
  await fs.writeFile(path.join(outputRoot, "quality-report.json"), JSON.stringify(report, null, 2), "utf8");

  const axeViolationCount = axeResults.reduce((sum, result) => sum + result.violations.length, 0);
  const summary = [
    "# Abraham Lab Site Quality Review",
    "",
    `- Browser engines: ${selectedBrowsers.join(", ")}`,
    `- Compatibility page checks: ${records.length}`,
    `- Automated WCAG 2.1 AA scans: ${axeResults.length}`,
    `- Axe violations: ${axeViolationCount}`,
    `- Total failures: ${failures.length}`,
    "",
    failures.length ? "## Failures" : "All automated release checks passed.",
    "",
    ...failures.map((failure) => `- ${failure}`)
  ].join("\n");
  await fs.writeFile(path.join(outputRoot, "summary.md"), summary, "utf8");
}

async function run() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  const server = await staticSite.start(port);
  const failures = [];
  const records = [];
  const axeResults = [];

  try {
    const [{ default: AxeBuilder }, playwright] = await Promise.all([
      import("@axe-core/playwright"),
      import("playwright")
    ]);
    const browserCatalog = {
      chromium: playwright.chromium,
      firefox: playwright.firefox,
      webkit: playwright.webkit
    };
    await checkLegacyRoutes(server.origin, failures);

    for (const browserName of selectedBrowsers) {
      const browserType = browserCatalog[browserName];
      let browser;
      try {
        browser = await browserType.launch({ headless: true });
      } catch (error) {
        throw new Error(`Unable to launch ${browserName}. Install the repo-controlled Playwright browsers with npm run quality:setup.\n${error instanceof Error ? error.message : String(error)}`);
      }

      try {
        await checkKeyboard(browser, browserName, server.origin, failures);
        await runCompatibility(browser, browserName, server.origin, failures, records);
        if (browserName === "chromium") {
          await checkTextSpacing(browser, server.origin, failures);
          await runAxe(browser, AxeBuilder, server.origin, failures, axeResults);
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    await server.close();
  }

  await writeReports({ failures, records, axeResults });
  if (failures.length) {
    if (process.env.GITHUB_ACTIONS === "true") {
      console.error(`::error title=Site quality review failed::${annotation(failures.join("\n"))}`);
    }
    throw new Error(`Site quality review failed with ${failures.length} issue(s). See output/quality-review/summary.md.`);
  }

  console.log(`Site quality review passed: ${records.length} compatibility checks and ${axeResults.length} WCAG scans.`);
}

async function runSelfTest() {
  if (primaryRoutes.length !== 7) throw new Error("Expected seven primary routes.");
  if (legacyRoutes.length !== 3) throw new Error("Expected three legacy routes.");
  if (!compatibilityViewports.some((viewport) => viewport.width === 390)) throw new Error("Phone viewport is missing.");
  if (!stressViewports.some((viewport) => viewport.width === 320)) throw new Error("320px reflow viewport is missing.");
  for (const requestPath of ["/..%5c..%5cpackage-lock.json", "/..%2f..%2fpackage-lock.json"]) {
    let rejected = false;
    try {
      staticSite.safeStaticRequestPath(requestPath);
    } catch {
      rejected = true;
    }
    if (!rejected) throw new Error(`Expected traversal path to be rejected: ${requestPath}`);
  }
  console.log("quality-review configuration self-test passed");
}

const entrypoint = process.env.QUALITY_REVIEW_SELF_TEST === "1" ? runSelfTest : run;
entrypoint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
