import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const siteRoot = path.join(repoRoot, "_site");
const outputRoot = path.join(repoRoot, "output", "link-check");
const userAgent = "AbrahamLabWebsite/1.0 (mailto:james_spencer@hms.harvard.edu)";
const failOnBroken = process.env.LINK_CHECK_FAIL_ON_BROKEN === "1";

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

function collectExternalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref=["'](https:\/\/[^"']+)["']/gi)]
    .map((match) => match[1].replaceAll("&amp;", "&"));
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { Accept: "text/html,application/xhtml+xml,application/json;q=0.8,*/*;q=0.5", "User-Agent": userAgent },
      signal: AbortSignal.timeout(20000)
    });
    const status = response.status;
    await response.body?.cancel();
    if (status >= 200 && status < 400) return { url, status, state: "ok" };
    if ([401, 403, 405, 429].includes(status)) return { url, status, state: "restricted" };
    if ([404, 410].includes(status)) return { url, status, state: "broken" };
    return { url, status, state: "warning" };
  } catch (error) {
    return { url, status: null, state: "warning", detail: error.message };
  }
}

async function checkInBatches(urls, concurrency = 6) {
  const results = new Array(urls.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
    while (cursor < urls.length) {
      const index = cursor++;
      results[index] = await checkUrl(urls[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

function renderMarkdown(report) {
  const lines = [
    "# Abraham Lab external link check",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `Links checked: ${report.total}`,
    `Reachable: ${report.counts.ok}`,
    `Restricted by source: ${report.counts.restricted}`,
    `Broken: ${report.counts.broken}`,
    `Other warnings: ${report.counts.warning}`,
    "",
    "Restricted and warning results require review; they do not fail the maintenance workflow."
  ];

  for (const state of ["broken", "warning", "restricted"]) {
    const items = report.results.filter((item) => item.state === state);
    if (!items.length) continue;
    lines.push("", `## ${state[0].toUpperCase()}${state.slice(1)}`);
    for (const item of items) {
      const detail = item.status ?? item.detail ?? "No response";
      lines.push(`- ${detail}: ${item.url}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const htmlFiles = (await walk(siteRoot)).filter((filePath) => filePath.endsWith(".html"));
  const links = new Set();
  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, "utf8");
    for (const url of collectExternalLinks(html)) links.add(url);
  }

  const results = await checkInBatches([...links].sort());
  const counts = { ok: 0, restricted: 0, broken: 0, warning: 0 };
  for (const result of results) counts[result.state] += 1;
  const report = { generatedAt: new Date().toISOString(), total: results.length, counts, results };

  await fs.mkdir(outputRoot, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outputRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`),
    fs.writeFile(path.join(outputRoot, "report.md"), renderMarkdown(report))
  ]);

  console.log(`External links checked: ${counts.ok} reachable, ${counts.broken} broken, ${counts.restricted + counts.warning} need review.`);
  if (failOnBroken && counts.broken > 0) process.exitCode = 1;
}

await main();
