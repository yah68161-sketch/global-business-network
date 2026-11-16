const http = require("http");
const fs = require("fs");

const videoPath = process.env.GBN_VIDEO_PATH;
const port = 5501;

http.createServer((req, res) => {
    if (req.url !== "/intro.mp4") {
        res.writeHead(404);
        return res.end("Not found");
    }

    fs.stat(videoPath, (err, stat) => {
        if (err) {
            res.writeHead(404);
            return res.end("Video not found");
        }

        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = Number(parts[0]);
            const end = parts[1] ? Number(parts[1]) : stat.size - 1;

            if (start >= stat.size || end >= stat.size || start > end) {
                res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
                return res.end();
            }

            res.writeHead(206, {
                "Content-Type": "video/mp4",
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Range": `bytes ${start}-${end}/${stat.size}`
            });

            fs.createReadStream(videoPath, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                "Content-Type": "video/mp4",
                "Content-Length": stat.size,
                "Accept-Ranges": "bytes"
            });
            fs.createReadStream(videoPath).pipe(res);
        }
    });
}).listen(port, "127.0.0.1", () => {
    console.log("GBN Intro Video Server running on port " + port);
});
