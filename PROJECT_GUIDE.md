
# Lumina Learn – Content & Engineering Guide

## 1. Content Philosophy
* **Markdown is the Source of Truth**: All lesson content is stored and edited exclusively as raw Markdown. HTML is only generated at the point of display.
* **One Lesson = One Answer**: Each lesson must focus on a single atomic concept. The goal is to solve a user's query as clearly and quickly as possible.
* **Atomic Learning**: We prefer high-quality visuals and simple language over academic jargon.

## 2. Authoring Rules
* **The Room vs Door Model**:
    * **Lessons are Rooms**: Where the learning happens. They must be self-contained.
    * **Courses/Blogs are Doors**: Discovery paths that lead to the lessons.
* **Heading Standards**:
    * **H1 Title**: Every lesson must have exactly one H1. It should ideally be a question or a clear descriptor (e.g., `# What is SOV in Japanese?`).
    * **First Paragraph**: Must provide a direct, snippet-ready answer to the H1.
    * **Forbidden Content**: Do not use HTML tags in the Markdown source. Do not use internal admin titles like "Lesson 1" or "Day 3" as the visible H1.

## 3. Markdown Rules
* **Structure**:
    1. H1 Heading
    2. Answer Paragraph
    3. H2 Core Explanation
    4. Examples (Code blocks, Tables, or Lists)
    5. H3 Quick Recap (Bullet points)
* **Linking**:
    * **Internal Links**: Use relative paths (e.g., `[Greetings](../greetings-expressions)`).
    * **External Links**: Must use full URLs and descriptive text.
* **Visuals**: Use Markdown tables for comparisons. Use blockquotes for "Pro Tips" or "AEO Insights".

## 4. Editing Workflow
1. **Admin Access**: Navigate to `/admin`.
2. **Write/Edit**: Use the Markdown editor. It forces raw text entry.
3. **Preview**: Toggle the "HTML Preview" to see how the lesson renders at runtime.
4. **Save**: Saving stores the `markdown` string and the `frontmatter` metadata.

## 5. SEO & Meta Rules
* **Frontmatter**: Every lesson is associated with a metadata object including `title`, `description`, and `keywords`.
* **Title Tag**: Mirrors the `frontmatter.title`.
* **Canonical**: Every lesson must have a canonical URL defined to prevent duplicate content issues between Course and Blog contexts.
* **Descriptions**: Keep between 150-160 characters for optimal search display.

## 6. Forbidden List
* **No HTML in Editor**: If you see `<div>` or `<h1>` in the editor, delete them and replace with Markdown.
* **No Duplication**: Never create two lessons for the same concept. Update the existing one.
* **No Mixed Intents**: One lesson, one answer. If a topic is too broad, split it into two lessons.
