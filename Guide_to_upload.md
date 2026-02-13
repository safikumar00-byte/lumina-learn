# Guide to Uploading Lessons & Blogs

# Guide to Uploading Lessons & Blogs (updated)

This file is your single-source checklist and style guide for adding new Markdown lessons or blogs to the Lumina Learn project. It reflects the repository automation and fixes implemented so far.

Summary of automation & changes applied

- Dynamic content discovery: `lib/contentAdapter.ts` now uses Vite's `import.meta.glob('../content/**/*.md', { eager: true, as: 'raw' })` to auto-import new Markdown files. You no longer need to add explicit imports for each new file.
- Robust frontmatter parsing: the frontmatter parser strips surrounding quotes from scalars and supports YAML arrays (keywords) and boolean/null values.
- Recommendation & UI improvements: `components/BlogRecommendationSection.tsx` added; `RecommendationSection` and `LessonView` updated for blog vs lesson contexts.
- Debugging helpers: `LessonView` supports `?debug=1` to render available `LESSONS` for troubleshooting.
- Content index automation:
  - `scripts/update-course-index.cjs`: regenerates `content/courses/<slug>/index.md` from lesson files.
  - `scripts/watch-index.cjs`: watches `content/courses` and runs the updater on edits (debounced, ignores `index.md` to avoid loops).
- Smoke-check and CI:
  - `scripts/check_content.cjs`: scans content for duplicate slugs and can assert a specific slug exists. Returns non-zero for failures.
  - GitHub Action `.github/workflows/content-check.yml` runs `npm run content:check` on PRs.
- Dev ergonomics and hooks:
  - `package.json` scripts: `content:update-index`, `content:watch-index`, `content:check`, and `dev` now runs Vite and the watcher concurrently (requires `npm install`).
  - Husky pre-commit hook `.husky/pre-commit` runs `npm run content:update-index` and stages changed `index.md` files (requires Git + `git` available and Husky installed via `npm run prepare`).

Quick checklist (what to do after adding an `.md` file)

1. Place the file
   - Lessons: `content/courses/<course-slug>/<your-slug>.md`
   - Blogs: `content/blogs/<your-slug>.md`
2. Add frontmatter (required keys listed below). Save the file.
3. Automatic discovery: the app will pick the file up via `import.meta.glob` and HMR will update the site. If HMR doesn't detect it, run:

```bash
npm run content:update-index
```

4. Preview locally:

- Lesson: `http://localhost:3000/#/lessons/<courseSlug>/<slug>`
- Blog: `http://localhost:3000/#/blog/<slug>`
- Add `?debug=1` to any lesson URL to show the `LESSONS` JSON block for debugging.

5. Run a smoke-check (optional / recommended):

```bash
npm run content:check -- --type=lesson --slug=<slug>
```

6. Commit. If Husky is set up, pre-commit will auto-run the index updater and stage changed `index.md`:

```bash
git add content/courses/<course-slug>/<your-file>.md
git commit -m "chore(content): add lesson <slug> to <courseSlug>"
```

Required frontmatter schemas (examples)

Lesson example

```yaml
---
type: lesson
title: "Introduction to Japanese Language & Writing Systems"
slug: introduction-to-japanese-language-and-scripts
description: "Learn the foundations of Japanese language and culture..."
courseSlug: japanese-language-culture
week: 1
videoNumber: 1
keywords:
  - japanese language basics
  - hiragana
canonical: /courses/japanese-language-culture/introduction-to-japanese-language-and-scripts
publishDate: 2026-02-09
---
```

Blog example

```yaml
---
type: blog
title: "How does a Blockchain actually work?"
slug: blockchain-simplified
description: "A beginner-friendly guide to distributed ledgers and blocks."
keywords:
  - blockchain
  - crypto
publishDate: 2023-11-15
canonical: /blog/blockchain-simplified
---
```

Frontmatter field rules & styling

- `type`: must be `lesson` or `blog`.
- `slug`: URL-safe, lowercase, hyphen-separated, unique across lessons and blogs.
- `courseSlug`: for lessons only — must match the course folder name.
- `title` and `description`: human-readable, keep description short (one sentence summary).
- `keywords`: YAML array (each line prefixed with `- `). Used by recommendations.
- `publishDate`: ISO date `YYYY-MM-DD` for blogs (recommended for sorting).
- `canonical`: path string (begin with `/`) for SEO and canonical link tags.
- Quoting: quoted scalars are accepted; the adapter strips surrounding quotes. Prefer unquoted for slugs and numeric fields.

Content structure & authoring rules

- Lead paragraph: first paragraph should clearly answer the lesson's atomic question.
- Headings: use Markdown `#`, `##`, `###` consistently; prefer `##` for major sections in lessons.
- Custom callouts: `LuminaMarkdown` supports custom `:::` blocks such as:
  - `:::note` (general notes)
  - `:::definition`
  - `:::aeo` (author/educator notes)
  - `:::recap` (short summary/revision checks)
- Code: use fenced code blocks with language tags for syntax highlighting.
- Images: prefer relative paths and include `alt` text; keep images optimized.
- Tables: use simple Markdown tables; test readability in both light and dark modes.

Validation rules (lesson-specific)

- The `markdownValidator` runs only for `type: lesson` and enforces authoring conventions such as:
  - Presence of a short lead/answer block.
  - Presence of `aeo` blocks when required by the lesson schema.
  - Presence of a `recap` block for short reinforcement (recommended).
- Blocking errors are logged to console during dev. Fix them before publishing.

Automation & CI notes

- Dynamic discovery: because `contentAdapter` uses a glob import, adding `.md` files under `content/` will be discovered automatically by the site.
- Index regeneration: `scripts/update-course-index.cjs` builds a simple `index.md` for each course from lessons in the course folder. The watcher (`scripts/watch-index.cjs`) runs this automatically during development (and Husky runs it on pre-commit if Git + husky are set up).
- PR checks: `.github/workflows/content-check.yml` runs `npm run content:check` on PRs to detect duplicate/missing slugs.

Commands reference

```bash
# Start dev server + automatic index watcher
npm install           # once, to install concurrently & husky
npm run dev

# Regenerate course indexes manually
npm run content:update-index

# Run the smoke-check
npm run content:check -- --type=lesson --slug=<slug>

# Run only the watcher (no vite)
npm run content:watch-index

# Install husky hooks if needed
npm run prepare
```

Troubleshooting common issues

- "Lesson not found": ensure `courseSlug` and `slug` match the URL and frontmatter; ensure the file is saved; run `npm run content:update-index` and check `LessonView?debug=1` to inspect `LESSONS`.
- HMR didn't pick up file: run `npm run dev` or `npm run content:update-index`.
- Husky not installed: run `npm run prepare` and make sure the repo is a Git repo and `git` is installed.
- Watcher loops: the watcher ignores `index.md` and suppresses events after the updater runs. If you still see loops, stop existing watchers and re-run `npm run content:watch-index`.

Publishing checklist (final pass before publishing)

1. Run `npm run content:check` — ensure no duplicates or missing slugs.
2. Preview the page(s) locally and review in dark mode.
3. Validate frontmatter (slug, canonical, keywords, publishDate where applicable).
4. Review any `markdownValidator` warnings and fix blocking errors.
5. Commit and create a PR — CI will run the content smoke check.

If you'd like, I can also:

- Convert the watcher to use `chokidar` for more robust cross-platform file watching.
- Add a `dev:all` script rather than changing the default `dev` script.
- Add a CI step to auto-commit regenerated `index.md` files (requires a bot token).

---

End of Guide_to_upload (updated)

11. Commit message suggestion

- `chore(content): add lesson <slug> to <course-slug> — <short description>`

12. Optional (recommended) CI checks

- Add a simple content smoke test that imports `lib/contentAdapter` and asserts the new slug appears in `LESSONS` or `BLOGS` arrays.

If you want, I can:

- Add the import to `lib/contentAdapter.ts` for you (I can modify the file).
- Create a small CI test file that validates content presence.

---

End of Guide_to_upload
