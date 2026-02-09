import React, { useState } from "react";
import {
  Layout,
  Save,
  Eye,
  Edit3,
  AlertCircle,
  List,
  Plus,
  FileText,
  Zap,
} from "lucide-react";
import { LESSONS } from "../lib/contentAdapter";
import { Lesson } from "../types";
import LuminaMarkdown from "../components/LuminaMarkdown";

const AdminEditor: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState(`:::definition
Lumina Semantic Markdown allows authors to define structure without HTML.
:::

:::comparison
Standard Markdown
Fast to write.
---
Lumina Blocks
Rich, semantic UI.
:::
`);
  const [isPreview, setIsPreview] = useState(false);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setMarkdown(lesson.markdown);
    setIsPreview(false);
  };

  const handleNew = () => {
    setSelectedLessonId(null);
    setMarkdown(`# New Lesson Title

:::definition
Enter the core concept definition here for SEO snippets.
:::

## Context
Detail the background.

:::aeo
**Question goes here?**
Answer goes here.
:::

:::recap
- Key takeaway 1
- Key takeaway 2
:::`);
    setIsPreview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Content Editor</h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">
            Source of Truth: LUMINA MARKDOWN
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Plus size={18} /> New
          </button>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-6 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {isPreview ? (
              <>
                <Edit3 size={18} /> Edit Source
              </>
            ) : (
              <>
                <Eye size={18} /> Rich Preview
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-80 transition-opacity shadow-lg">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <h4 className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">
              <List size={14} /> Browse Lessons
            </h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSelectLesson(l)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${selectedLessonId === l.id ? "bg-black text-white border-black dark:bg-white dark:text-black" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 shadow-sm"}`}
                >
                  {l.frontmatter.title}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
            <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-400 text-sm mb-3 uppercase tracking-tighter">
              <Zap size={16} /> Lumina Syntax
            </h4>
            <div className="text-[10px] space-y-2 opacity-80">
              <code className="block p-1 bg-white/50 dark:bg-black/20 rounded">
                :::definition
              </code>
              <code className="block p-1 bg-white/50 dark:bg-black/20 rounded">
                :::comparison
              </code>
              <code className="block p-1 bg-white/50 dark:bg-black/20 rounded">
                :::example
              </code>
              <code className="block p-1 bg-white/50 dark:bg-black/20 rounded">
                :::key
              </code>
              <code className="block p-1 bg-white/50 dark:bg-black/20 rounded">
                :::aeo
              </code>
              <code className="block p-1 bg-white/50 dark:bg-black/20 rounded">
                :::recap
              </code>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {isPreview ? (
            <div className="p-12 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 shadow-sm">
              <div className="mb-6 pb-4 border-b border-dashed dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>SEMANTIC RENDER PREVIEW</span>
                <span>MODE: RICH-UI</span>
              </div>
              <LuminaMarkdown content={markdown} />
            </div>
          ) : (
            <div className="relative group">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[700px] p-8 font-mono text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-4 focus:ring-black/5 transition-all resize-none"
                placeholder="Write lesson using Lumina Semantic Blocks..."
              />
              <div className="absolute top-4 right-8 flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-white/80 dark:bg-zinc-950/80 px-2 py-1 rounded border dark:border-zinc-800">
                <FileText size={10} /> {markdown.length} chars
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
