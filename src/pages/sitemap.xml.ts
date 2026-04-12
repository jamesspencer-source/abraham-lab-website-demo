import type { APIRoute } from "astro";
import { siteData } from "../data/site";

const origin = process.env.SITE_URL || siteData.url;
const rawBase = (process.env.SITE_BASE_PATH || "").trim();
const basePath = rawBase ? `/${rawBase.replace(/^\/+|\/+$/g, "")}/` : "/";
const pages = [
  "/",
  "/research/",
  "/publications/",
  "/jonathan-abraham/",
  "/people/",
  "/news/",
  "/contact/"
];

const toAbsolute = (path: string) =>
  new URL(path === "/" ? basePath : `${basePath}${path.replace(/^\/+/, "")}`, `${origin}/`).toString();

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${toAbsolute(page)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
