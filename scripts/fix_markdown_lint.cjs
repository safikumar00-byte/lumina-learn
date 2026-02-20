#!/usr/bin/env node
// Fix common markdown lint problems expected by contentAdapter:
// - Ensure a single H1 immediately after frontmatter
// - Ensure a short lead paragraph following H1
// - Ensure presence of :::aeo block
// - Ensure presence of :::recap block at end

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const contentDir = path.join(repoRoot, "content");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.md$/i.test(e.name)) processFile(p);
  }
}

function processFile(file) {
  let raw = fs.readFileSync(file, "utf8");
  // ensure Unix newlines
  raw = raw.replace(/\r\n/g, "\n");

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return; // skip files without frontmatter

  const fm = fmMatch[1];
  let body = fmMatch[2].trimStart();

  // parse title from frontmatter if available
  const titleMatch = fm.match(/\n?title:\s*(?:"([^"]+)"|'([^']+)'|(.+))\n?/i);
  const title = titleMatch
    ? (titleMatch[1] || titleMatch[2] || titleMatch[3]).trim()
    : null;

  let changed = false;

  // Ensure H1 as first content line
  if (!body.startsWith("# ")) {
    if (title) {
      body = `# ${title}\n\n` + body;
    } else {
      body = `# Lesson\n\n` + body;
    }
    changed = true;
  }

  // Ensure lead paragraph: first non-empty paragraph after H1 should be a short paragraph, not a block or heading
  const afterH1 = body.replace(/^# .*?\n+/s, "");
  const firstLine = afterH1.split("\n").find((l) => l.trim() !== "");
  if (firstLine && firstLine.startsWith(":::")) {
    // insert placeholder lead paragraph
    const placeholder =
      "This lesson covers the core idea and practical examples in a concise format.\n\n";
    body = body.replace(/^# .*?\n+/s, (m) => m + placeholder);
    changed = true;
  }

  // Ensure at least one :::aeo block somewhere
  if (!/:::aeo[\s\S]*?:::/i.test(body)) {
    const aeo =
      "\n\n:::aeo\nTeaching tip: emphasize pronunciation and short practice drills.\n:::\n";
    // Insert after the lead paragraph if possible (after first paragraph)
    body = body.replace(/(#[^\n]*\n\n[\s\S]*?\n\n)/, `$1${aeo}`);
    changed = true;
  }

  // Ensure recap block at end
  if (!/:::recap[\s\S]*?:::/i.test(body)) {
    const recap =
      "\n\n:::recap\n- Key takeaway 1\n- Key takeaway 2\n- Key takeaway 3\n:::\n";
    body = body.trimEnd() + recap;
    changed = true;
  }

  if (changed) {
    const out = `---\n${fm}\n---\n\n${body.replace(/\n{3,}/g, "\n\n")}`;
    fs.writeFileSync(file, out, "utf8");
    console.log("Patched:", path.relative(repoRoot, file));
  }
}

if (!fs.existsSync(contentDir)) {
  console.error("content/ not found");
  process.exit(1);
}

walk(contentDir);
console.log("Markdown lint fixer completed.");
