import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  collectPublicationReport,
  renderMarkdown,
  reportExitCode,
  writePublicationReport
} from "./check-publication-updates.mjs";

const now = new Date("2026-09-05T12:00:00.000Z");
const journal = { title: "Existing journal fixture", doi: "10.1000/journal", pmid: "1", articleType: "Research article" };
const preprint = { title: "Existing preprint fixture", doi: "10.1101/2026.01.01.123456", articleType: "Preprint" };
const candidateDoi = "10.1101/2026.02.01.123456";

function discoveryRecord(doi, extra = {}) {
  return { source: "PPR", doi, bookOrReportDetails: { publisher: "bioRxiv" }, ...extra };
}

function bioRxivRecord(doi, extra = {}) {
  return {
    doi,
    title: "Candidate fixture",
    version: "1",
    published: "NA",
    author_corresponding: "Jonathan Abraham",
    author_corresponding_institution: "Harvard Medical School",
    ...extra
  };
}

function fixtureFetch(overrides = {}) {
  const calls = [];
  const fetchImpl = async (input) => {
    const url = new URL(input);
    calls.push(url);
    let payload;
    if (url.hostname === "eutils.ncbi.nlm.nih.gov" && url.pathname.endsWith("esearch.fcgi")) {
      payload = overrides.pubmedSearch ?? { esearchresult: { count: "0", idlist: [] } };
    } else if (url.hostname === "eutils.ncbi.nlm.nih.gov" && url.pathname.endsWith("esummary.fcgi")) {
      payload = overrides.pubmedSummary ?? {
        result: { "1": { title: journal.title, articleids: [{ idtype: "doi", value: journal.doi }] } }
      };
    } else if (url.hostname === "www.ebi.ac.uk") {
      payload = overrides.discovery ?? { hitCount: 0, resultList: { result: [] } };
    } else if (url.hostname === "api.biorxiv.org") {
      const doi = url.pathname.replace("/details/biorxiv/", "").replace("/na/json", "");
      payload = overrides.details ?? { messages: [{ status: "ok" }], collection: [bioRxivRecord(doi)] };
    } else {
      throw new Error(`Unexpected fixture URL: ${url}`);
    }
    if (typeof payload === "function") payload = await payload(url);
    return payload instanceof Response ? payload : Response.json(payload);
  };
  return { calls, fetchImpl };
}

async function check(overrides = {}, publications = [journal, preprint]) {
  const fixture = fixtureFetch(overrides);
  const report = await collectPublicationReport({ publications, fetchImpl: fixture.fetchImpl, now });
  return { report, calls: fixture.calls };
}

test("a complete check with no changes succeeds", async () => {
  const { report } = await check();
  assert.equal(report.status, "complete");
  assert.equal(report.generatedAt, now.toISOString());
  assert.equal(reportExitCode(report), 0);
  assert.deepEqual(report.sourceErrors, []);
  assert.match(renderMarkdown(report), /No publication changes require review\./);
});

test("an unavailable required source fails but does not stop independent checks", async () => {
  const { report, calls } = await check({ pubmedSearch: () => new Response("Unavailable", { status: 503 }) });
  assert.equal(report.status, "incomplete");
  assert.equal(reportExitCode(report), 1);
  assert.match(report.sourceErrors[0], /PubMed check failed: 503/);
  assert.ok(calls.some((url) => url.hostname === "www.ebi.ac.uk"));
  assert.ok(calls.some((url) => url.hostname === "api.biorxiv.org"));
  assert.ok(calls.some((url) => url.pathname.endsWith("esummary.fcgi")));
  const markdown = renderMarkdown(report);
  assert.match(markdown, /Status: INCOMPLETE/);
  assert.match(markdown, /Do not advance the publication review date/);
  assert.doesNotMatch(markdown, /No publication changes require review/);
});

test("a transport failure in preprint discovery produces an incomplete result", async () => {
  const { report } = await check({ discovery: () => { throw new Error("Offline fixture"); } });
  assert.equal(report.status, "incomplete");
  assert.equal(reportExitCode(report), 1);
  assert.match(report.sourceErrors.join("\n"), /bioRxiv discovery failed: Offline fixture/);
});

test("an API error delivered with HTTP 200 is not an empty successful search", async () => {
  for (const overrides of [
    { pubmedSearch: { error: "Source error" } },
    { discovery: { error: "Source error" } },
    { details: { messages: [{ status: "no posts found" }], collection: [] } }
  ]) {
    const { report } = await check(overrides);
    assert.equal(report.status, "incomplete");
    assert.equal(reportExitCode(report), 1);
    assert.doesNotMatch(renderMarkdown(report), /No publication changes require review/);
  }
});

test("invalid JSON is a source failure", async () => {
  const { report } = await check({ discovery: () => new Response("not-json") });
  assert.equal(report.status, "incomplete");
  assert.equal(reportExitCode(report), 1);
});

test("truncated search responses cannot be reported as complete", async () => {
  for (const overrides of [
    { pubmedSearch: { esearchresult: { count: "101", idlist: ["1"] } } },
    { discovery: { hitCount: 101, resultList: { result: [] } } }
  ]) {
    const { report } = await check(overrides);
    assert.equal(report.status, "incomplete");
    assert.match(report.sourceErrors.join("\n"), /the search is incomplete/);
  }
});

test("missing requested PubMed records fail discovery and metadata checks", async () => {
  const { report } = await check({
    pubmedSearch: { esearchresult: { count: "1", idlist: ["1"] } },
    pubmedSummary: { result: {} }
  });
  assert.equal(report.status, "incomplete");
  assert.equal(report.sourceErrors.length, 2);
  assert.equal(reportExitCode(report), 1);
});

test("a partial report retains candidates from a source that completed", async () => {
  const { report } = await check({
    pubmedSearch: () => { throw new Error("Offline fixture"); },
    discovery: { hitCount: 1, resultList: { result: [discoveryRecord(candidateDoi)] } }
  });
  assert.equal(report.status, "incomplete");
  assert.equal(report.candidates[0].doi, candidateDoi);
  assert.match(renderMarkdown(report), /Candidate fixture/);
});

test("a missing PubMed candidate does not discard other returned records", async () => {
  const { report } = await check({
    pubmedSearch: { esearchresult: { count: "2", idlist: ["2", "3"] } },
    pubmedSummary: { result: {
      "2": { title: "Journal candidate fixture", articleids: [{ idtype: "doi", value: "10.1000/new" }] }
    } }
  }, []);
  assert.equal(report.status, "incomplete");
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].pmid, "2");
  assert.equal(reportExitCode(report), 1);
});

test("one failed preprint candidate does not discard another verified candidate", async () => {
  const failingDoi = "10.1101/2026.03.01.123456";
  const { report } = await check({
    discovery: { hitCount: 2, resultList: { result: [discoveryRecord(failingDoi), discoveryRecord(candidateDoi)] } },
    details: (url) => {
      if (url.pathname.includes(failingDoi)) throw new Error("Offline fixture");
      const doi = url.pathname.includes(candidateDoi) ? candidateDoi : preprint.doi;
      return { collection: [bioRxivRecord(doi)] };
    }
  });
  assert.equal(report.status, "incomplete");
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].doi, candidateDoi);
});

test("publication-status checks keep successful results after a per-record failure", async () => {
  const otherPreprint = { ...preprint, doi: candidateDoi };
  const { report } = await check({
    details: (url) => {
      if (url.pathname.includes(preprint.doi)) throw new Error("Offline fixture");
      return { collection: [bioRxivRecord(candidateDoi, { published: "10.1000/published" })] };
    }
  }, [preprint, otherPreprint]);
  assert.equal(report.status, "incomplete");
  assert.equal(report.publishedPreprints.length, 1);
  assert.equal(report.publishedPreprints[0].publishedDoi, "10.1000/published");
});

test("publication status uses the newest returned version", async () => {
  const { report } = await check({ details: {
    collection: [
      bioRxivRecord(preprint.doi),
      bioRxivRecord(preprint.doi, { version: "2", published: "https://doi.org/10.1000/published" })
    ]
  } });
  assert.equal(report.status, "complete");
  assert.equal(report.publishedPreprints[0].publishedDoi, "10.1000/published");
  assert.equal(reportExitCode(report), 0);
});

test("missing or malformed publication status is not treated as unpublished", async () => {
  for (const published of [undefined, "", "unavailable"]) {
    const { report } = await check({ details: { collection: [bioRxivRecord(preprint.doi, { published })] } });
    assert.equal(report.status, "incomplete");
    assert.equal(reportExitCode(report), 1);
  }
});

test("candidates require human review but do not make a completed source check fail", async () => {
  const { report } = await check({ discovery: { hitCount: 1, resultList: { result: [discoveryRecord(candidateDoi)] } } });
  assert.equal(report.status, "complete");
  assert.equal(reportExitCode(report), 0);
  assert.equal(report.candidates.length, 1);
  assert.doesNotMatch(renderMarkdown(report), /No publication changes require review/);
});

test("Europe PMC medRxiv metadata excludes both shared DOI prefixes before bioRxiv requests", async () => {
  const records = [
    "10.64898/2026.07.27.26350454",
    "10.64898/2026.04.26.26351792",
    "10.64898/2026.01.12.26343538",
    "10.1101/2025.05.23.25328255"
  ].map((doi) => discoveryRecord(doi, { bookOrReportDetails: { publisher: "medRxiv" } }));
  const { report, calls } = await check({ discovery: { hitCount: records.length, resultList: { result: records } } }, []);
  assert.equal(report.status, "complete");
  assert.equal(reportExitCode(report), 0);
  assert.deepEqual(report.sourceErrors, []);
  assert.deepEqual(report.candidates, []);
  assert.equal(calls.filter((url) => url.hostname === "api.biorxiv.org").length, 0);
});

test("other explicitly recognized Europe PMC providers are excluded", async () => {
  const records = ["Research Square", "PsyArXiv", "Authorea Preprints", "F1000Res", "Preprints.org", " MEDRXIV "]
    .map((publisher, index) => discoveryRecord(`10.1000/provider-${index}`, { bookOrReportDetails: { publisher } }));
  const { report, calls } = await check({ discovery: { hitCount: records.length, resultList: { result: records } } }, []);
  assert.equal(report.status, "complete");
  assert.deepEqual(report.sourceErrors, []);
  assert.deepEqual(report.candidates, []);
  assert.equal(calls.filter((url) => url.hostname === "api.biorxiv.org").length, 0);
});

test("identified bioRxiv records with either DOI prefix are verified through bioRxiv", async () => {
  const dois = [candidateDoi, "10.64898/2026.08.22.744730"];
  const records = dois.map((doi) => discoveryRecord(doi, { bookOrReportDetails: { publisher: " BIORXIV " } }));
  const { report, calls } = await check({ discovery: { hitCount: records.length, resultList: { result: records } } }, []);
  assert.equal(report.status, "complete");
  assert.equal(reportExitCode(report), 0);
  assert.deepEqual(report.sourceErrors, []);
  assert.deepEqual(report.candidates.map((item) => item.doi), dois);
  assert.ok(report.candidates.every((item) => item.source === "bioRxiv" && item.title === "Candidate fixture"));
  assert.deepEqual(calls.filter((url) => url.hostname === "api.biorxiv.org").map((url) => url.pathname),
    dois.map((doi) => `/details/biorxiv/${doi}/na/json`));
  assert.equal(calls.find((url) => url.hostname === "www.ebi.ac.uk").searchParams.get("resultType"), "core");
});

test("provider identification does not replace bioRxiv record and corresponding-author verification", async () => {
  for (const details of [
    { messages: [{ status: "no posts found" }], collection: [] },
    { collection: [bioRxivRecord("10.1000/wrong")] },
    { collection: [bioRxivRecord(candidateDoi, { author_corresponding: undefined })] },
    { collection: [bioRxivRecord(candidateDoi, { author_corresponding_institution: undefined })] }
  ]) {
    const { report } = await check({
      discovery: { hitCount: 1, resultList: { result: [discoveryRecord(candidateDoi)] } }, details
    }, []);
    assert.equal(report.status, "incomplete");
    assert.equal(reportExitCode(report), 1);
    assert.equal(report.candidates.length, 0);
    assert.match(report.sourceErrors[0], /bioRxiv candidate check failed/);
  }
});

test("malformed or unknown preprint metadata fails honestly without discarding verified candidates", async () => {
  const invalidRecords = [
    null,
    {},
    discoveryRecord(candidateDoi, { source: undefined }),
    discoveryRecord(candidateDoi, { source: "MED" }),
    discoveryRecord(undefined),
    discoveryRecord(""),
    discoveryRecord(123),
    discoveryRecord("not-a-doi"),
    discoveryRecord(candidateDoi, { bookOrReportDetails: undefined }),
    ...[undefined, "", " ", 123, [], "unknown", "Unrecognized server", "bioRxiv / medRxiv"]
      .map((publisher) => discoveryRecord(candidateDoi, { bookOrReportDetails: { publisher } })),
    discoveryRecord("10.1000/no-prefix-fallback", { bookOrReportDetails: undefined }),
    discoveryRecord(undefined, { bookOrReportDetails: { publisher: "medRxiv" } })
  ];
  for (const record of invalidRecords) {
    const { report, calls } = await check({
      discovery: { hitCount: 2, resultList: { result: [record, discoveryRecord(candidateDoi)] } }
    }, []);
    assert.equal(report.status, "incomplete", JSON.stringify(record));
    assert.equal(reportExitCode(report), 1);
    assert.equal(report.sourceErrors.length, 1);
    assert.match(report.sourceErrors[0], /Europe PMC preprint metadata check failed/);
    assert.deepEqual(report.candidates.map((item) => item.doi), [candidateDoi]);
    assert.equal(calls.filter((url) => url.hostname === "api.biorxiv.org").length, 1);
    const markdown = renderMarkdown(report);
    assert.match(markdown, /Status: INCOMPLETE/);
    assert.match(markdown, /Do not advance the publication review date/);
    assert.doesNotMatch(markdown, /No publication changes require review/);
  }
});

test("known local bioRxiv DOIs are not fetched again by discovery", async () => {
  const { report, calls } = await check({ discovery: {
    hitCount: 1, resultList: { result: [discoveryRecord(preprint.doi)] }
  } });
  assert.equal(report.status, "complete");
  assert.equal(report.candidates.length, 0);
  // The existing publication-status check still makes its one required request.
  assert.equal(calls.filter((url) => url.hostname === "api.biorxiv.org").length, 1);
});

test("metadata problems remain distinct from unavailable sources and fail validation", async () => {
  const { report } = await check({}, [{ ...journal, doi: "10.1000/wrong" }]);
  assert.equal(report.status, "complete");
  assert.equal(report.sourceErrors.length, 0);
  assert.match(report.remoteMetadataIssues[0], /DOI mismatch/);
  assert.equal(reportExitCode(report), 1);
  const local = await check({}, [{ ...journal, doi: undefined }]);
  assert.match(local.report.localIssues[0], /Missing DOI/);
  assert.equal(reportExitCode(local.report), 1);
});

test("partial JSON, Markdown and workflow summary are saved before failure is returned", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "abraham-publication-check-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const { report } = await check({ discovery: () => { throw new Error("Offline fixture"); } });
  const summaryPath = path.join(directory, "summary.md");
  await writePublicationReport(report, { outputDir: directory, summaryPath });
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(directory, "report.json"), "utf8")), report);
  const markdown = await fs.readFile(path.join(directory, "report.md"), "utf8");
  assert.match(markdown, /Status: INCOMPLETE/);
  assert.equal(await fs.readFile(summaryPath, "utf8"), markdown);
  assert.equal(reportExitCode(report), 1);
});
