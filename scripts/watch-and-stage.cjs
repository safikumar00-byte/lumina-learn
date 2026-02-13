#!/usr/bin/env node
/*
  Watch content/ for new or changed files, run `git add <file>` to stage them,
  and trigger the course index updater. This is intended for local development
  so that adding a new markdown file will be automatically staged for commit
  and the generated course index files are refreshed.

  Notes:
  - Requires `git` available on PATH and that this repo is a git repository.
  - Uses Node's fs.watch with recursive mode (works on Windows/macOS/Linux
    where supported). For more robust cross-platform watching, consider
    installing `chokidar` and updating this script.
*/

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const contentDir = path.join(repoRoot, "content");

if (!fs.existsSync(contentDir)) {
  console.error("content/ folder not found at", contentDir);
  process.exit(1);
}

let pending = new Set();
let timer = null;
const DEBOUNCE_MS = 700;

function scheduleProcess() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    const files = Array.from(pending);
    pending.clear();
    console.log("Staging files:", files);

    // Stage changed files
    for (const f of files) {
      try {
        await execCmd(`git add "${f}"`);
        console.log("git add", f);
      } catch (err) {
        console.warn("git add failed for", f, err && err.message);
      }
    }

    // Regenerate course indexes (best-effort)
    try {
      console.log("Regenerating course indexes...");
      await execCmd("node scripts/update-course-index.cjs");
      console.log("Index regeneration complete.");
    } catch (err) {
      console.error("Failed to regenerate indexes:", err && err.message);
    }
  }, DEBOUNCE_MS);
}

function execCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: repoRoot, env: process.env }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}

console.log("Watching", contentDir, "for changes. Press Ctrl+C to stop.");

fs.watch(contentDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const filePath = path.join(contentDir, filename);

  // Ignore changes to generated index.md files to avoid loops
  if (filename.endsWith("index.md")) return;

  // Only care about Markdown files and added/changed events
  if (!/\.md$/i.test(filename)) return;

  // Normalize existing path
  const abs = path.resolve(contentDir, filename);
  pending.add(abs);
  scheduleProcess();
});

// Keep process alive
process.stdin.resume();
