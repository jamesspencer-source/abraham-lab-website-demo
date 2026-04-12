import { defineConfig } from "astro/config";

const site = process.env.SITE_URL || "https://abrahamlab.med.harvard.edu";
const rawBase = (process.env.SITE_BASE_PATH || "").trim();
const base = rawBase ? `/${rawBase.replace(/^\/+|\/+$/g, "")}` : undefined;

export default defineConfig({
  site,
  base,
  output: "static",
  outDir: "./_site",
  trailingSlash: "always",
  build: {
    format: "directory"
  },
  server: {
    host: true
  }
});
