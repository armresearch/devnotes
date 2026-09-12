const express = require("express");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(express.json());
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
  const out = execSync("echo " + msg).toString();
  res.send(out);
});

app.get("/file", (req, res) => {
  const name = req.query.name || "";
  res.send(fs.readFileSync(path.join("notes", name), "utf8"));
});

app.get("/fetch", async (req, res) => {
  const r = await axios.get(req.query.url, { timeout: 5000 });
  res.json({ status: r.status });
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(3000);
