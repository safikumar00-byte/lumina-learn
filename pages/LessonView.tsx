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

  const prevLesson = lesson && LESSONS.find((l) => l.id === lesson?.prevId);
  const nextLesson = lesson && LESSONS.find((l) => l.id === lesson?.nextId);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} - Lumina Learn`;

      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", blog.description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = blog.description;
        document.head.appendChild(meta);
      }

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      const canonicalUrl = `https://luminalearn.com${location.pathname}`;
      if (canonicalLink) {
        canonicalLink.setAttribute("href", canonicalUrl);
      } else {
        const link = document.createElement("link");
        link.rel = "canonical";
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }
    } else if (lesson) {
      document.title = `${lesson.frontmatter.title} - Lumina Learn`;

      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", lesson.frontmatter.description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = lesson.frontmatter.description;
        document.head.appendChild(meta);
      }

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      const canonicalUrl = `https://luminalearn.com${lesson.frontmatter.canonical || location.pathname}`;
      if (canonicalLink) {
        canonicalLink.setAttribute("href", canonicalUrl);
      } else {
        const link = document.createElement("link");
        link.rel = "canonical";
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }
    }
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
            className="flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} />{" "}
            <span className="text-sm font-bold uppercase tracking-widest">
              Back to Course
            </span>
          </Link>
          <div className="space-y-8">
            {course.weeks.map((week) => (
              <div key={week.week}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Week {week.week}
                </h4>
                <ul className="space-y-3">
                  {week.lessons.map((l) => (
                    <li key={l.id}>
                      <Link
                        to={`/lessons/${course.slug}/${l.slug}`}
                        className={`text-sm block transition-all hover:translate-x-1 ${l.id === lesson.id ? "font-bold text-black dark:text-white border-l-2 border-black dark:border-white pl-3" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 pl-3"}`}
                      >
                        {l.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      )}

      <article className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="flex items-center gap-1">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={12} />
          {isBlogContext ? (
            <Link to="/blog">Blog</Link>
          ) : (
            <>
              <Link to={`/courses/${course.slug}`}>{course.title}</Link>
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight">
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
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                title="Bookmark"
              >
                <Bookmark size={20} />
              </button>
              <button
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 py-12 border-y border-zinc-200 dark:border-zinc-800">
            {prevLesson ? (
              <Link
                to={`/lessons/${course.slug}/${prevLesson.slug}`}
                className="flex flex-col p-6 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <span className="text-xs text-zinc-500 font-bold mb-2 flex items-center gap-1 uppercase tracking-widest">
                  <ArrowLeft size={12} /> Previous Lesson
                </span>
                <span className="font-bold font-serif">
                  {prevLesson.frontmatter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                to={`/lessons/${course.slug}/${nextLesson.slug}`}
                className="flex flex-col p-6 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity rounded-xl text-right"
              >
                <span className="text-xs opacity-60 font-bold mb-2 flex items-center gap-1 justify-end uppercase tracking-widest">
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
          <RecommendationSection
            currentLesson={lesson!}
            isBlog={isBlogContext}
          />
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
