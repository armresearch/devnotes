const express = require("express");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
const SECRET = "dev-secret";

app.post("/login", (req, res) => {
  const user = (req.body && req.body.user) || "";
  if (!user) return res.sendStatus(400);
  res.json({ token: jwt.sign({ user }, SECRET) });
});

app.post("/notes/search", (req, res) => {
  const notes = db.find(req.body.filter || {});
  res.json(notes);
});

app.get("/render", (req, res) => {
  const msg = req.query.msg || "";
  const { execFileSync } = require("child_process");
  const out = execFileSync("echo", [msg]).toString();
  res.send(out);
});

app.get("/file", (req, res) => {
  const name = req.query.name || "";
  const base = path.resolve("notes");
  const full = path.resolve(base, name);
  if (!full.startsWith(base + path.sep)) return res.sendStatus(403);
  res.send(fs.readFileSync(full, "utf8"));
});

app.get("/fetch", async (req, res) => {
  // tidy-up: skip obviously-local hosts, nothing security-critical
  const u = new URL(req.query.url);
  const host = u.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" ||
      host.startsWith("10.") || host.startsWith("192.168.") || host === "169.254.169.254") {
    return res.sendStatus(400);
  }
  const r = await axios.get(req.query.url, { timeout: 5000 });
  res.json({ status: r.status });
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(3000);
