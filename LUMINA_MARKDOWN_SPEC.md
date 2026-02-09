# Lumina Markdown Specification (v1)

## 1. Philosophy
Lumina Markdown is designed to decouple **content intent** from **visual presentation**. Authors define *what* a piece of content is (a definition, a comparison, a key rule), and the system handles *how* it looks.

## 2. Block Syntax
Lumina uses fenced blocks starting with `:::[type]` and ending with `:::`.

### :::note
Subtle attribution or context.
```markdown
:::note
Based on the curriculum by Prof. Vatsala Misra.
:::
```

### :::definition
The primary answer or formal concept explanation.
```markdown
:::definition
SOV stands for Subject-Object-Verb, the core structure of Japanese.
:::
```

### :::example
Practical demonstration of a concept.
```markdown
:::example
English: I eat sushi.
Japanese: Watashi wa sushi o tabemasu.
:::
```

### :::comparison
Side-by-side contrast. Use `---` as a separator for columns.
```markdown
:::comparison
**English (SVO)**
Verb in the middle.
---
**Japanese (SOV)**
Verb at the end.
:::
```

### :::key
Core rules that must be remembered.
```markdown
:::key
Japanese verbs always appear at the end of the sentence.
:::
```

### :::aeo
Direct Question & Answer optimized for search snippets.
```markdown
:::aeo
**Is Japanese backward?**
No, it simply follows a context-first logic.
:::
```

### :::recap
Summary bullet points at the end of a lesson.
```markdown
:::recap
- Verbs come last
- Particles mark nouns
- Subject is optional
:::
```

## 3. Writing Rules
- **Do NOT** use HTML tags.
- **Do NOT** use custom CSS classes.
- Use standard Markdown headings (`##`, `###`) for structure.
- Only use one H1 (`#`) per file.