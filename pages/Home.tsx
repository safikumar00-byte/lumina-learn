import React from "react";
import { Link } from "react-router-dom";
import { COURSES } from "../lib/contentAdapter";
import { ArrowRight, BookOpen, Star, Clock } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            STRUCTURED LEARNING
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Learn complex topics through simple explanations and visuals.
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
            A minimalist learning platform designed for focus, clarity, and
            rapid comprehension. High-quality notes, structured courses, and
            AEO-ready insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/search"
              className="btn-accent w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Browse Courses <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 accent-link-white border border-blue-500/30 font-bold rounded-lg hover:bg-blue-500/10 transition-all text-lg"
            >
              About Philosophy
            </Link>
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div className="w-full h-full grid grid-cols-12 grid-rows-12 gap-1 px-4">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-black dark:border-white"
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl text-left">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Structured Courses
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Step-by-step curriculum built by experts to take you from beginner
              to advanced level.
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm font-bold flex items-center gap-2 hover:underline"
          >
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="group flex flex-col accent-card bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={
                    course.thumbnail ||
                    `https://picsum.photos/seed/${course.id}/800/450`
                  }
                  alt={course.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
                  {course.id === "japanese-culture" ? "Featured" : "Popular"}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold font-serif mb-2 group-hover:underline group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-6 flex-1">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} /> 8 Weeks
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> Self-Paced
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold accent-link">
                    Learn <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO/AEO Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-24 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-12">
            Popular Learning Concepts
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Sumimasen meaning", slug: "excuse-me-in-japanese" },
              { label: "Blockchain simplified", slug: "blockchain-simplified" },
              { label: "Japanese writing systems", slug: "writing-systems" },
              { label: "What is Psychology", slug: "what-is-psychology" },
            ].map((item) => (
              <Link
                key={item.label}
                to={`/search`} // Simplified for mock, normally goes to concept or search results
                className="px-6 py-3 accent-card bg-white dark:bg-zinc-800 rounded-full text-sm font-medium shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
