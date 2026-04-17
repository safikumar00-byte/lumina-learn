---
type: lesson
title: "Smart Image System Test Lesson"
slug: smart-image-system-test
description: "Test lesson demonstrating the Smart Image System with all four image block types."
courseSlug: japanese-language-culture
week: 1
videoNumber: 4
order: 4
keywords:
  - smart image system
  - test lesson
  - image blocks
canonical: /courses/japanese-language-culture/smart-image-system-test
publishDate: 2026-03-07
---

# Smart Image System Test Lesson

This lesson demonstrates all four image block types available in the Smart Image System.

:::aeo
**What are image safikumar blocks?**
Image blocks are special Markdown sections (:::image, :::image-caption, :::image-quote, :::image-split) that render images within Lumina Learn's design system, supporting responsive layouts, dark mode, and semantic HTML.
:::

## Standard Image Block

The basic `:::image` block renders a single image with optional caption.

:::image
src: /images/test.png
alt: Example diagram showing the concept being explained
caption: This is a regular image with a caption, displayed full-width on mobile and constrained on desktop
:::

---

## Image Caption Block

Use `:::image-caption` for important educational figures where the caption deserves prominence.

:::image-caption
src: /images/test.png
alt: Educational figure with styled caption for emphasis
caption: Figure 1: A textbook-style figure with prominently displayed caption
:::

---

## Image Quote Block

The `:::image-quote` block combines an image with a key insight or principle.

:::image-quote
src: /images/test.png
alt: Diagram illustrating a key principle
quote: "Images combined with key insights create memorable learning moments."
author: Educational Design Principle
:::

---

## Image Split Block

Use `:::image-split` for side-by-side image and text explanations. The layout is responsive: side-by-side on desktop, stacked on mobile.

:::image-split
src: /images/test.png
alt: Diagram with accompanying explanation text
side: left
content:
This is the explanatory text that appears beside the image. The text supports **full Markdown formatting** including:

- Bullet points
- _Italic text_
- **Bold text**
- Multiple paragraphs

On mobile, the image appears above this text. On desktop (≥1024px), they appear side-by-side.
:::

---

## Another Split Example (Right Alignment)

:::image-split
src: /images/test.png
alt: Another example with text on the left
side: right
content:
This time, the image appears on the right side of the screen (on desktop). The `side: right` parameter controls the placement. Mobile behavior remains the same: image first, then text below.
:::

:::recap

- `:::image` renders a simple diagram with optional caption
- `:::image-caption` emphasizes the caption for important figures
- `:::image-quote` pairs images with key insights
- `:::image-split` creates side-by-side image and text layouts
- All blocks support dark mode and responsive design
- Alt text is required for accessibility and SEO
  :::
