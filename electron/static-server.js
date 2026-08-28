const http = require("http");
const fs = require("fs");
const path = require("path");
const { PORT } = require("./config");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".ogg": "audio/ogg",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".wasm": "application/wasm",
    ".map": "application/json",
    ".txt": "text/plain; charset=utf-8",
};

/**
 * Local HTTP server mirrors CRA dev-server behaviour for fetch/Web Audio.
 * @param {string} root
 * @returns {Promise<import("http").Server>}
 */
function startStaticServer(root) {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const parsed = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
            let rel = decodeURIComponent(parsed.pathname);

            if (rel === "/") {
                rel = "/index.html";
            }

            const filePath = path.normalize(path.join(root, rel));

            if (!filePath.startsWith(path.normalize(root))) {
                res.writeHead(403);
                res.end("Forbidden");
                return;
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    fs.readFile(path.join(root, "index.html"), (fallbackErr, html) => {
                        if (fallbackErr) {
                            res.writeHead(404);
                            res.end("Not found");
                            return;
                        }

                        res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
                        res.end(html);
                    });
                    return;
                }

                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
                res.end(data);
            });
        });

        server.listen(PORT, "127.0.0.1", () => resolve(server));
        server.on("error", reject);
    });
}

module.exports = {
    startStaticServer,
};
