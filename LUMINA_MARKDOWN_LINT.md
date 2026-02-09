# Lumina Markdown Lint & Authoring Rules

## 1. Introduction
This document defines the strict authoring standards for Lumina Learn. Because our platform uses a custom Markdown parser to generate rich UI components, consistency in the source files is non-negotiable. 

**Why these rules exist:**
- **SEO/AEO Performance:** To ensure search engines can easily extract featured snippets.
- **Rendering Stability:** To prevent the Lumina Markdown parser from breaking.
- **Learning Clarity:** To provide a predictable, high-quality reading experience for learners.

---

## 2. Core Authoring Rules

### Rule 1: One Lesson = One Intent
Every lesson must answer exactly one primary question or explain one atomic concept. If a topic feels too broad, split it into multiple lessons.
- **✅ Correct:** `How to say "Excuse Me" in Japanese?`
- **❌ Incorrect:** `Japanese Greetings, Etiquette, and Basic Grammar.`

### Rule 2: Exactly ONE H1 (AEO-Friendly)
Each file must have exactly one H1 (`#`). This title must be descriptive and ideally phrased as a question that a user would type into a search engine.
- **✅ Correct:** `# What is the difference between Hiragana and Katakana?`
- **❌ Incorrect:** `# Lesson 1 - The Basics` or `# Week 2`

### Rule 3: Lead Answer Rule
The very first paragraph after the H1 must be a direct, 2-3 sentence answer to the main question. This is the content used by Google and other Search Engines for "Answer Box" snippets.
- **✅ Correct:** 
  `# How do I say Hello in Japanese?`
  `The most common way to say hello in Japanese is **Konnichiwa**. It is used primarily during the day as a polite, general-purpose greeting.`
- **❌ Incorrect:** 
  `# How do I say Hello in Japanese?`
  `Welcome back to our course! In this lesson, we will look at various ways people talk to each other in Tokyo...` (Too much fluff)

### Rule 4: Heading Hierarchy
Maintain strict heading levels. Never skip a level. 
- **✅ Correct:** H1 → H2 → H3
- **❌ Incorrect:** H1 → H3 → H2

### Rule 5: Lumina Blocks Only
Only use the supported Lumina Fenced Blocks (`:::type`). Never use raw HTML or JSX.
- **Supported Blocks:** `note`, `definition`, `example`, `comparison`, `key`, `aeo`, `recap`.

### Rule 6: AEO Section Required
Every lesson must contain at least one `:::aeo` block to facilitate Answer Engine Optimization.
- **✅ Correct:**
  ```markdown
  :::aeo
  **Is Konnichiwa used at night?**
  No, Konnichiwa is used from late morning until dusk. For evenings, use Konbanwa.
  :::
  ```

### Rule 7: Internal Linking
Every lesson must link to at least one other lesson on the platform using relative Markdown links.
- **✅ Correct:** `Read more about [Japanese Particles](../particles-basics).`

### Rule 8: Images & Alt Text
All images must include descriptive alt text. We do not support external hotlinking; all assets must be referenced via the internal `/images/` path.
- **✅ Correct:** `![Diagram showing Japanese SOV structure](/images/grammar/sov-diagram.png)`

### Rule 9: Recap Required
Every lesson must conclude with a `:::recap` block summarizing the 3-5 key takeaways.

### Rule 10: Forbidden Content
- **No raw HTML:** No `<div>`, `<span>`, or `<style>`.
- **No layout instructions:** Do not write "Center this image" or "Make this red."
- **No inline styles:** Use semantic Markdown (`**bold**`, `*italic*`) only.

---

## 3. SEO & AEO Optimization

| Element | Target | Guidance |
| :--- | :--- | :--- |
| **Title Tag** | 50-60 characters | Must include the primary keyword. |
| **Meta Description** | 150-160 characters | Must include a call-to-action (e.g., "Learn why..."). |
| **H1** | Question-based | Match high-volume search queries. |
| **First Paragraph** | < 45 words | Optimized for the Google "Featured Snippet" length. |

---

## 4. Common Mistakes
1. **Multiple Intents:** Trying to teach too much at once.
2. **Overlong Introductions:** Spending 3 paragraphs "welcoming" the student. Get to the answer immediately.
3. **Missing Definitions:** Assuming the student already knows a term mentioned in the lesson. Use a `:::note` for definitions.

---

## 5. Final Pre-Publish Checklist
- [ ] Does this file have exactly one H1?
- [ ] Is the H1 phrased as a clear question?
- [ ] Does the first paragraph answer that question directly?
- [ ] Are all blocks using the `:::type` syntax?
- [ ] Is there an `:::aeo` section?
- [ ] Is there a `:::recap` at the end?
- [ ] Did I remove all raw HTML?

---

## 6. Philosophy Statement
**Clarity over Cleverness.** 
We do not write to impress; we write to explain. If a sentence can be simplified, simplify it. If a concept can be shown in a table, use a table. Our goal is to make the complex invisible.