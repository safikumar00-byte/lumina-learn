import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Book, ArrowRight, X } from "lucide-react";
import { LESSONS, COURSES } from "../lib/contentAdapter";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");

  const q = query.toLowerCase();

  const filteredLessons = LESSONS.filter((l) => {
    const title = (l.frontmatter && l.frontmatter.title) || "";
    const description = (l.frontmatter && l.frontmatter.description) || "";
    const keywords = (l.frontmatter && l.frontmatter.keywords) || [];
    return (
      title.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q) ||
      keywords.some((t: string) => (t || "").toLowerCase().includes(q))
    );
  });

  const filteredCourses = COURSES.filter((c) => {
    const title = c.title || "";
    const description = c.description || "";
    return (
      title.toLowerCase().includes(q) || description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto mb-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-6">
          What would you like to learn today?
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search lessons, courses, or concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-accent w-full px-14 py-5 bg-white dark:bg-zinc-900 border rounded-full outline-none text-lg transition-all shadow-sm"
          />
          <SearchIcon
            className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 accent-icon-hover"
            size={24}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-1 accent-icon-bg"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Japanese", "Grammar", "Psychology", "Blockchain", "Sumimasen"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 accent-card bg-zinc-100 dark:bg-zinc-800 text-xs font-bold rounded-full transition-colors"
              >
                {tag}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-widest text-[10px] text-zinc-400">
              Featured Courses
            </h3>
            <div className="space-y-4">
              {COURSES.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to={`/courses/${c.slug}`}
                  className="block group"
                >
                  <span className="text-sm font-bold accent-link group-hover:text-blue-400">
                    {c.title}
                  </span>
                  <span className="block text-[10px] text-zinc-500 uppercase mt-0.5">
                    8 Weeks Course
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h4 className="font-bold text-sm mb-2">Can't find something?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              We're constantly adding new courses. Reach out if there's a topic
              you'd like us to cover!
            </p>
            <Link
              to="/about"
              className="text-xs font-bold accent-link hover:text-blue-300"
            >
              Contact Us
            </Link>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <h2 className="text-2xl font-serif font-bold mb-8">
            {query ? `Search results for "${query}"` : "Recommended Lessons"}
          </h2>

          <div className="space-y-6">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => {
                const course = COURSES.find((c) => c.id === lesson.courseId);
                return (
                  <Link
                    key={lesson.id}
                    to={`/lessons/${(course && course.slug) || lesson.courseId}/${lesson.slug}`}
                    className="flex flex-col md:flex-row md:items-center gap-6 p-6 accent-card bg-white dark:bg-zinc-900 rounded-2xl transition-all group"
                  >
                    <div className="w-full md:w-32 aspect-video md:aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={`https://picsum.photos/seed/${lesson.id}/200`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          {course?.title}
                        </span>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Week {lesson.week}
                        </span>
                      </div>
                      {/* Fix: Access title and description through frontmatter */}
                      <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-blue-400 transition-colors">
                        {lesson.frontmatter.title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {lesson.frontmatter.description}
                      </p>
                    </div>
                    <ArrowRight className="hidden md:block text-zinc-300 group-hover:text-blue-400 translate-x-0 group-hover:translate-x-2 transition-all" />
                  </Link>
                );
              })
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <Book className="mx-auto text-zinc-300 mb-4" size={48} />
                <p className="text-zinc-500">
                  No results found. Try another search term!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
