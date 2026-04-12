import type { APIRoute } from "astro";
import { siteData } from "../data/site";

const origin = process.env.SITE_URL || siteData.url;
const rawBase = (process.env.SITE_BASE_PATH || "").trim();
const baseSegment = rawBase ? `${rawBase.replace(/^\/+|\/+$/g, "")}/` : "";
const sitemapUrl = new URL(`${baseSegment}sitemap.xml`, `${origin}/`).toString();

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
