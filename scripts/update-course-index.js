#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Script: regenerate course index.md files by scanning course folder lessons
// Usage: node scripts/update-course-index.js

const coursesDir = path.join(__dirname, "..", "content", "courses");

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return {};
  const fm = {};
  const lines = m[1].split("\n");
  lines.forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      fm[key] = val;
    }
  });
  return fm;
}

function buildIndexForCourse(courseSlug) {
  const coursePath = path.join(coursesDir, courseSlug);
  const files = fs.readdirSync(coursePath).filter((f) => f.endsWith(".md"));
  const lessons = [];
  files.forEach((file) => {
    if (file === "index.md") return;
    const content = fs.readFileSync(path.join(coursePath, file), "utf8");
    const fm = parseFrontmatter(content);
    if (fm.type === "lesson") {
      lessons.push({
        file,
        title: fm.title || file,
        slug: fm.slug || file.replace(".md", ""),
        order: Number(fm.order || 0) || Number(fm.week || 0),
      });
    }
  });
  lessons.sort((a, b) => (a.order || 0) - (b.order || 0));

  // create simple index markdown with list of lessons
  const lines = [
    "---",
    "type: course",
    `slug: ${courseSlug}`,
    "---",
    "",
    `# ${courseSlug}`,
    "",
    "## Lessons",
    "",
  ];
  lessons.forEach((l, idx) => {
    lines.push(`- **Lesson ${idx + 1}:** [${l.title}](./${l.slug}.md)`);
  });

  const out = lines.join("\n");
  fs.writeFileSync(path.join(coursePath, "index.md"), out, "utf8");
  console.log(`Wrote index.md for ${courseSlug} (${lessons.length} lessons)`);
}

fs.readdirSync(coursesDir).forEach((dir) => {
  const full = path.join(coursesDir, dir);
  if (fs.statSync(full).isDirectory()) {
    buildIndexForCourse(dir);
  }
});

console.log("Course index regeneration complete.");
