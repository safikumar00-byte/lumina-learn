import React, { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { LESSONS, COURSES, BLOGS } from "../lib/contentAdapter";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  ChevronRight,
  Bookmark,
  Share2,
  Calendar,
  Tag,
  BookOpen,
} from "lucide-react";
import CommentsSection from "../components/CommentsSection";
import RecommendationSection from "../components/RecommendationSection";
import BlogRecommendationSection from "../components/BlogRecommendationSection";
import ValidationWarning from "../components/ValidationWarning";
import LuminaMarkdown from "../components/LuminaMarkdown";
import QuickLinks from "../components/QuickLinks";
import { extractHeadings } from "../lib/headingExtractor";

const LessonView: React.FC = () => {
  const { courseSlug, lessonSlug } = useParams<{
    courseSlug: string;
    lessonSlug: string;
  }>();
  const location = useLocation();

  const isBlogContext = location.pathname.startsWith("/blog/");

  // Search in BLOGS if blog context, otherwise search in LESSONS
  const blog = isBlogContext ? BLOGS.find((b) => b.slug === lessonSlug) : null;
  const lesson = !isBlogContext
    ? LESSONS.find((l) => l.slug === lessonSlug && l.courseSlug === courseSlug)
    : null;
  // Debug: list available lessons and params
  // eslint-disable-next-line no-console
  console.log("[LessonView] route params:", { courseSlug, lessonSlug });
  // eslint-disable-next-line no-console
  console.log(
    "[LessonView] LESSONS:",
    LESSONS.map((l) => `${l.courseSlug}/${l.slug}`),
  );
  const course = !isBlogContext
    ? COURSES.find((c) => c.slug === courseSlug)
    : null;

  console.log("lesson", course);

  const prevLesson = lesson && LESSONS.find((l) => l.id === lesson?.prevId);
  const nextLesson = lesson && LESSONS.find((l) => l.id === lesson?.nextId);

  // console.log("[LessonView] prevLesson:", prevLesson);
  // console.log("[LessonView] nextLesson:", nextLesson);
  // console.log("[LessonView] course:", course);

  useEffect(() => {
    const data = blog || lesson?.frontmatter;
    if (!data) return;

    const title = blog ? blog.title : lesson.frontmatter.title;
    const description = blog
      ? blog.description
      : lesson.frontmatter.description;
    const canonical = blog
      ? location.pathname
      : lesson.frontmatter.canonical || location.pathname;

    document.title = `${title} - Lumina Learn`;

    // Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // Keywords
    const keywords =
      blog?.keywords?.join(", ") || lesson?.frontmatter.keywords?.join(", ");

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // Canonical
    const canonicalUrl = `https://luminalearn.com${canonical}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute("href", canonicalUrl);

    window.scrollTo(0, 0);
  }, [blog, lesson, location.pathname]);

  const urlSearch = new URLSearchParams(location.search);
  const debugMode = urlSearch.get("debug") === "1";

  if (!blog && !lesson) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {isBlogContext ? "Blog not found" : "Lesson not found"}
        </h2>
        <Link to="/" className="text-zinc-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-zinc-950">
      {!isBlogContext && (
        <aside className="hidden lg:block w-72 border-r border-zinc-200 dark:border-zinc-800 p-8 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <Link
            to={`/courses/${course.slug}`}
            className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />{" "}
            <span className="text-sm font-bold uppercase tracking-widest">
              Back to Course
            </span>
          </Link>
          <div className="space-y-8">
            {/* Course lessons */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Course Navigation
              </h4>
              {course.weeks.map((week) => (
                <div key={week.week}>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Week {week.week}
                  </h5>
                  <ul className="space-y-3 mb-4">
                    {week.lessons.map((l) => (
                      <li key={l.id}>
                        <Link
                          to={`/lessons/${course.slug}/${l.slug}`}
                          className={`text-sm block transition-all hover:translate-x-1 ${l.slug === lessonSlug ? "text-blue-400 font-medium border-l-2 border-blue-500 bg-blue-500/10 pl-3 rounded-sm" : "text-zinc-500 hover:text-blue-400 pl-3"}`}
                        >
                          {l.frontmatter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      <article className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={12} />
          {isBlogContext ? (
            <Link to="/blog" className="hover:text-blue-400 transition-colors">
              Blog
            </Link>
          ) : (
            <>
              <Link
                to={`/courses/${course.slug}`}
                className="hover:text-blue-400 transition-colors"
              >
                {course.slug}
              </Link>
              <ChevronRight size={12} />
              <span className="text-black dark:text-white">
                Week {lesson.week}
              </span>
            </>
          )}
        </nav>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold tracking-widest rounded text-zinc-500 uppercase">
              {isBlogContext
                ? "Blog Entry"
                : `Week ${lesson.week} • Video ${lesson.videoNumber}`}
            </span>
            {isBlogContext && blog && (
              <span className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold tracking-widest rounded uppercase">
                Blog
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-4xl font-serif font-bold tracking-tight mb-6 leading-tight">
            {blog ? blog.title : lesson?.frontmatter.title}
          </h1>
          <p className="text-xl text-zinc-500 font-medium leading-relaxed mb-8">
            {blog ? blog.description : lesson?.frontmatter.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-zinc-100 dark:border-zinc-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <img
                  src="https://picsum.photos/seed/author/100"
                  className="object-cover w-full h-full"
                  alt="Author"
                />
              </div>
              <div>
                <span className="block text-sm font-bold">Lumina Staff</span>
                <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest">
                  <Calendar size={12} />
                  <span>
                    {blog
                      ? blog.publishDate || "Oct 12, 2023"
                      : lesson?.frontmatter.publishDate || "Oct 12, 2023"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-blue-500/10 rounded-full transition-colors text-zinc-600 hover:text-blue-400"
                title="Bookmark"
              >
                <Bookmark size={20} />
              </button>
              <button
                className="p-2 hover:bg-blue-500/10 rounded-full transition-colors text-zinc-600 hover:text-blue-400"
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </header>
        {/* Display validation warnings only for lessons */}
        {/* {lesson && <ValidationWarning lesson={lesson} isDev={true} />} */}

        {/* Use the LuminaMarkdown renderer instead of raw marked */}
        <LuminaMarkdown content={blog ? blog.markdown : lesson!.markdown} />

        {debugMode && (
          <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
            <h4 className="font-bold mb-2">Debug — Available Lessons</h4>
            <pre className="text-xs max-h-40 overflow-auto">
              {JSON.stringify(
                LESSONS.map((l) => ({ course: l.courseSlug, slug: l.slug })),
                null,
                2,
              )}
            </pre>
          </div>
        )}

        {isBlogContext && (blog?.keywords || lesson?.frontmatter.keywords) && (
          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
            <Tag size={16} className="text-zinc-400" />
            <div className="flex flex-wrap gap-2">
              {(blog?.keywords || lesson?.frontmatter.keywords || []).map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-xs font-bold text-zinc-500 uppercase"
                  >
                    #{tag}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {!isBlogContext && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-800">
            {prevLesson ? (
              <Link
                to={`/lessons/${course.slug}/${prevLesson.slug}`}
                className="flex flex-col p-6 bg-zinc-50 dark:bg-zinc-900 hover:bg-blue-500/5 hover:border-blue-500/50 transition-all rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <span className="text-xs text-zinc-500 font-bold mb-2 flex items-center gap-1 uppercase tracking-widest">
                  <ArrowLeft size={12} /> Previous Lesson
                </span>
                <span className="font-bold font-serif group-hover:text-blue-400">
                  {prevLesson.frontmatter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                to={`/lessons/${course.slug}/${nextLesson.slug}`}
                className="flex flex-col p-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all rounded-xl text-right hover:translate-y-[-2px]"
              >
                <span className="text-xs opacity-70 font-bold mb-2 flex items-center gap-1 justify-end uppercase tracking-widest">
                  Next Lesson <ArrowRight size={12} />
                </span>
                <span className="font-bold font-serif">
                  {nextLesson.frontmatter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
        {!isBlogContext && lesson && <CommentsSection lessonId={lesson.id} />}
      </article>

      {isBlogContext && blog && (
        <aside className="hidden xl:block w-80 p-8 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <BlogRecommendationSection currentBlog={blog} />
        </aside>
      )}
      {isBlogContext && blog && (
        <div className="xl:hidden px-4 pb-20 max-w-4xl mx-auto w-full">
          <BlogRecommendationSection currentBlog={blog} />
        </div>
      )}
      {!isBlogContext && lesson && (
        <aside className="hidden xl:block w-80 p-8 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <div className="space-y-8">
            {/* Quick Links section */}
            <QuickLinks headings={extractHeadings(lesson.markdown)} />

            {/* Related Lessons section */}
            <div>
              <h3 className="text-xl font-bold font-serif border-b-2 border-blue-500 pb-2 mb-4 text-blue-400">
                Related Lessons
              </h3>
              <div className="grid gap-4">
                {course.weeks
                  .flatMap((week) => week.lessons)
                  .filter((l) => l.slug !== lessonSlug)
                  .slice(0, 2)
                  .map((l) => (
                    <Link
                      key={l.id}
                      to={`/lessons/${course.slug}/${l.slug}`}
                      className="group block p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all rounded-lg"
                    >
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block mb-2">
                        Week {l.week}
                      </span>
                      <span className="font-bold text-sm group-hover:text-blue-400 transition-colors">
                        {l.frontmatter.title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </aside>
      )}
      {!isBlogContext && lesson && (
        <div className="xl:hidden px-4 pb-20 max-w-4xl mx-auto w-full">
          <RecommendationSection
            currentLesson={lesson!}
            isBlog={isBlogContext}
          />
        </div>
      )}
    </div>
  );
};

export default LessonView;
