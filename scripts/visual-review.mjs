import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const siteRoot = path.join(repoRoot, "_site");
const outputRoot = path.join(repoRoot, "output", "visual-review");
const screenshotRoot = path.join(outputRoot, "screenshots");
const port = Number(process.env.VISUAL_REVIEW_PORT || 4173);

process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(repoRoot, ".cache", "ms-playwright");

const routes = [
  { slug: "home", path: "/" },
  { slug: "research", path: "/research/" },
  { slug: "publications", path: "/publications/" },
  { slug: "jonathan-abraham", path: "/jonathan-abraham/" },
  { slug: "people", path: "/people/" },
  { slug: "news", path: "/news/" },
  { slug: "contact", path: "/contact/" }
];

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "820", width: 820, height: 1180 },
  { name: "1024", width: 1024, height: 1366 },
  { name: "1280", width: 1280, height: 1440 },
  { name: "1440", width: 1440, height: 1600 }
];

const themes = ["light", "dark"];

function parseSelection(value, catalog, matcher) {
  if (!value) {
    return catalog;
  }

  const requested = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!requested.length) {
    return catalog;
  }

  const selected = catalog.filter((item) => requested.some((entry) => matcher(item, entry)));
  if (!selected.length) {
    throw new Error(`VISUAL_REVIEW selection did not match any items: ${requested.join(", ")}`);
  }

  return selected;
}

const selectedRoutes = parseSelection(process.env.VISUAL_REVIEW_ROUTES, routes, (route, entry) => {
  const normalizedEntry = entry.replace(/^\/+|\/+$/g, "");
  return route.slug === entry || route.path === entry || route.path.replace(/^\/+|\/+$/g, "") === normalizedEntry;
});

const selectedViewports = parseSelection(process.env.VISUAL_REVIEW_VIEWPORTS, viewports, (viewport, entry) => viewport.name === entry);
const selectedThemes = parseSelection(process.env.VISUAL_REVIEW_THEMES, themes, (theme, entry) => theme === entry);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveStaticPath(requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const normalized = path.posix.normalize(decoded);
  const safePath = normalized.replace(/^(\.\.(\/|\\|$))+/, "").replace(/^\/+/, "");
  const directPath = path.join(siteRoot, safePath);

  if (await fileExists(directPath)) {
    const stats = await fs.stat(directPath);
    if (stats.isDirectory()) {
      const indexPath = path.join(directPath, "index.html");
      if (await fileExists(indexPath)) {
        return indexPath;
      }
    } else {
      return directPath;
    }
  }

  const directoryIndexPath = path.join(siteRoot, safePath, "index.html");
  if (await fileExists(directoryIndexPath)) {
    return directoryIndexPath;
  }

  const fallback404 = path.join(siteRoot, "404.html");
  if (await fileExists(fallback404)) {
    return fallback404;
  }

  return null;
}

async function startStaticServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
      const filePath = await resolveStaticPath(url.pathname);

      if (!filePath) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[extension] || "application/octet-stream";
      const data = await fs.readFile(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Server error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  return server;
}

function screenshotName(route, viewport, theme) {
  return `${route.slug}-${viewport.name}-${theme}.png`;
}

async function writeIndex(manifest) {
  const cards = manifest
    .map(
      ({ route, viewport, theme, relativePath }) => `
        <article class="card">
          <h2>${route.slug} · ${viewport.name}px · ${theme}</h2>
          <p>${route.path}</p>
          <a href="${relativePath}"><img src="${relativePath}" alt="${route.slug} at ${viewport.name}px" loading="lazy" /></a>
        </article>
      `
    )
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Abraham Lab Visual Review</title>
    <style>
      body { margin: 0; font-family: Inter, Arial, sans-serif; background: #11161d; color: #f5f7fa; }
      main { width: min(1320px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0 48px; }
      h1 { margin: 0 0 10px; font-size: 2rem; }
      p { margin: 0 0 16px; color: rgba(245,247,250,0.78); }
      .meta { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 0 0 20px; font-size: 0.9rem; color: rgba(245,247,250,0.62); }
      .meta code { font: inherit; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
      .card { padding: 16px; border: 1px solid rgba(255,255,255,0.12); background: #171f29; }
      .card h2 { margin: 0 0 8px; font-size: 1rem; }
      .card p { font-size: 0.9rem; margin-bottom: 12px; }
      .card img { width: 100%; height: auto; display: block; border: 1px solid rgba(255,255,255,0.08); }
      a { color: inherit; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <h1>Abraham Lab Visual Review</h1>
      <p>Generated screenshots for all public routes across the required viewport matrix.</p>
      <div class="meta">
        <span>Routes: <code>${selectedRoutes.length}</code></span>
        <span>Viewports: <code>${selectedViewports.length}</code></span>
        <span>Themes: <code>${selectedThemes.join(", ")}</code></span>
      </div>
      <section class="grid">
        ${cards}
      </section>
    </main>
  </body>
</html>`;

  await fs.writeFile(path.join(outputRoot, "index.html"), html, "utf8");
}

async function run() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await ensureDir(screenshotRoot);
  const server = await startStaticServer();

  try {
    const { chromium } = await import("playwright");
    let browser;

    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Unable to launch Chromium for local visual review. On some macOS environments, headless Chromium fails with local MachPort permission errors even when the site build succeeds. The repo-integrated GitHub Actions workflow remains the canonical screenshot review path, and local review may require a headed browser outside this sandbox.\n\n${message}`
      );
    }

    const manifest = [];

    for (const viewport of selectedViewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1
      });

      for (const route of selectedRoutes) {
        for (const theme of selectedThemes) {
          const page = await context.newPage();
          await page.emulateMedia({ colorScheme: theme });
          const url = `http://127.0.0.1:${port}${route.path}`;
          await page.goto(url, { waitUntil: "networkidle" });
          await page.evaluate(async (activeTheme) => {
            if (document.fonts?.ready) {
              await document.fonts.ready;
            }
            document.documentElement.dataset.theme = activeTheme;
            document.documentElement.style.colorScheme = activeTheme;
            document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
            document.querySelector(".site-nav")?.classList.remove("is-open");
            document.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
          }, theme);
          await page.addStyleTag({
            content: `
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                scroll-behavior: auto !important;
              }
              .reveal {
                opacity: 1 !important;
                transform: none !important;
              }
            `
          });

          const fileName = screenshotName(route, viewport, theme);
          const filePath = path.join(screenshotRoot, fileName);
          await page.screenshot({
            path: filePath,
            fullPage: true,
            animations: "disabled"
          });

          manifest.push({
            route,
            viewport,
            theme,
            relativePath: `screenshots/${fileName}`
          });

          await page.close();
        }
      }

      await context.close();
    }

    await browser.close();
    await fs.writeFile(
      path.join(outputRoot, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8"
    );
    await writeIndex(manifest);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
