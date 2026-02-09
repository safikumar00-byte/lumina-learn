const fs = require("fs");
const path = require("path");

// Simple smoke checker: validates slugs and can assert a slug exists
// Usage: node scripts/check_content.cjs --type=lesson --slug=introduction-to-japanese-language-and-scripts

const args = process.argv.slice(2).reduce((acc, cur) => {
  const [k, v] = cur.replace(/^--/, "").split("=");
  acc[k] = v;
  return acc;
}, {});

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return {};
  const fm = {};
  const lines = m[1].split("\n");
  let currentKey = null;
  let buffer = "";
  lines.forEach((line) => {
    if (line.startsWith("  -") && currentKey) {
      // array line
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(line.replace(/^\s*-\s*/, "").trim());
    } else {
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
        currentKey = key;
      }
    }
  });
  return fm;
}

const contentDir = path.join(__dirname, "..", "content");
const found = { lessons: [], blogs: [] };

function walk(dir) {
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full);
    else if (e.endsWith(".md")) {
      const txt = fs.readFileSync(full, "utf8");
      const fm = parseFrontmatter(txt);
      if (fm.type === "lesson") found.lessons.push(fm.slug || null);
      if (fm.type === "blog") found.blogs.push(fm.slug || null);
    }
  }
}

walk(contentDir);

// uniqueness check
const dupLesson = found.lessons
  .filter(Boolean)
  .reduce((acc, s) => ((acc[s] = (acc[s] || 0) + 1), acc), {});
const dupBlog = found.blogs
  .filter(Boolean)
  .reduce((acc, s) => ((acc[s] = (acc[s] || 0) + 1), acc), {});
const dupLessons = Object.entries(dupLesson).filter(([k, v]) => v > 1);
const dupBlogs = Object.entries(dupBlog).filter(([k, v]) => v > 1);
if (dupLessons.length) {
  console.error("Duplicate lesson slugs found:", dupLessons);
  process.exitCode = 2;
}
if (dupBlogs.length) {
  console.error("Duplicate blog slugs found:", dupBlogs);
  process.exitCode = 2;
}

if (args.slug) {
  const type = args.type || "lesson";
  const list = type === "blog" ? found.blogs : found.lessons;
  if (!list.includes(args.slug)) {
    console.error(`Slug not found: ${args.slug} (type=${type})`);
    process.exitCode = 3;
  } else {
    console.log(`Slug found: ${args.slug} (type=${type})`);
  }
} else {
  console.log(
    "Content scan complete. Lessons:",
    found.lessons.length,
    "Blogs:",
    found.blogs.length,
  );
}
