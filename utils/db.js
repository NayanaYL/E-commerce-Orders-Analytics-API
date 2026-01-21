// utils/db.js
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../db.json");

const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = { readDB, writeDB };
