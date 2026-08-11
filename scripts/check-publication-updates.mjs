import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const userAgent = "AbrahamLabWebsite/1.0 (mailto:james_spencer@hms.harvard.edu)";

function transpileTsModule(source, filePath) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filePath,
    reportDiagnostics: false
  });

  const module = { exports: {} };
  const fn = new Function("exports", "require", "module", "__filename", "__dirname", result.outputText);
  fn(module.exports, require, module, filePath, path.dirname(filePath));
  return module.exports;
}

async function loadPublications() {
  const filePath = path.join(repoRoot, "src", "data", "publications.ts");
  const source = await fs.readFile(filePath, "utf8");
  return transpileTsModule(source, filePath).publications;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": userAgent },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

function normalizeDoi(value) {
  return String(value || "").trim().toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "");
}

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function findPubMedCandidates(localDois, localPmids, localTitles, fromDate, toDate) {
  const affiliation = '("Harvard Medical School"[Affiliation] OR "Howard Hughes Medical Institute"[Affiliation] OR "Brigham and Women\'s Hospital"[Affiliation])';
  const term = `Abraham Jonathan[Full Author Name] AND ${affiliation} AND ("${fromDate.replaceAll("-", "/")}"[Date - Publication] : "${toDate.replaceAll("-", "/")}"[Date - Publication])`;
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.search = new URLSearchParams({ db: "pubmed", term, retmode: "json", retmax: "100", sort: "pub date" });
  const search = await fetchJson(searchUrl);
  const ids = search.esearchresult?.idlist || [];
  if (!ids.length) return [];

  const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  summaryUrl.search = new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json" });
  const summary = await fetchJson(summaryUrl);

  return ids.flatMap((pmid) => {
    const record = summary.result?.[pmid];
    if (!record) return [];
    const doi = normalizeDoi(record.articleids?.find((item) => item.idtype === "doi")?.value);
    if (
      localPmids.has(String(pmid)) ||
      (doi && localDois.has(doi)) ||
      localTitles.has(normalizeTitle(record.title))
    ) return [];
    return [{
      source: "PubMed",
      title: record.title || "Untitled record",
      date: record.pubdate || "",
      doi: doi || null,
      pmid: String(pmid),
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
    }];
  });
}

async function findBioRxivCandidates(localDois, localTitles, fromDate, toDate) {
  const query = `SRC:PPR AND AUTH:"Abraham J" AND FIRST_PDATE:[${fromDate} TO ${toDate}]`;
  const searchUrl = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  searchUrl.search = new URLSearchParams({ query, format: "json", pageSize: "100", resultType: "core" });
  const search = await fetchJson(searchUrl);
  const possible = (search.resultList?.result || []).filter((record) => {
    const doi = normalizeDoi(record.doi);
    return doi.startsWith("10.64898/") || doi.startsWith("10.1101/");
  });

  const candidates = [];
  for (const record of possible) {
    const doi = normalizeDoi(record.doi);
    if (!doi || localDois.has(doi)) continue;
    const details = await fetchJson(`https://api.biorxiv.org/details/biorxiv/${doi}/na/json`);
    const item = details.collection?.[0];
    const corresponding = String(item?.author_corresponding || "").toLowerCase();
    const institution = String(item?.author_corresponding_institution || "").toLowerCase();
    if (!corresponding.includes("jonathan abraham") || !institution.includes("harvard")) continue;
    if (localTitles.has(normalizeTitle(item.title || record.title))) continue;
    candidates.push({
      source: "bioRxiv",
      title: item.title || record.title || "Untitled record",
      date: item.date || record.firstPublicationDate || "",
      doi,
      pmid: null,
      url: `https://www.biorxiv.org/content/${doi}v1`
    });
  }
  return candidates;
}

async function verifyPubMedMetadata(publications) {
  const withPmids = publications.filter((item) => item.pmid);
  if (!withPmids.length) return [];
  const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  summaryUrl.search = new URLSearchParams({
    db: "pubmed",
    id: withPmids.map((item) => item.pmid).join(","),
    retmode: "json"
  });
  const summary = await fetchJson(summaryUrl);
  const issues = [];

  for (const publication of withPmids) {
    const record = summary.result?.[publication.pmid];
    if (!record) {
      issues.push(`PubMed no longer returned PMID ${publication.pmid}: ${publication.title}`);
      continue;
    }
    const remoteDoi = normalizeDoi(record.articleids?.find((item) => item.idtype === "doi")?.value);
    const remotePmcid = String(record.articleids?.find((item) => item.idtype === "pmc")?.value || "");
    if (remoteDoi && remoteDoi !== normalizeDoi(publication.doi)) {
      issues.push(`DOI mismatch for PMID ${publication.pmid}: local ${publication.doi || "missing"}; PubMed ${remoteDoi}`);
    }
    if (remotePmcid && remotePmcid !== String(publication.pmcid || "")) {
      issues.push(`PMCID mismatch for PMID ${publication.pmid}: local ${publication.pmcid || "missing"}; PubMed ${remotePmcid}`);
    }
  }
  return issues;
}

async function findPublishedPreprints(publications) {
  const updates = [];
  for (const publication of publications.filter((item) => item.articleType === "Preprint" && item.doi)) {
    const details = await fetchJson(`https://api.biorxiv.org/details/biorxiv/${publication.doi}/na/json`);
    const publishedDoi = normalizeDoi(details.collection?.[0]?.published);
    if (publishedDoi && publishedDoi !== "na") {
      updates.push({ title: publication.title, preprintDoi: publication.doi, publishedDoi });
    }
  }
  return updates;
}

function renderMarkdown(report) {
  const lines = [
    "# Abraham Lab publication check",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `Local records: ${report.localRecordCount}`,
    `Candidates for review: ${report.candidates.length}`,
    `Preprints with a published DOI: ${report.publishedPreprints.length}`,
    `Local metadata issues: ${report.localIssues.length}`,
    `Remote metadata differences: ${report.remoteMetadataIssues.length}`,
    "",
    "The report is read-only. Confirm corresponding-author status before changing the site."
  ];

  if (report.candidates.length) {
    lines.push("", "## Candidate records");
    for (const item of report.candidates) {
      const ids = [item.doi && `DOI ${item.doi}`, item.pmid && `PMID ${item.pmid}`].filter(Boolean).join("; ");
      lines.push(`- [${item.title}](${item.url}) — ${item.source}${item.date ? `; ${item.date}` : ""}${ids ? `; ${ids}` : ""}`);
    }
  }

  if (report.publishedPreprints.length) {
    lines.push("", "## Preprints with published versions");
    for (const item of report.publishedPreprints) {
      lines.push(`- ${item.title} — ${item.preprintDoi} → ${item.publishedDoi}`);
    }
  }

  if (report.localIssues.length) {
    lines.push("", "## Local metadata issues", ...report.localIssues.map((item) => `- ${item}`));
  }

  if (report.remoteMetadataIssues.length) {
    lines.push("", "## Remote metadata differences", ...report.remoteMetadataIssues.map((item) => `- ${item}`));
  }

  if (report.sourceErrors.length) {
    lines.push("", "## Source warnings", ...report.sourceErrors.map((item) => `- ${item}`));
  }

  if (!report.candidates.length && !report.publishedPreprints.length && !report.localIssues.length && !report.remoteMetadataIssues.length) {
    lines.push("", "No publication changes require review.");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const publications = await loadPublications();
  const localDois = new Set(publications.map((item) => normalizeDoi(item.doi)).filter(Boolean));
  const localPmids = new Set(publications.map((item) => String(item.pmid || "")).filter(Boolean));
  const localTitles = new Set(publications.map((item) => normalizeTitle(item.title)).filter(Boolean));
  const localIssues = [];
  const sourceErrors = [];

  for (const publication of publications) {
    if (!publication.doi) localIssues.push(`Missing DOI: ${publication.title}`);
    if (publication.articleType !== "Preprint" && !publication.pmid) {
      localIssues.push(`Missing PMID: ${publication.title}`);
    }
  }

  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear() - 2, now.getUTCMonth(), now.getUTCDate()));
  const to = new Date(Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth(), now.getUTCDate()));
  const fromDate = isoDate(from);
  const toDate = isoDate(to);

  let pubmedCandidates = [];
  let biorxivCandidates = [];
  let publishedPreprints = [];
  let remoteMetadataIssues = [];
  try {
    pubmedCandidates = await findPubMedCandidates(localDois, localPmids, localTitles, fromDate, toDate);
  } catch (error) {
    sourceErrors.push(`PubMed check failed: ${error.message}`);
  }
  try {
    biorxivCandidates = await findBioRxivCandidates(localDois, localTitles, fromDate, toDate);
  } catch (error) {
    sourceErrors.push(`bioRxiv discovery failed: ${error.message}`);
  }
  try {
    publishedPreprints = await findPublishedPreprints(publications);
  } catch (error) {
    sourceErrors.push(`bioRxiv publication-status check failed: ${error.message}`);
  }
  try {
    remoteMetadataIssues = await verifyPubMedMetadata(publications);
  } catch (error) {
    sourceErrors.push(`PubMed metadata comparison failed: ${error.message}`);
  }

  const candidates = [...pubmedCandidates, ...biorxivCandidates]
    .filter((item, index, items) => items.findIndex((other) => other.doi === item.doi && other.pmid === item.pmid) === index)
    .sort((left, right) => String(right.date).localeCompare(String(left.date)));

  const report = {
    generatedAt: new Date().toISOString(),
    queryWindow: { from: fromDate, to: toDate },
    localRecordCount: publications.length,
    candidates,
    publishedPreprints,
    localIssues,
    remoteMetadataIssues,
    sourceErrors
  };
  const markdown = renderMarkdown(report);
  const outputDir = path.join(repoRoot, "output", "publication-check");
  await fs.mkdir(outputDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outputDir, "report.md"), markdown),
    fs.writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`)
  ]);

  process.stdout.write(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  for (const item of [...candidates, ...publishedPreprints]) {
    console.log(`::warning title=Publication review::${item.title}`);
  }
  for (const item of [...localIssues, ...remoteMetadataIssues, ...sourceErrors]) {
    console.log(`::warning title=Publication check::${item}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
