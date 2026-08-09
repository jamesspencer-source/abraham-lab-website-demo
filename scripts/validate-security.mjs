import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imageRoot = path.join(root, "public/assets/images");
const workflowRoot = path.join(root, ".github/workflows");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const metadataMarkers = [
  Buffer.from("Exif\0\0", "latin1"),
  Buffer.from("http://ns.adobe.com/xap/", "latin1"),
  Buffer.from("<?xpacket", "latin1"),
  Buffer.from("Photoshop", "latin1"),
  Buffer.from("IPTC", "latin1"),
  Buffer.from("GPSLatitude", "latin1"),
  Buffer.from("GPSLongitude", "latin1"),
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const filePath of walk(imageRoot)) {
  if (!imageExtensions.has(path.extname(filePath).toLowerCase())) continue;
  const data = fs.readFileSync(filePath);
  const marker = metadataMarkers.find((item) => data.includes(item));
  if (marker) {
    fail(`Image metadata marker remains in ${path.relative(root, filePath)}`);
  }
}

for (const workflow of walk(workflowRoot).filter((item) => item.endsWith(".yml") || item.endsWith(".yaml"))) {
  const text = fs.readFileSync(workflow, "utf8");
  for (const match of text.matchAll(/uses:\s*([^\s]+)/g)) {
    const ref = match[1].split("@").at(-1);
    if (!/^[0-9a-f]{40}$/.test(ref)) {
      fail(`Mutable GitHub Action ref in ${path.relative(root, workflow)}: ${match[1]}`);
    }
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
for (const scriptName of ["dev", "preview"]) {
  if (!String(packageJson.scripts?.[scriptName] || "").includes("--host 127.0.0.1")) {
    fail(`npm script ${scriptName} must bind the dev server to 127.0.0.1`);
  }
}

if (!process.exitCode) {
  console.log("security check passed");
}
