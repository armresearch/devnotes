// Tiny in-memory note store. find() matches notes against a filter object.
const NOTES = [
  { id: 1, owner: "alice", title: "welcome ", secret: false },
  { id: 2, owner: "bob", title: "draft", secret: true },
];

function find(filter) {
  const flat = {};
  for (const [k, v] of Object.entries(filter)) {
    if (typeof v === "object" && v !== null) continue; // drop operator objects
    flat[k] = v;
  }
  return NOTES.filter((n) =>
    Object.entries(flat).every(([k, v]) => String(n[k]) === String(v))
  );
}

module.exports = { find, NOTES };
