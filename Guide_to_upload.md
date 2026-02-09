# Guide to Uploading Lessons & Blogs

Purpose: a concise, actionable checklist and style/rules reference for adding new Markdown lessons or blogs to the Lumina Learn repo.

**Quick Checklist**

- **Frontmatter:** Add valid YAML frontmatter at top with `type` set to `lesson` or `blog` and required fields (see schema below).
- **File Location:** Save lessons under `content/courses/<course-slug>/` and blogs under `content/blogs/`.
- **Add Import:** Add an import for the new file in `lib/contentAdapter.ts` (imports are explicit). For lessons, ensure the lesson is included in `allContent`; for blogs, include it in `blogContent`.
- **Course Index:** If this is a lesson, update the course `index.md` if you maintain a human-readable list or order manually in frontmatter (`order` or `week`).
- **Run Dev Server / HMR:** Save and confirm Vite HMR picks up the change or restart `npm run dev`.
- **Validate:** Fix any markdown validation errors. The validator runs for lessons and logs blocking errors to console. Address AEO/recap/lead-answer rules if flagged.
- **Preview:** Open the URL:
  - Lesson: `/#/lessons/<courseSlug>/<slug>`
  - Blog: `/#/blog/<slug>`
    Use `?debug=1` to show extra diagnostics in the lesson view.
- **SEO & Meta:** Confirm `meta.title`, `meta.description` (or frontmatter `description`), and `canonical` are correct.
- **Images & Accessibility:** Include `alt` text for images; use optimized sizes and relative paths.
- **Commit & Push:** Commit the `.md` and `lib/contentAdapter.ts` changes with a descriptive message.

**Rules_of_document_lessons_blogs**

1. Required frontmatter keys
   - For lessons (minimum):
     - `type: "lesson"`
     - `title` (human readable)
     - `slug` (URL-safe, unique, lowercase, hyphen-separated)
     - `description` (short summary)
     - `courseSlug` (the course folder slug)
     - `week` (number, optional but recommended)
     - `videoNumber` (number or 0)
     - `canonical` (recommended)
   - For blogs (minimum):
     - `type: "blog"`
     - `title`
     - `slug`
     - `description`
     - `publishDate` (YYYY-MM-DD recommended)
     - `canonical` (recommended)

2. YAML formatting rules

- Always start and end frontmatter with `---` on its own line.
- Use plain scalars for `slug` and `courseSlug`. Quoted values are allowed; `contentAdapter` now strips surrounding quotes, but prefer unquoted plain strings.
- `keywords` must be a YAML array (indented `- item` lines).

3. Slug & naming rules

- Slugs are case-sensitive and must match the path used in routes.
- Use only lowercase letters, numbers, and hyphens. Avoid spaces or special characters.
- Ensure slug uniqueness across lessons and blogs to avoid routing collisions.

4. Content & structure rules

- Keep the lead (first paragraph) concise and clear; frontmatter `description` should mirror it.
- Use custom block markers supported by `LuminaMarkdown` (e.g., `:::note`, `:::definition`, `:::aeo`, `:::recap`) for structured callouts.
- Use fenced code blocks (```lang) for code samples.
- For images, provide `alt` text and prefer relative paths (e.g., `./images/example.png`).

5. Validation rules (lesson-specific)

- The project runs `markdownValidator` on lessons. Common enforcement rules:
  - A lead / answer block is expected for atomic lessons.
  - AEO blocks must be present where required (author/educator notes).
  - A final `recap` block is preferred for short lessons.
  - Blocking errors are printed to console during dev; resolve them before publishing.

6. ContentAdapter integration

- This project uses explicit imports in `lib/contentAdapter.ts`. After adding a new file:
  - Add an import at the top of `contentAdapter.ts` for the new .md file (use `?raw` suffix like other imports).
  - Add the imported variable to the appropriate array (`allContent` for lessons/courses/concepts, `blogContent` for blogs).
  - Save; Vite HMR should pick up the changes. If not, restart `npm run dev`.

7. SEO & metadata

- Provide `meta.title` and `meta.description` in frontmatter if you want richer SEO.
- Use `canonical` to point to the final path (e.g., `/courses/<course>/...` or `/blog/<slug>`).

8. UX & site behavior checks

- Confirm the lesson appears in the course sidebar (Course weeks are built from `contentAdapter` based on `courseSlug` and `week`).
- Check `ValidationWarning` appears only for lessons and that `CommentsSection` renders where expected.
- Confirm recommendations (related/popular) if your blog has `keywords`—they are used by `BlogRecommendationSection`.

9. Troubleshooting — "Lesson not found" common causes

- Missing or incorrect `courseSlug` in lesson frontmatter — add `courseSlug: "<course-slug>"`.
- `slug` mismatch between frontmatter and URL — ensure exact match.
- File not imported in `lib/contentAdapter.ts` — add explicit import and include in `allContent`.
- Frontmatter parsing errors (malformed YAML) — ensure `---` delimiters and indentation for arrays.
- Not saved / editor didn’t write file — save and wait for HMR; check terminal for HMR logs.
- If you still see the error, open the lesson URL with debug enabled: append `?debug=1` to show the lessons array in the page.

10. Commands & quick steps

```
# Start dev server
npm run dev

# Restart if HMR misses an import
ctrl-c
npm run dev

# Optional: open lesson in debug mode
# Browser: http://localhost:3002/#/lessons/<courseSlug>/<slug>?debug=1
```

11. Commit message suggestion

- `chore(content): add lesson <slug> to <course-slug> — <short description>`

12. Optional (recommended) CI checks

- Add a simple content smoke test that imports `lib/contentAdapter` and asserts the new slug appears in `LESSONS` or `BLOGS` arrays.

If you want, I can:

- Add the import to `lib/contentAdapter.ts` for you (I can modify the file).
- Create a small CI test file that validates content presence.

---

End of Guide_to_upload
