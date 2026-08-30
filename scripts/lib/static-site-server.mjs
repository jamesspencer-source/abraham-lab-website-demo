import http from "node:http";
import path from "node:path";
import { promises as fs } from "node:fs";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};

export class ForbiddenPathError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export function normalizeBasePath(value) {
  const raw = String(value || "").trim();
  return raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";
}

export function createStaticSiteTools({ siteRoot, basePath = "" }) {
  function isInsideSiteRoot(candidatePath) {
    const relative = path.relative(siteRoot, candidatePath);
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
  }

  function safeStaticRequestPath(requestPath) {
    let decoded;
    try {
      decoded = decodeURIComponent(requestPath);
    } catch {
      throw new ForbiddenPathError("Malformed request path");
    }

    const slashNormalized = decoded.replace(/\\/g, "/");
    if (slashNormalized.split("/").some((part) => part === "..")) {
      throw new ForbiddenPathError("Path traversal is not allowed");
    }

    const normalized = path.posix.normalize(slashNormalized);
    if (normalized === ".." || normalized.startsWith("../")) {
      throw new ForbiddenPathError("Path traversal is not allowed");
    }

    return normalized.replace(/^\/+/, "");
  }

  function staticCandidate(...segments) {
    const candidate = path.resolve(siteRoot, ...segments);
    if (!isInsideSiteRoot(candidate)) {
      throw new ForbiddenPathError("Resolved path escaped the static root");
    }
    return candidate;
  }

  async function fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async function resolveStaticPath(requestPath) {
    const withoutBase = basePath && (requestPath === basePath || requestPath.startsWith(`${basePath}/`))
      ? requestPath.slice(basePath.length) || "/"
      : requestPath;
    const safePath = safeStaticRequestPath(withoutBase);
    const directPath = staticCandidate(safePath);

    if (await fileExists(directPath)) {
      const stats = await fs.stat(directPath);
      if (stats.isDirectory()) {
        const indexPath = staticCandidate(safePath, "index.html");
        if (await fileExists(indexPath)) {
          return { filePath: indexPath, statusCode: 200 };
        }
      } else {
        return { filePath: directPath, statusCode: 200 };
      }
    }

    const directoryIndexPath = staticCandidate(safePath, "index.html");
    if (await fileExists(directoryIndexPath)) {
      return { filePath: directoryIndexPath, statusCode: 200 };
    }

    const fallback404 = staticCandidate("404.html");
    if (await fileExists(fallback404)) {
      return { filePath: fallback404, statusCode: 404 };
    }

    return null;
  }

  async function start(port) {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
        const resolved = await resolveStaticPath(url.pathname);

        if (!resolved) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not found");
          return;
        }

        const { filePath, statusCode } = resolved;
        const extension = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[extension] || "application/octet-stream";
        const data = await fs.readFile(filePath);
        res.writeHead(statusCode, { "Content-Type": contentType });
        res.end(data);
      } catch (error) {
        const statusCode = error?.statusCode || 500;
        res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(`Server error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, "127.0.0.1", resolve);
    });

    return {
      origin: `http://127.0.0.1:${port}`,
      close: () => new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      })
    };
  }

  return {
    isInsideSiteRoot,
    safeStaticRequestPath,
    staticCandidate,
    resolveStaticPath,
    start
  };
}
