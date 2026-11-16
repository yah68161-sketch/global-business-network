require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing. Check your .env file.");
}

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/pages", express.static(path.join(__dirname, "pages")));

app.use("/api/auth", require("./auth"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Global Business Network Backend is running!",
        version: "1.0.0"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("GLOBAL BUSINESS NETWORK");
    console.log("Backend Server Started!");
    console.log("http://localhost:" + PORT);
});
