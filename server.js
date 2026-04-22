const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function safeResolve(requestUrl) {
  const decodedPath = decodeURIComponent(requestUrl.split("?")[0]);
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const resolvedPath = path.normalize(path.join(ROOT, requestedPath));
  if (!resolvedPath.startsWith(ROOT)) {
    return null;
  }
  return resolvedPath;
}

const server = http.createServer((req, res) => {
  let filePath = safeResolve(req.url || "/");
  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        const notFoundPath = path.join(ROOT, "index.html");
        fs.readFile(notFoundPath, (fallbackError, fallbackContent) => {
          if (fallbackError) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
            return;
          }
          res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
          res.end(fallbackContent);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Oh So Sofo site running on http://localhost:${PORT}`);
});
