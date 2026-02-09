const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Watch content/courses for changes and run update-course-index.cjs with debounce
const coursesDir = path.join(__dirname, "..", "content", "courses");

let timer = null;
const debounceMs = 300;
let lastRun = 0;
const suppressMs = 1200; // ignore events within this window after running updater

function runUpdater() {
  console.log("[watch-index] Running update-course-index.cjs...");
  const p = spawn(
    process.execPath,
    [path.join(__dirname, "update-course-index.cjs")],
    { stdio: "inherit" },
  );
  p.on("close", (code) => {
    console.log(`[watch-index] updater exited ${code}`);
    lastRun = Date.now();
  });
}

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    runUpdater();
    timer = null;
  }, debounceMs);
}

function watchDir(dir) {
  try {
    const watcher = fs.watch(
      dir,
      { recursive: true },
      (eventType, filename) => {
        if (!filename) return;
        const ext = path.extname(filename).toLowerCase();
        const name = path.basename(filename).toLowerCase();

        // Ignore changes to index.md to avoid triggering on our own writes
        if (name === "index.md") return;

        // Suppress events that happen immediately after we ran the updater
        if (Date.now() - lastRun < suppressMs) return;

        if (ext === ".md") schedule();
      },
    );
    console.log(`[watch-index] watching ${dir}`);
    return watcher;
  } catch (err) {
    console.error("[watch-index] watch failed", err);
  }
}

if (!fs.existsSync(coursesDir)) {
  console.error("[watch-index] courses directory not found:", coursesDir);
  process.exit(1);
}

// initial run
runUpdater();

// watch
watchDir(coursesDir);

// keep process alive
process.on("SIGINT", () => {
  console.log("[watch-index] exiting");
  process.exit(0);
});
