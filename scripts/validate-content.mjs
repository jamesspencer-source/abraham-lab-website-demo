import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const canonical = {
  department: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
  building: "Veritas Science Center (VSC)",
  address: "77 Avenue Louis Pasteur",
  city: "Boston, MA 02115"
};

const dataFiles = {
  site: path.join(repoRoot, "src", "data", "site.ts"),
  publications: path.join(repoRoot, "src", "data", "publications.ts"),
  jonathan: path.join(repoRoot, "src", "data", "jonathan.ts"),
  research: path.join(repoRoot, "src", "data", "research.ts"),
  news: path.join(repoRoot, "src", "data", "news.ts"),
  people: path.join(repoRoot, "src", "data", "people.ts")
};

const scannedTextFiles = [
  path.join(repoRoot, "src", "data", "site.ts"),
  path.join(repoRoot, "src", "data", "publications.ts"),
  path.join(repoRoot, "src", "data", "jonathan.ts"),
  path.join(repoRoot, "src", "data", "research.ts"),
  path.join(repoRoot, "src", "data", "news.ts"),
  path.join(repoRoot, "src", "data", "people.ts"),
  path.join(repoRoot, "src", "pages", "index.astro"),
  path.join(repoRoot, "src", "pages", "publications", "index.astro"),
  path.join(repoRoot, "src", "pages", "jonathan-abraham", "index.astro"),
  path.join(repoRoot, "src", "pages", "people", "index.astro"),
  path.join(repoRoot, "src", "pages", "news", "index.astro"),
  path.join(repoRoot, "src", "pages", "research", "index.astro"),
  path.join(repoRoot, "src", "pages", "contact", "index.astro")
];

const discouragedPlainLanguagePatterns = [
  /\bvia\b/i,
  /\butili[sz](?:e|es|ed|ing|ation|ations)\b/i,
  /\bleverag(?:e|es|ed|ing)\b/i,
  /\bfacilitat(?:e|es|ed|ing)\b/i
];

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

async function loadTsExport(filePath, exportName) {
  const source = await fs.readFile(filePath, "utf8");
  const loaded = transpileTsModule(source, filePath);
  if (!(exportName in loaded)) {
    throw new Error(`Missing export "${exportName}" in ${path.relative(repoRoot, filePath)}`);
  }
  return loaded[exportName];
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compareDatesDesc(left, right) {
  return new Date(right).getTime() - new Date(left).getTime();
}

function sentenceWordCount(sentence) {
  return (sentence.match(/\b[\p{L}\p{N}'-]+\b/gu) || []).length;
}

function splitSentences(text) {
  return normalize(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function addRhythmWarnings(label, value, note) {
  if (typeof value !== "string") {
    return;
  }

  const normalized = normalize(value);
  if (!normalized) {
    return;
  }

  const sentences = splitSentences(normalized);
  if (!sentences.length) {
    return;
  }

  for (const sentence of sentences) {
    const words = sentenceWordCount(sentence);
    const commas = (sentence.match(/,/g) || []).length;

    if (words > 28) {
      note(`Rhythm review: ${label} has a sentence with ${words} words. "${sentence}"`);
    }

    if (commas > 2) {
      note(`Rhythm review: ${label} has a sentence with ${commas} commas. "${sentence}"`);
    }
  }
}

function collectStrings(value, bucket = [], seen = new Set()) {
  if (value === null || value === undefined) {
    return bucket;
  }

  if (typeof value === "string") {
    bucket.push(value);
    return bucket;
  }

  if (typeof value !== "object") {
    return bucket;
  }

  if (seen.has(value)) {
    return bucket;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, bucket, seen);
    }
    return bucket;
  }

  for (const entry of Object.values(value)) {
    collectStrings(entry, bucket, seen);
  }

  return bucket;
}

async function main() {
  const errors = [];
  const warn = [];

  const siteData = await loadTsExport(dataFiles.site, "siteData");
  const publications = await loadTsExport(dataFiles.publications, "publications");
  const jonathanProfile = await loadTsExport(dataFiles.jonathan, "jonathanProfile");
  const researchPrograms = await loadTsExport(dataFiles.research, "researchPrograms");
  const newsItems = await loadTsExport(dataFiles.news, "newsItems");
  const peopleData = await loadTsExport(dataFiles.people, "peopleData");

  const fail = (message) => errors.push(message);
  const note = (message) => warn.push(message);

  const required = [
    {
      condition: siteData.contact?.department === canonical.department,
      message: `siteData.contact.department must be exactly "${canonical.department}".`
    },
    {
      condition: siteData.institutionTitle === canonical.department,
      message: `siteData.institutionTitle must be exactly "${canonical.department}".`
    },
    {
      condition: Array.isArray(siteData.contact?.addressLines) && siteData.contact.addressLines.includes(canonical.building),
      message: `siteData.contact.addressLines must include "${canonical.building}".`
    },
    {
      condition: Array.isArray(siteData.contact?.addressLines) && siteData.contact.addressLines.includes(canonical.address),
      message: `siteData.contact.addressLines must include "${canonical.address}".`
    },
    {
      condition: Array.isArray(siteData.contact?.addressLines) && siteData.contact.addressLines.includes(canonical.city),
      message: `siteData.contact.addressLines must include "${canonical.city}".`
    },
    {
      condition: siteData.contact?.mapBuilding === canonical.building,
      message: `siteData.contact.mapBuilding must be "${canonical.building}".`
    },
    {
      condition: siteData.contact?.mapDisplayName === "Harvard Medical School",
      message: 'siteData.contact.mapDisplayName must be "Harvard Medical School".'
    },
    {
      condition: typeof jonathanProfile.title === "string" && jonathanProfile.title.includes("Harvard Medical School"),
      message: 'jonathanProfile.title must reference Harvard Medical School.'
    },
    {
      condition: jonathanProfile.secondaryTitle === "HHMI Investigator",
      message: 'jonathanProfile.secondaryTitle must be "HHMI Investigator".'
    }
  ];

  for (const entry of required) {
    if (!entry.condition) {
      fail(entry.message);
    }
  }

  const publicationTitles = new Map();
  for (const publication of publications) {
    const title = normalize(publication.title);
    if (!title) {
      fail("Every publication needs a non-empty title.");
      continue;
    }

    if (publicationTitles.has(title)) {
      fail(`Duplicate publication title detected: "${title}".`);
    } else {
      publicationTitles.set(title, publication);
    }

    if (publication.doi && !/^10\.\d{4,9}\/\S+$/i.test(publication.doi)) {
      fail(`Invalid DOI format for "${title}": ${publication.doi}`);
    }

    if (publication.pmid && !/^\d+$/.test(String(publication.pmid))) {
      fail(`Invalid PMID format for "${title}": ${publication.pmid}`);
    }

    if ((publication.doi || publication.pmid) && !publication.link) {
      fail(`Publication "${title}" has a DOI/PMID but no outbound link.`);
    }

    if (publication.homepageProof && !publication.publishedAt) {
      fail(`Homepage proof publication "${title}" needs a publishedAt date.`);
    }

    if (publication.homepageProof && !publication.image) {
      fail(`Homepage proof publication "${title}" needs an image.`);
    }

    if (publication.homepageProof && !publication.imageAlt) {
      fail(`Homepage proof publication "${title}" needs imageAlt.`);
    }
  }

  const sortedPublications = [...publications].sort((left, right) =>
    compareDatesDesc(left.publishedAt || `${left.year}-01-01`, right.publishedAt || `${right.year}-01-01`)
  );
  const homepageProofPublications = publications.filter((publication) => publication.homepageProof);
  const leadFeaturePublications = publications.filter((publication) => publication.leadFeature);

  if (homepageProofPublications.length !== 3) {
    fail(`Expected exactly 3 homepageProof publications, found ${homepageProofPublications.length}.`);
  }

  if (leadFeaturePublications.length !== 1) {
    fail(`Expected exactly 1 leadFeature publication, found ${leadFeaturePublications.length}.`);
  }

  const topThree = sortedPublications.slice(0, 3);
  const topThreeTitles = new Set(topThree.map((publication) => normalize(publication.title)));
  for (const publication of homepageProofPublications) {
    if (!topThreeTitles.has(normalize(publication.title))) {
      fail(`Homepage proof publication "${publication.title}" is not among the 3 most recent publications.`);
    }
  }

  for (const publication of topThree) {
    if (!publication.homepageProof) {
      fail(`One of the 3 most recent publications is missing homepageProof: "${publication.title}".`);
    }
  }

  if (leadFeaturePublications[0]) {
    const leadFeature = leadFeaturePublications[0];
    const newestPublication = sortedPublications[0];
    if (normalize(leadFeature.title) !== normalize(newestPublication.title)) {
      fail(
        `leadFeature should point at the newest publication. Expected "${newestPublication.title}", got "${leadFeature.title}".`
      );
    }
    if (!leadFeature.homepageProof) {
      fail(`leadFeature publication "${leadFeature.title}" must also be marked homepageProof.`);
    }
  }

  const publicationTitleSet = new Set(publications.map((publication) => normalize(publication.title)));
  for (const researchProgram of researchPrograms) {
    for (const paper of researchProgram.papers || []) {
      if (!publicationTitleSet.has(normalize(paper.title))) {
        fail(`Research paper "${paper.title}" does not match any publication title.`);
      }
    }
  }

  for (const title of jonathanProfile.representativeWork || []) {
    if (!publicationTitleSet.has(normalize(title))) {
      fail(`Jonathan representative work "${title}" does not match any publication title.`);
    }
  }

  const sourceFiles = [...scannedTextFiles, ...Object.values(dataFiles)];
  for (const filePath of sourceFiles) {
    const text = await fs.readFile(filePath, "utf8");
    if (/\bNRB\b/.test(text)) {
      fail(`Forbidden legacy label "NRB" found in ${path.relative(repoRoot, filePath)}.`);
    }

    for (const pattern of discouragedPlainLanguagePatterns) {
      const match = text.match(pattern);
      if (match) {
        fail(
          `Discouraged wording "${match[0]}" found in ${path.relative(repoRoot, filePath)}. Use plainer language.`
        );
      }
    }
  }

  const siteStrings = collectStrings(siteData);
  const jonathanStrings = collectStrings(jonathanProfile);
  const researchStrings = collectStrings(researchPrograms);
  const publicationStrings = collectStrings(publications);
  const newsStrings = collectStrings(newsItems);
  const peopleStrings = collectStrings(peopleData);
  const allStrings = [...siteStrings, ...jonathanStrings, ...researchStrings, ...publicationStrings, ...newsStrings, ...peopleStrings]
    .map(normalize)
    .filter(Boolean);

  const canonicalMarkers = [
    canonical.department,
    canonical.building,
    canonical.address,
    canonical.city,
    "Harvard Medical School",
    "HHMI Investigator"
  ];

  for (const marker of canonicalMarkers) {
    if (!allStrings.some((value) => value.includes(marker))) {
      note(`Marker not found in loaded content: "${marker}".`);
    }
  }

  addRhythmWarnings("siteData.description", siteData.description, note);
  addRhythmWarnings("siteData.heroTitle", siteData.heroTitle, note);
  addRhythmWarnings("siteData.heroDeck", siteData.heroDeck, note);
  addRhythmWarnings("siteData.institutionSummary", siteData.institutionSummary, note);
  addRhythmWarnings("siteData.tagline", siteData.tagline, note);

  addRhythmWarnings("jonathanProfile.overview", jonathanProfile.overview, note);
  for (const [index, paragraph] of (jonathanProfile.biography || []).entries()) {
    addRhythmWarnings(`jonathanProfile.biography[${index}]`, paragraph, note);
  }
  for (const [index, item] of (jonathanProfile.focusAreas || []).entries()) {
    addRhythmWarnings(`jonathanProfile.focusAreas[${index}]`, item, note);
  }

  for (const [index, publication] of publications.entries()) {
    addRhythmWarnings(`publications[${index}].significanceLine`, publication.significanceLine, note);
    addRhythmWarnings(`publications[${index}].summary`, publication.summary, note);
  }

  for (const [index, item] of newsItems.entries()) {
    addRhythmWarnings(`newsItems[${index}].summary`, item.summary, note);
  }

  for (const [index, person] of peopleData.currentMembers.entries()) {
    addRhythmWarnings(`peopleData.currentMembers[${index}].note`, person.note, note);
    addRhythmWarnings(`peopleData.currentMembers[${index}].roleSummary`, person.roleSummary, note);
  }

  for (const [index, program] of researchPrograms.entries()) {
    addRhythmWarnings(`researchPrograms[${index}].importance`, program.importance, note);
    addRhythmWarnings(`researchPrograms[${index}].summary`, program.summary, note);
    for (const [paragraphIndex, paragraph] of (program.paragraphs || []).entries()) {
      addRhythmWarnings(`researchPrograms[${index}].paragraphs[${paragraphIndex}]`, paragraph, note);
    }
    for (const [paperIndex, paper] of (program.papers || []).entries()) {
      addRhythmWarnings(`researchPrograms[${index}].papers[${paperIndex}].note`, paper.note, note);
    }
  }

  if (errors.length) {
    console.error("Content validation failed:");
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Content validation passed: ${publications.length} publications, ${homepageProofPublications.length} homepage proof entries.`);
  if (warn.length) {
    for (const message of warn) {
      console.log(`Warning: ${message}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
