// Tiny in-memory note store. find() matches notes against a filter object.
const NOTES = [
  { id: 1, owner: "alice", title: "welcome", secret: false },
  { id: 2, owner: "bob", title: "draft", secret: true },
];

function find(filter) {
  return NOTES.filter((n) =>
    Object.entries(filter).every(([k, v]) => n[k] === v)
  );
}

module.exports = { find, NOTES };
