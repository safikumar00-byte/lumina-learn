import React from "react";
import { marked } from "marked";
import {
  Info,
  Book,
  HelpCircle,
  CheckCircle,
  Zap,
  Layers,
  ListChecks,
} from "lucide-react";
import {
  ImageBlock,
  ImageCaptionBlock,
  ImageQuoteBlock,
  ImageSplitBlock,
} from "./ImageBlocks";
import AssignmentBlock from "./AssignmentBlock";
import { generateSlug } from "../lib/headingExtractor";

interface LuminaMarkdownProps {
  content: string;
}

/**
 * Custom heading renderer for marked.js
 * Adds id attributes to h2 headings for anchoring
 */
const createHeadingRenderer = () => {
  return (token: any) => {
    const text = token.text;
    const level = token.depth;

    // Add id attribute to h2 (level 2) headings only
    if (level === 2) {
      const id = generateSlug(text);
      return `<h${level} id="${id}">${text}</h${level}>`;
    }

    // Return other headings without modification
    return `<h${level}>${text}</h${level}>`;
  };
};

const LuminaMarkdown: React.FC<LuminaMarkdownProps> = ({ content }) => {
  // Configure marked with custom heading renderer to add IDs to h2 headings
  const headingRenderer = createHeadingRenderer();
  marked.use({
    renderer: {
      heading(token: any) {
        return headingRenderer(token);
      },
    },
  });

  // Regex to find and parse :::block ... ::: with flexible whitespace handling
  // Matches: :::type followed by optional blank lines/spaces, content, optional spaces, and closing :::

  const blockRegex =
    /(?:^|\n)\s*:::(note|definition|example|comparison|key|aeo|recap|image|image-caption|image-quote|image-split|assignment)\s*\n([\s\S]*?)\n\s*:::\s*(?=\n|$)/g;

  const renderBlock = (type: string, innerContent: string) => {
    const htmlContent = marked.parse(innerContent) as string;

    // if (content.includes(":::")) {
    //   const unmatched = content.match(
    //     /:::(?!note|definition|example|comparison|key|aeo|recap)/g,
    //   );
    //   if (unmatched) {
    //     console.warn("⚠️ Unrecognized Lumina block detected:", unmatched);
    //   }
    // }

    // const unmatchedRecap =
    //   content.includes(":::recap") && !blockRegex.test(content);
    // if (unmatchedRecap) {
    //   console.warn(
    //     "⚠️ recap block detected but not parsed — check closing :::",
    //   );
    // }

    switch (type) {
      case "note":
        return (
          <div className="my-8 p-4 bg-zinc-50/80 dark:bg-zinc-900/70 border-l-2 border-zinc-200 dark:border-zinc-700 rounded-r-xl text-sm text-zinc-700 dark:text-zinc-300 flex gap-3">
            <Info
              size={18}
              className="flex-shrink-0 mt-0.5 text-zinc-600 dark:text-zinc-300"
            />
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose-sm prose-p:leading-relaxed prose-p:my-0"
            />
          </div>
        );
      case "definition":
        return (
          <div className="my-10 p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex gap-4 items-start">
            <Book
              size={24}
              className="flex-shrink-0 mt-1 opacity-60 text-zinc-600 dark:text-zinc-300"
            />
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-zinc-600 dark:text-zinc-400">
                Definition
              </h4>
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="prose-lg font-serif italic prose-p:leading-relaxed"
              />
            </div>
          </div>
        );
      case "example":
        return (
          <div className="my-8 p-6 bg-zinc-50/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Zap size={14} /> Practical Example
            </h4>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="font-mono text-sm leading-relaxed break-words"
            />
          </div>
        );
      case "comparison":
        const columns = innerContent
          .split("---")
          .map((c) => marked.parse(c.trim()));
        return (
          <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map((col, i) => (
              <div
                key={i}
                className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: col as string }}
                  className="prose-sm"
                />
              </div>
            ))}
          </div>
        );
      case "key":
        return (
          <div className="my-8 p-6 bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex gap-4">
            <Zap
              size={20}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0"
            />
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest mb-1 text-amber-700 dark:text-amber-300">
                Core Principle
              </h4>
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="text-amber-900 dark:text-amber-200 font-medium"
              />
            </div>
          </div>
        );
      case "aeo":
        return (
          <div className="my-12 p-8 bg-zinc-50/80 dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-300 mb-4">
              <HelpCircle size={20} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                AEO Featured Answer
              </span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose-lg prose-p:leading-relaxed"
            />
          </div>
        );
      case "recap":
        return (
          <div className="my-12 p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white/60 dark:bg-zinc-950/40">
            <h4 className="flex items-center gap-2 text-xl font-serif font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
              <ListChecks size={24} /> Quick Recap
            </h4>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose prose-sm prose-li:marker:text-zinc-700 dark:prose-li:marker:text-zinc-300"
            />
          </div>
        );
      case "image":
        return <ImageBlock content={innerContent} />;
      case "image-caption":
        return <ImageCaptionBlock content={innerContent} />;
      case "image-quote":
        return <ImageQuoteBlock content={innerContent} />;
      case "image-split":
        return <ImageSplitBlock content={innerContent} />;
      case "assignment":
        return <AssignmentBlock content={innerContent} />;
      default:
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }
  };

  // Split content by blocks and render
  const parts = [];
  let lastIndex = 0;
  let match;

  // console.log("📥 Raw markdown length:", content.length);
  // console.log("📥 Contains ::: ?", content.includes(":::"));

  while ((match = blockRegex.exec(content)) !== null) {
    // console.log("🧩 Lumina block found:", match[1]);

    // Standard markdown before the block
    if (match.index > lastIndex) {
      parts.push(
        <div
          key={`text-${lastIndex}`}
          dangerouslySetInnerHTML={{
            __html: marked.parse(
              content.substring(lastIndex, match.index),
            ) as string,
          }}
          className={
            "prose prose-zinc dark:prose-invert prose-lg max-w-none " +
            "prose-headings:font-semibold prose-headings:leading-tight " +
            "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg " +
            "prose-p:leading-relaxed prose-p:my-4 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 " +
            "prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-a:transition-colors " +
            "prose-blockquote:border-l-4 prose-blockquote:border-zinc-200 dark:prose-blockquote:border-zinc-700 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:pl-4 prose-blockquote:italic " +
            "prose-ul:space-y-2 prose-ol:space-y-2 prose-li:marker:text-zinc-600 dark:prose-li:marker:text-zinc-400 " +
            "prose-table:border-collapse prose-table:w-full prose-th:font-medium prose-th:bg-zinc-100 dark:prose-th:bg-zinc-900 prose-td:px-3 prose-th:px-3 prose-tbody:odd:bg-zinc-50 dark:prose-tbody:odd:bg-zinc-900 " +
            "prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1 prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900 prose-pre:rounded-lg prose-pre:overflow-x-auto"
          }
        />,
      );
    }
    // The Lumina block
    parts.push(
      <React.Fragment key={`block-${match.index}`}>
        {renderBlock(match[1], match[2])}
      </React.Fragment>,
    );
    lastIndex = match.index + match[0].length;
  }

  console.log("🧮 Parts length:", parts);

  // Remaining markdown
  if (lastIndex < content.length) {
    // console.log("📥 Remaining markdown length:", content.length - lastIndex);
    parts.push(
      <div
        key={`text-${lastIndex}`}
        dangerouslySetInnerHTML={{
          __html: marked.parse(content.substring(lastIndex)) as string,
        }}
        className={
          "prose prose-zinc dark:prose-invert prose-lg max-w-none " +
          "prose-headings:font-semibold prose-headings:leading-tight " +
          "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg " +
          "prose-p:leading-relaxed prose-p:my-4 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 " +
          "prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-a:transition-colors " +
          "prose-blockquote:border-l-4 prose-blockquote:border-zinc-200 dark:prose-blockquote:border-zinc-700 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:pl-4 prose-blockquote:italic " +
          "prose-ul:space-y-2 prose-ol:space-y-2 prose-li:marker:text-zinc-600 dark:prose-li:marker:text-zinc-400 " +
          "prose-table:border-collapse prose-table:w-full prose-th:font-medium prose-th:bg-zinc-100 dark:prose-th:bg-zinc-900 prose-td:px-3 prose-th:px-3 prose-tbody:odd:bg-zinc-50 dark:prose-tbody:odd:bg-zinc-900 " +
          "prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1 prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900 prose-pre:rounded-lg prose-pre:overflow-x-auto"
        }
      />,
    );
  }

  // console.log("🔥 LuminaMarkdown loaded from:", import.meta.url);
  // console.log("🔥 Lumina regex:", blockRegex.toString());

  // console.log("🔥 LuminaMarkdown parts:", parts);

  return <div className="lumina-content">{parts}</div>;
};

export default LuminaMarkdown;
