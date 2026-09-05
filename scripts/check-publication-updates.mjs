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

async function fetchJson(url, fetchImpl) {
  const response = await fetchImpl(url, {
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

function requireCompleteSearch(records, count, source) {
  if (!Array.isArray(records) || count === undefined || count === null || count === "" || !Number.isInteger(Number(count)) || Number(count) < 0) {
    throw new Error(`${source} returned an invalid search response`);
  }
  if (Number(count) !== records.length) {
    throw new Error(`${source} returned ${records.length} of ${count} records; the search is incomplete`);
  }
  return records;
}

function requirePubMedRecord(summary, pmid) {
  const record = summary?.result?.[pmid];
  if (!record || record.error || typeof record.title !== "string" || !Array.isArray(record.articleids)) {
    throw new Error(`PubMed did not return complete metadata for PMID ${pmid}`);
  }
  return record;
}

function requireEuropePmcPreprint(record) {
  if (!record || record.source !== "PPR" || typeof record.doi !== "string" || !/^10\.\d{4,9}\/\S+$/.test(normalizeDoi(record.doi))) {
    throw new Error("Europe PMC returned invalid preprint source or DOI metadata");
  }
  // Core metadata names the server; bioRxiv and medRxiv share DOI prefixes.
  const publisher = record.bookOrReportDetails?.publisher;
  if (typeof publisher !== "string" || !publisher.trim()) {
    throw new Error("Europe PMC returned missing or malformed preprint provider metadata");
  }
  const provider = publisher.trim().toLowerCase();
  const knownNonBioRxivProviders = ["medrxiv", "research square", "psyarxiv", "authorea preprints", "f1000res", "preprints.org"];
  if (provider !== "biorxiv" && !knownNonBioRxivProviders.includes(provider)) {
    throw new Error(`Europe PMC returned an unknown preprint provider: ${publisher}`);
  }
  return { doi: normalizeDoi(record.doi), provider };
}

function requireBioRxivRecord(details, doi) {
  const records = details?.collection;
  if (!Array.isArray(records) || !records.length || details.messages?.some((item) => item.status !== "ok")) {
    throw new Error(`bioRxiv did not return metadata for DOI ${doi}`);
  }
  const item = [...records].sort((left, right) => Number(right.version || 0) - Number(left.version || 0))[0];
  if (normalizeDoi(item.doi) !== normalizeDoi(doi) || typeof item.title !== "string") {
    throw new Error(`bioRxiv returned invalid metadata for DOI ${doi}`);
  }
  return item;
}

async function findPubMedCandidates(localDois, localPmids, localTitles, fromDate, toDate, getJson, sourceErrors) {
  const affiliation = '("Harvard Medical School"[Affiliation] OR "Howard Hughes Medical Institute"[Affiliation] OR "Brigham and Women\'s Hospital"[Affiliation])';
  const term = `Abraham Jonathan[Full Author Name] AND ${affiliation} AND ("${fromDate.replaceAll("-", "/")}"[Date - Publication] : "${toDate.replaceAll("-", "/")}"[Date - Publication])`;
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.search = new URLSearchParams({ db: "pubmed", term, retmode: "json", retmax: "100", sort: "pub date" });
  const search = await getJson(searchUrl);
  const ids = requireCompleteSearch(search.esearchresult?.idlist, search.esearchresult?.count, "PubMed");
  if (!ids.length) return [];

  const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  summaryUrl.search = new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json" });
  const summary = await getJson(summaryUrl);

  return ids.flatMap((pmid) => {
    let record;
    try {
      record = requirePubMedRecord(summary, pmid);
    } catch (error) {
      sourceErrors.push(`PubMed candidate check failed: ${error.message}`);
      return [];
    }
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

async function findBioRxivCandidates(localDois, localTitles, fromDate, toDate, getJson, sourceErrors) {
  const query = `SRC:PPR AND AUTH:"Abraham J" AND FIRST_PDATE:[${fromDate} TO ${toDate}]`;
  const searchUrl = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  searchUrl.search = new URLSearchParams({ query, format: "json", pageSize: "100", resultType: "core" });
  const search = await getJson(searchUrl);
  const possible = requireCompleteSearch(search.resultList?.result, search.hitCount, "Europe PMC preprint discovery");

  const candidates = [];
  for (const record of possible) {
    let doi;
    let provider;
    try {
      ({ doi, provider } = requireEuropePmcPreprint(record));
    } catch (error) {
      const id = typeof record?.id === "string" ? record.id : "unknown ID";
      const label = typeof record?.doi === "string" && record.doi ? record.doi : id;
      sourceErrors.push(`Europe PMC preprint metadata check failed for ${label}: ${error.message}`);
      continue;
    }
    if (provider !== "biorxiv" || localDois.has(doi)) continue;
    let item;
    try {
      const details = await getJson(`https://api.biorxiv.org/details/biorxiv/${doi}/na/json`);
      item = requireBioRxivRecord(details, doi);
      if (typeof item.author_corresponding !== "string" || typeof item.author_corresponding_institution !== "string") {
        throw new Error(`bioRxiv returned no corresponding-author metadata for DOI ${doi}`);
      }
    } catch (error) {
      sourceErrors.push(`bioRxiv candidate check failed for ${doi}: ${error.message}`);
      continue;
    }
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

async function verifyPubMedMetadata(publications, getJson, sourceErrors) {
  const withPmids = publications.filter((item) => item.pmid);
  if (!withPmids.length) return [];
  const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  summaryUrl.search = new URLSearchParams({
    db: "pubmed",
    id: withPmids.map((item) => item.pmid).join(","),
    retmode: "json"
  });
  const summary = await getJson(summaryUrl);
  const issues = [];

  for (const publication of withPmids) {
    let record;
    try {
      record = requirePubMedRecord(summary, publication.pmid);
    } catch (error) {
      sourceErrors.push(`PubMed metadata comparison failed: ${error.message}`);
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

async function findPublishedPreprints(publications, getJson, sourceErrors) {
  const updates = [];
  for (const publication of publications.filter((item) => item.articleType === "Preprint" && item.doi)) {
    try {
      const details = await getJson(`https://api.biorxiv.org/details/biorxiv/${publication.doi}/na/json`);
      const item = requireBioRxivRecord(details, publication.doi);
      if (typeof item.published !== "string" || !item.published.trim()) {
        throw new Error(`bioRxiv returned no publication status for DOI ${publication.doi}`);
      }
      const publishedDoi = normalizeDoi(item.published);
      if (publishedDoi !== "na") {
        if (!/^10\.\d{4,9}\/\S+$/.test(publishedDoi)) throw new Error(`bioRxiv returned an invalid published DOI for ${publication.doi}`);
        updates.push({ title: publication.title, preprintDoi: publication.doi, publishedDoi });
      }
    } catch (error) {
      sourceErrors.push(`bioRxiv publication-status check failed for ${publication.doi}: ${error.message}`);
    }
  }
  return updates;
}

export function renderMarkdown(report) {
  const lines = [
    "# Abraham Lab publication check",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status === "incomplete" ? "INCOMPLETE" : "Complete"}`,
    "",
    `Local records: ${report.localRecordCount}`,
    `Candidates for review: ${report.candidates.length}`,
    `Preprints with a published DOI: ${report.publishedPreprints.length}`,
    `Local metadata issues: ${report.localIssues.length}`,
    `Remote metadata differences: ${report.remoteMetadataIssues.length}`,
    "",
    "The report is read-only. Confirm corresponding-author status before changing the site."
  ];

  if (report.status === "incomplete") {
    lines.push("", "**This check is incomplete. Results below are partial; additional changes may remain undetected. Do not advance the publication review date.**");
  }

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
    lines.push("", "## Failed source checks", ...report.sourceErrors.map((item) => `- ${item}`));
  }

  if (report.status === "complete" && !report.candidates.length && !report.publishedPreprints.length && !report.localIssues.length && !report.remoteMetadataIssues.length) {
    lines.push("", "No publication changes require review.");
  }

  return `${lines.join("\n")}\n`;
}

export async function collectPublicationReport({ publications, fetchImpl = globalThis.fetch, now = new Date() }) {
  const getJson = (url) => fetchJson(url, fetchImpl);
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

  const from = new Date(Date.UTC(now.getUTCFullYear() - 2, now.getUTCMonth(), now.getUTCDate()));
  const to = new Date(Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth(), now.getUTCDate()));
  const fromDate = isoDate(from);
  const toDate = isoDate(to);

  let pubmedCandidates = [];
  let biorxivCandidates = [];
  let publishedPreprints = [];
  let remoteMetadataIssues = [];
  try {
    pubmedCandidates = await findPubMedCandidates(localDois, localPmids, localTitles, fromDate, toDate, getJson, sourceErrors);
  } catch (error) {
    sourceErrors.push(`PubMed check failed: ${error.message}`);
  }
  try {
    biorxivCandidates = await findBioRxivCandidates(localDois, localTitles, fromDate, toDate, getJson, sourceErrors);
  } catch (error) {
    sourceErrors.push(`bioRxiv discovery failed: ${error.message}`);
  }
  try {
    publishedPreprints = await findPublishedPreprints(publications, getJson, sourceErrors);
  } catch (error) {
    sourceErrors.push(`bioRxiv publication-status check failed: ${error.message}`);
  }
  try {
    remoteMetadataIssues = await verifyPubMedMetadata(publications, getJson, sourceErrors);
  } catch (error) {
    sourceErrors.push(`PubMed metadata comparison failed: ${error.message}`);
  }

  const candidates = [...pubmedCandidates, ...biorxivCandidates]
    .filter((item, index, items) => items.findIndex((other) => other.doi === item.doi && other.pmid === item.pmid) === index)
    .sort((left, right) => String(right.date).localeCompare(String(left.date)));

  return {
    status: sourceErrors.length ? "incomplete" : "complete",
    generatedAt: now.toISOString(),
    queryWindow: { from: fromDate, to: toDate },
    localRecordCount: publications.length,
    candidates,
    publishedPreprints,
    localIssues,
    remoteMetadataIssues,
    sourceErrors
  };
}

export function reportExitCode(report) {
  return report.sourceErrors.length || report.localIssues.length || report.remoteMetadataIssues.length ? 1 : 0;
}

export async function writePublicationReport(report, {
  outputDir = path.join(repoRoot, "output", "publication-check"),
  summaryPath = process.env.GITHUB_STEP_SUMMARY
} = {}) {
  const markdown = renderMarkdown(report);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "report.md"), markdown);
  await fs.writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  if (summaryPath) await fs.appendFile(summaryPath, markdown);
  return markdown;
}

async function main() {
  const report = await collectPublicationReport({ publications: await loadPublications() });
  const markdown = await writePublicationReport(report);
  process.stdout.write(markdown);
  const annotation = (value) => String(value).replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
  for (const item of [...report.candidates, ...report.publishedPreprints]) {
    console.log(`::warning title=Publication review::${annotation(item.title)}`);
  }
  for (const item of [...report.localIssues, ...report.remoteMetadataIssues, ...report.sourceErrors]) {
    console.error(`::error title=Publication check::${annotation(item)}`);
  }
  process.exitCode = reportExitCode(report);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  });
}
