import React from "react";
import { Link } from "react-router-dom";
import { Lesson, Course } from "../types";
import { LESSONS, COURSES } from "../lib/contentAdapter";
import { ChevronRight, Bookmark } from "lucide-react";

interface RecommendationSectionProps {
  currentLesson: Lesson;
  isBlog?: boolean;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  currentLesson,
  isBlog,
}) => {
  // Simple Recommendation Engine Mock
  const getRecommendations = () => {
    let recs: Lesson[] = [];

    // In blog context: show related articles via shared keywords + fallback
    if (isBlog) {
      // 1. Shared Keywords (using frontmatter.keywords)
      const sharedTags = LESSONS.filter(
        (l) =>
          l.id !== currentLesson.id &&
          l.frontmatter.keywords.some((tag) =>
            currentLesson.frontmatter.keywords.includes(tag),
          ),
      );
      recs.push(...sharedTags);

      // 2. Fallback to other lessons
      if (recs.length < 4) {
        const others = LESSONS.filter(
          (l) => l.id !== currentLesson.id && !recs.find((r) => r.id === l.id),
        );
        recs.push(...others);
      }
    } else {
      // In course context: ONLY show lessons from the same course
      // Do NOT pull from other courses. Preserve course context integrity.
      const sameCourse = LESSONS.filter(
        (l) =>
          l.courseId === currentLesson.courseId && l.id !== currentLesson.id,
      );
      recs.push(...sameCourse);
    }

    return recs.slice(0, 4);
  };

  const recommendations = getRecommendations();

  // For course context, show empty state if no other lessons in course
  if (!isBlog && recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-serif border-b-2 border-black dark:border-white pb-2 mb-4">
          Course Context
        </h3>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            This is the only lesson in this section.
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            Check the sidebar for the full course outline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-serif border-b-2 border-black dark:border-white pb-2 mb-4">
        {isBlog ? "Related Articles" : "Course Context"}
      </h3>
      <div className="grid gap-4">
        {recommendations.map((lesson) => {
          const course = COURSES.find((c) => c.id === lesson.courseId);
          const link = isBlog
            ? `/blog/${lesson.slug}`
            : `/lessons/${course?.slug}/${lesson.slug}`;

          return (
            <Link
              key={lesson.id}
              to={link}
              className="group block p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all rounded-lg"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  {isBlog ? "Read Next" : `Week ${lesson.week}`}
                </span>
                {isBlog && (
                  <Bookmark
                    size={12}
                    className="text-zinc-300 group-hover:text-black dark:group-hover:text-white"
                  />
                )}
              </div>
              {/* Fix: Access title through frontmatter */}
              <h4 className="font-bold text-sm group-hover:underline line-clamp-2 mb-1">
                {lesson.frontmatter.title}
              </h4>
              {/* Fix: Access description through frontmatter */}
              <p className="text-xs text-zinc-500 line-clamp-2">
                {lesson.frontmatter.description}
              </p>
              <div className="mt-2 flex items-center text-xs font-bold gap-1 text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {isBlog ? "Read Full Story" : "Jump to Lesson"}{" "}
                <ChevronRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>

      {isBlog && (
        <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
            Editor's Pick
          </h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            New to Lumina? Check out our "How to Learn" series for better
            retention.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;
