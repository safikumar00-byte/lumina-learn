# Prompt & Automation Guide: Generate Lesson Markdown from Video / Transcript

This document contains:

- A ready-to-use prompt for converting a video transcript into a lesson Markdown file that matches the project's frontmatter schema.
- Example CLI snippets to automatically transcribe a video into text (using OpenAI Whisper locally or the whisper API), then call an LLM to generate a properly-formatted `.md` file.
- Recommendations for automations (local watcher + GitHub Actions) that stage and update indexes automatically.

---

## 1) ChatGPT / LLM Prompt Template

Use this template (replace bracketed placeholders) to ask an LLM to convert a raw transcript into a clean lesson `.md` file with required frontmatter and body.

Prompt:

```
You are a Markdown authoring assistant for the Lumina Learn course platform.

Input: a raw transcript of a short lesson video (1-12 minutes). Produce a single Markdown document that exactly matches the project's expected lesson format.

Requirements:
- Output must be valid Markdown with YAML frontmatter delimited by `---` lines at the very top.
- The frontmatter must contain these keys (use these exact keys):
  - `type`: set to `lesson`
  - `title`: a concise, human-friendly title (use Title Case)
  - `slug`: url-safe lowercase-hyphen slug (derive from title; only a-z0-9 and hyphens)
  - `description`: one-sentence summary (max 140 characters)
  - `courseSlug`: provided course slug (insert the given value)
  - `keywords`: YAML array of 3-6 keywords (short phrases)
  - `canonical`: path beginning with `/lessons/<courseSlug>/<slug>`
  - `order`: integer (use the provided numeric order or default to 0)
  - `publishDate`: ISO date `YYYY-MM-DD` (if not provided, use today's date)
  - `thumbnail`: a short slug or filename for the lesson thumbnail (optional)

Body rules:
- Create a short lead paragraph that clearly answers: "What will a learner be able to do after this lesson?" Keep it concise.
- Use `##` subheadings for 2-6 major sections (e.g., "Examples", "Practice", "Key Points").
- Include at least one `:::` callout block of type `aeo` (author/educator note) highlighting teaching tips or common misconceptions.
- Include one `:::recap` block at the end with 3 short bullet points summarizing the lesson.
- Keep code blocks fenced with language tags when present.
- Keep lines <= 100 chars where reasonable; avoid excessive prose.

Return only the Markdown content (no surrounding commentary). Ensure YAML values are properly quoted if they contain punctuation.

Context variables (replace these before sending to the model):
- `{{COURSE_SLUG}}` — the course folder slug, e.g. `japanese-language-culture`
- `{{ORDER}}` — numeric order within the course (optional)
- `{{PUBLISH_DATE}}` — date string (optional)
- `{{THUMBNAIL}}` — thumbnail identifier (optional)

Transcript:
"""
{{TRANSCRIPT}}
"""

Produce the Markdown now.
```

Example usage: call the LLM with the filled prompt and the transcript as `{{TRANSCRIPT}}`.

---

## 2) Example local pipeline (transcribe + generate)

This is a recipe — implement as a script in your environment.

1. Extract audio if needed (ffmpeg):

```bash
ffmpeg -i lesson.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 lesson.wav
```

2. Transcribe with Whisper (local or API):

# Local Whisper (if installed)

```bash
whisper lesson.wav --model small --language en --output_format txt
# produces lesson.txt
```

# Or use OpenAI Whisper API / other ASR to produce `lesson.txt`.

````

3) Call an LLM (OpenAI Chat completions, local LLM) with the prompt above and the transcript file content as `{{TRANSCRIPT}}`. Save the response to `content/courses/<courseSlug>/<slug>.md`.

Example Node snippet (pseudo):

```js
// read transcript
const transcript = fs.readFileSync('lesson.txt','utf8');
const filledPrompt = template.replace('{{COURSE_SLUG}}', courseSlug)
                             .replace('{{ORDER}}', order || '0')
                             .replace('{{TRANSCRIPT}}', transcript);
const md = await callLLM(filledPrompt);
fs.writeFileSync(`content/courses/${courseSlug}/${slug}.md`, md);
````

Make sure the `slug` is generated from the returned frontmatter or derived deterministically from the `title` (lowercase, hyphens).

---

## 3) Automation suggestions

- Local development: run `node scripts/watch-and-stage.cjs` (I added this script) while you drop `.md` files into `content/`. It will auto-stage those files with `git add` and run the index updater. You still need to commit/push when ready.
- CI: The repository now contains `.github/workflows/auto-content-update.yml` which runs on pushes that touch `content/**` and will regenerate course `index.md` files and commit them back to the repository when changes are detected.
- Linting: the project uses `scripts/check_content.cjs` to detect duplicate slugs and to assert slug presence. Run `npm run content:check` before committing or wire it into a pre-push step.

## 4) Linting rule changes (recommended)

To make the validator accept generated files consistently, enforce these rules in your LLM prompt (already included above):

- Always include `---` frontmatter delimiters.
- Always include `type: lesson` or `type: blog`.
- `slug` must use only `a-z0-9-` and be unique.
- `courseSlug` must match the folder under `content/courses/`.
- `keywords` must be a YAML array (`- item`).
- `canonical` must start with `/lessons/<courseSlug>/...`.

## 5) Safety & best practices

- Do not let the LLM automatically commit and push to `main` without manual review—use a branch and PR flow when possible.
- Review the generated `.md` file before committing to ensure accuracy of transcripts and examples.
- If audio contains PII, review and scrub before publishing.

---

If you'd like, I can also:

- Add a simple Node script that implements the full transcribe -> LLM -> write-file flow using OpenAI (or a local LLM) in this repo.
- Wire `scripts/watch-and-stage.cjs` into an npm script like `npm run content:autostage`.
