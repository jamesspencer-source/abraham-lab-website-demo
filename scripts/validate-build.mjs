import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const siteRoot = path.join(repoRoot, "_site");
const rawBase = String(process.env.SITE_BASE_PATH || "").trim();
const basePath = rawBase ? `/${rawBase.replace(/^\/+|\/+$/g, "")}` : "";
const failures = [];

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(entryPath));
    else files.push(entryPath);
  }
  return files;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function insideSiteRoot(candidate) {
  const relative = path.relative(siteRoot, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function resolveLocalTarget(htmlFile, rawTarget) {
  const withoutFragment = rawTarget.split("#")[0].split("?")[0];
  if (!withoutFragment) return true;

  let targetPath;
  if (withoutFragment.startsWith("/")) {
    const withoutBase = basePath && (withoutFragment === basePath || withoutFragment.startsWith(`${basePath}/`))
      ? withoutFragment.slice(basePath.length) || "/"
      : withoutFragment;
    targetPath = path.resolve(siteRoot, withoutBase.replace(/^\/+/, ""));
  } else {
    targetPath = path.resolve(path.dirname(htmlFile), withoutFragment);
  }

  if (!insideSiteRoot(targetPath)) return false;
  if (await exists(targetPath)) {
    const stats = await fs.stat(targetPath);
    if (stats.isFile()) return true;
    return exists(path.join(targetPath, "index.html"));
  }
  if (path.extname(targetPath)) return false;
  return exists(path.join(targetPath, "index.html"));
}

const requiredPages = [
  "index.html",
  "publications/index.html",
  "jonathan-abraham/index.html",
  "team/index.html",
  "news/index.html",
  "contact/index.html",
  "people/index.html",
  "research/index.html",
  "404.html"
];

for (const relativePath of requiredPages) {
  if (!await exists(path.join(siteRoot, relativePath))) failures.push(`Missing built page: ${relativePath}`);
}

const allFiles = await walk(siteRoot);
const htmlFiles = allFiles.filter((filePath) => filePath.endsWith(".html"));
for (const htmlFile of htmlFiles) {
  const html = await fs.readFile(htmlFile, "utf8");
  const relative = path.relative(siteRoot, htmlFile);

  for (const forbidden of [
    { pattern: /Associate Professor of Microbiology, Harvard Medical School/i, label: "old Jonathan title" },
    { pattern: /\/assets\/images\/people\//i, label: "person image reference" },
    { pattern: /\bNRB\b/, label: "old building name" },
    { pattern: /fonts\.(?:googleapis|gstatic)\.com/i, label: "external Google font request" }
  ]) {
    if (forbidden.pattern.test(html)) failures.push(`${relative} contains ${forbidden.label}.`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(target)) continue;
    if (!await resolveLocalTarget(htmlFile, target)) {
      failures.push(`${relative} has a broken local target: ${target}`);
    }
  }
}

if (allFiles.some((filePath) => filePath.includes(`${path.sep}assets${path.sep}images${path.sep}people${path.sep}`))) {
  failures.push("Built site contains personnel image files.");
}

if (!allFiles.some((filePath) => filePath.endsWith(".woff2"))) {
  failures.push("Built site is missing self-hosted font files.");
}

const sitemap = await fs.readFile(path.join(siteRoot, "sitemap.xml"), "utf8");
if (sitemap.includes("/research/") || sitemap.includes("/people/")) {
  failures.push("Sitemap includes a legacy route.");
}

const publicationsPage = await fs.readFile(path.join(siteRoot, "publications", "index.html"), "utf8");
for (const marker of ["Full record on PubMed", "Jump to year", "PDB", "EMDB", "Open access", "Print or save PDF"]) {
  if (!publicationsPage.includes(marker)) failures.push(`Publications page is missing "${marker}".`);
}

const teamPage = await fs.readFile(path.join(siteRoot, "team", "index.html"), "utf8");
for (const programUrl of [
  "https://virologyphd.hms.harvard.edu/",
  "https://bbsphd.hms.harvard.edu/"
]) {
  if (!teamPage.includes(programUrl)) failures.push(`Team page is missing program link: ${programUrl}`);
}

const contactPage = await fs.readFile(path.join(siteRoot, "contact", "index.html"), "utf8");
if (!/loading="lazy"/.test(contactPage)) failures.push("Contact map must load lazily.");
if (!contactPage.includes("Graduate students join through Harvard training programs.")) {
  failures.push("Contact page is missing graduate training guidance.");
}
for (const programUrl of [
  "https://virologyphd.hms.harvard.edu/",
  "https://bbsphd.hms.harvard.edu/",
  "https://biophysics.fas.harvard.edu/"
]) {
  if (!contactPage.includes(programUrl)) failures.push(`Contact page is missing program link: ${programUrl}`);
}

const homePage = await fs.readFile(path.join(siteRoot, "index.html"), "utf8");
if (!homePage.includes("https://accessibility.huit.harvard.edu/digital-accessibility-policy")) {
  failures.push("Footer is missing Harvard's digital accessibility link.");
}
for (const dimensionMarker of ['width="405" height="53"', 'width="1918" height="445"']) {
  if (!homePage.includes(dimensionMarker)) failures.push(`Homepage affiliation logo is missing fixed dimensions: ${dimensionMarker}`);
}

if (failures.length) {
  console.error("Built-site validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Built-site validation passed: ${htmlFiles.length} HTML pages and ${allFiles.length} files checked.`);
}
