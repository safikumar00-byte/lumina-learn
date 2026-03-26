import React from "react";
import { marked } from "marked";

/**
 * Parse image block parameters from the inner block content
 * Supports key: value syntax and multi-line content
 */
function parseImageBlockParams(content: string): Record<string, string> {
  const params: Record<string, string> = {};
  const lines = content.split("\n");
  let currentKey: string | null = null;
  let currentValue = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines at the start
    if (!trimmed && !currentKey) {
      continue;
    }

    // Check if this is a key: value pair
    const keyMatch = trimmed.match(/^(\w+):\s*(.*?)$/);

    if (keyMatch) {
      // Save previous key-value pair if exists
      if (currentKey) {
        params[currentKey] = currentValue.trim();
      }

      currentKey = keyMatch[1];
      currentValue = keyMatch[2];
    } else if (currentKey && trimmed) {
      // Continue multi-line value
      currentValue += "\n" + line;
    }
  }

  // Save final key-value pair
  if (currentKey) {
    params[currentKey] = currentValue.trim();
  }

  return params;
}

/**
 * Standard Image Block
 * Renders a single image with optional caption
 */
export const ImageBlock: React.FC<{ content: string }> = ({ content }) => {
  const params = parseImageBlockParams(content);
  const { src, alt, caption } = params;

  if (!src || !alt) {
    return (
      <div className="text-red-600">Error: image block missing src or alt</div>
    );
  }

  return (
    <figure className="my-8 p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <img
        src={src}
        alt={alt}
        className="w-full max-w-2xl mx-auto rounded-md shadow-sm"
        loading="lazy"
        decoding="async"
      />
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * Image Caption Block
 * Renders educational figure with styled caption (semantic figcaption)
 */
export const ImageCaptionBlock: React.FC<{ content: string }> = ({
  content,
}) => {
  const params = parseImageBlockParams(content);
  const { src, alt, caption } = params;

  if (!src || !alt) {
    return (
      <div className="text-red-600">
        Error: image-caption block missing src or alt
      </div>
    );
  }

  return (
    <figure className="my-10 text-center">
      <img
        src={src}
        alt={alt}
        className="w-full max-w-3xl mx-auto rounded-lg shadow-md bg-white dark:bg-zinc-900"
        loading="lazy"
        decoding="async"
      />
      {caption && (
        <figcaption className="mt-6 text-base font-serif italic text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * Image Quote Block
 * Renders image with a key insight/principle quote
 * Mobile: stacked, Desktop: side-by-side
 */
export const ImageQuoteBlock: React.FC<{ content: string }> = ({ content }) => {
  const params = parseImageBlockParams(content);
  const { src, alt, quote, author } = params;

  if (!src || !alt) {
    return (
      <div className="text-red-600">
        Error: image-quote block missing src or alt
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-red-600">Error: image-quote block missing quote</div>
    );
  }

  return (
    <div className="my-10 flex flex-col lg:flex-row gap-6 items-center">
      <figure className="flex-1 lg:flex-shrink-0 lg:max-w-lg">
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg shadow-sm"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <blockquote className="flex-1 text-lg font-serif italic text-zinc-800 dark:text-zinc-100 leading-relaxed border-l-4 border-zinc-300 dark:border-zinc-700 pl-6">
        <p>{quote}</p>
        {author && (
          <footer className="mt-3 text-sm font-normal not-italic text-zinc-600 dark:text-zinc-400">
            — {author}
          </footer>
        )}
      </blockquote>
    </div>
  );
};

/**
 * Image Split Block
 * Renders image and content side-by-side (with responsive stacking)
 * Mobile: stacked (image top, content below)
 * Desktop: grid with 2 equal columns
 */
export const ImageSplitBlock: React.FC<{ content: string }> = ({ content }) => {
  const params = parseImageBlockParams(content);
  const { src, alt, side, content: textContent } = params;

  if (!src || !alt) {
    return (
      <div className="text-red-600">
        Error: image-split block missing src or alt
      </div>
    );
  }

  if (!textContent) {
    return (
      <div className="text-red-600">
        Error: image-split block missing content
      </div>
    );
  }

  const sideValue = side?.toLowerCase() === "right" ? "right" : "left";

  // Parse markdown content for the text side
  const htmlContent = marked.parse(textContent) as string;

  // Mobile: image on top, text below
  // Desktop: order based on side parameter
  const imageOrder =
    sideValue === "left" ? "order-1 lg:order-1" : "order-2 lg:order-2";
  const textOrder =
    sideValue === "left" ? "order-2 lg:order-2" : "order-1 lg:order-1";

  return (
    <section className="my-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <figure className={imageOrder}>
        <img
          src={src}
          alt={alt}
          className="w-full rounded-md shadow-sm"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <aside className={textOrder}>
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="prose prose-sm dark:prose-invert max-w-none prose-p:my-3 prose-p:leading-relaxed prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100"
        />
      </aside>
    </section>
  );
};
