import React from "react";
import { useParams, Link } from "react-router-dom";
import { CONCEPTS, LESSONS, COURSES } from "../lib/contentAdapter";
// Added ChevronRight to the lucide-react imports
import { ArrowRight, Info, CheckCircle, ChevronRight } from "lucide-react";

const ConceptView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const concept = CONCEPTS.find((c) => c.slug === slug);
  const lesson = LESSONS.find((l) => l.id === concept?.linkedLessonId);
  const course = COURSES.find((c) => c.id === lesson?.courseId);

  if (!concept || !lesson || !course) {
    return <div className="p-20 text-center">Concept not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {/* SEO/AEO Focused Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
          {concept.title}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          Learn exactly {concept.title.toLowerCase()} in plain English, with
          context and examples from our structured courses.
        </p>
        <div className="flex justify-center gap-2">
          {concept.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded text-xs font-bold uppercase tracking-widest text-zinc-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="p-8 md:p-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-16">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-black dark:bg-white rounded-full">
            <Info size={24} className="text-white dark:text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">
              Quick Explanation
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {concept.description} This concept is part of a larger lesson in
              the <strong>{course.title}</strong> course. Understanding this
              allows you to communicate more naturally and avoid common
              pitfalls.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-100 dark:border-zinc-700">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={18} /> When to use
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Perfect for formal situations, strangers, and professional
              environments.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-100 dark:border-zinc-700">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-zinc-400">
              <Info size={18} /> Pro Tip
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Always combine with a slight bow for maximum cultural impact.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold mb-6">
            Dive deeper in the full lesson
          </h3>
          <Link
            to={`/lessons/${course.slug}/${lesson.slug}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
          >
            {/* Fix: Access title through frontmatter */}
            Start Lesson: {lesson.frontmatter.title} <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
        <h3 className="text-2xl font-serif font-bold mb-8 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-6">
          {[
            {
              q: `What is the literal translation of "${concept.title}"?`,
              a: "The literal translation depends on context, but it usually signifies a polite acknowledgement or apology.",
            },
            {
              q: "Is this formal or informal?",
              a: "This concept is generally considered formal and safe to use in any social situation.",
            },
            {
              q: "Can I use this with friends?",
              a: "Yes, but there are shorter, more casual versions available which we cover in Week 2.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
            >
              <summary className="font-bold list-none flex items-center justify-between">
                {faq.q}
                <ChevronRight
                  size={18}
                  className="group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConceptView;
