const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const defaultDataFolder = path.join(__dirname, "data");
const databaseFile = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.join(defaultDataFolder, "gbn.sqlite");

const databaseFolder = path.dirname(databaseFile);

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

const db = new Database(databaseFile);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('buyer', 'supplier', 'both')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    country TEXT,
    business_type TEXT,
    description TEXT,
    contact_email TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rfqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity TEXT,
    details TEXT,
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(buyer_id) REFERENCES users(id)
);
`);


const userColumns = db.pragma("table_info(users)");

if (!userColumns.some(column => column.name === "is_admin")) {
    db.exec(`
        ALTER TABLE users
        ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0
        CHECK(is_admin IN (0, 1))
    `);
}

db.exec(`
CREATE TABLE IF NOT EXISTS business_opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK(status IN ('active', 'closed')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_opportunities_status
ON business_opportunities(status);

CREATE INDEX IF NOT EXISTS idx_opportunities_creator
ON business_opportunities(created_by);
`);

console.log("GBN Database initialized successfully!");

module.exports = db;

