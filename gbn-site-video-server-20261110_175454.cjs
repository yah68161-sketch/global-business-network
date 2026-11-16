const http = require("http");
const fs = require("fs");

const videoPath = String.raw`C:\Users\FEHER APPAREL\Downloads\17347406_3840_2160_30fps.mp4`;
const port = 5517;

http.createServer((req, res) => {
    if (req.url !== "/intro.mp4") {
        res.writeHead(404);
        return res.end("Not found");
    }

    fs.stat(videoPath, (err, stat) => {
        if (err) {
            res.writeHead(404);
            return res.end("Original video not found");
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
                "Content-Range": `bytes ${start}-${end}/${stat.size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": "video/mp4"
            });
            fs.createReadStream(videoPath, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                "Content-Length": stat.size,
                "Content-Type": "video/mp4",
                "Accept-Ranges": "bytes"
            });
            fs.createReadStream(videoPath).pipe(res);
        }
    });
}).listen(port, "127.0.0.1", () => {
    console.log("GBN background video server running on port " + port);
});

