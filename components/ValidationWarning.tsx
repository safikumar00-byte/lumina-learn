import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Lesson } from "../types";

interface ValidationWarningProps {
  lesson: Lesson;
  isDev?: boolean;
}

/**
 * Display validation warnings/errors for lessons that violate LUMINA_MARKDOWN_LINT.md
 *
 * In DEV: Shows prominent warning panel at top of lesson
 * In PROD: Returns null (rendering should be blocked by parent)
 */
const ValidationWarning: React.FC<ValidationWarningProps> = ({
  lesson,
  isDev = true,
}) => {
  const validation = lesson.validation;

  // No validation data available
  if (!validation) {
    return null;
  }

  // Valid lesson - no warnings needed
  if (validation.isValid) {
    return null;
  }

  // BLOCKING ERRORS - Content cannot render
  const blockingErrors = validation.errors.filter(
    (e) => e.severity === "error",
  );

  if (blockingErrors.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-amber-50/70 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-5 mb-8">
      <div className="flex items-start gap-4">
        <AlertTriangle
          size={20}
          className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Markdown Authoring Notice
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-200 mb-4">
            This lesson has blocking authoring issues per
            LUMINA_MARKDOWN_LINT.md. Resolve the items below to proceed.
          </p>

          <div className="space-y-3">
            {blockingErrors.map((error, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 p-3 rounded border border-amber-100 dark:border-amber-800"
              >
                <div className="font-medium text-amber-800 dark:text-amber-300 text-sm mb-1">
                  {error.rule}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-200 leading-relaxed">
                  {error.message}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-100/60 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
              How to fix
            </p>
            <ol className="text-xs text-amber-700 dark:text-amber-200 list-decimal list-inside space-y-1">
              <li>Read the messages above to identify the issue</li>
              <li>
                Edit the markdown file for this lesson:{" "}
                <code className="bg-amber-200 dark:bg-amber-900 px-1 rounded">
                  content/**/*/{lesson.slug}.md
                </code>
              </li>
              <li>
                Follow the rules in{" "}
                <code className="bg-amber-200 dark:bg-amber-900 px-1 rounded">
                  LUMINA_MARKDOWN_LINT.md
                </code>
              </li>
              <li>Reload the page after making corrections</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationWarning;
