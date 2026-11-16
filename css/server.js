
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// Static folders
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/pages", express.static(path.join(__dirname, "pages")));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Backend health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Global Business Network Backend is running!",
        version: "1.0.0"
    });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log("--------------------------------");
    console.log("GLOBAL BUSINESS NETWORK");
    console.log("Backend Server Started!");
    console.log(`http://localhost:${PORT}`);
    console.log("--------------------------------");
});
