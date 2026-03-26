import React from "react";
import { Link } from "react-router-dom";
import { BLOGS } from "../lib/contentAdapter";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogListing: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <header className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
          The Learning Journal
        </h1>
        <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
          Deep dives into specific concepts, latest lesson updates, and
          educational insights presented in a flat, easy-to-browse format.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {BLOGS.map((blog) => (
            <article
              key={blog.id}
              className="group grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-16 last:border-0"
            >
              <div className="md:col-span-1">
                <Link to={`/blog/${blog.slug}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={
                        blog.thumbnail ||
                        `https://picsum.photos/seed/${blog.id}/400/300`
                      }
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      alt={blog.title}
                    />
                  </div>
                </Link>
              </div>
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <span className="text-black dark:text-white">Blog</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {blog.publishDate || "Oct 2023"}
                  </span>
                </div>
                <Link to={`/blog/${blog.slug}`}>
                  <h2 className="text-2xl font-serif font-bold group-hover:text-blue-400 transition-colors leading-tight">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed line-clamp-2">
                  {blog.description}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 font-bold text-sm accent-link group-hover:text-blue-400 transition-all hover:translate-x-1"
                  >
                    Read Full Story <ArrowRight size={16} />
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-zinc-400 ml-auto">
                    <Clock size={14} /> 8 min read
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-12">
          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">
              Stay in the loop
            </h3>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              Get the latest atomic lessons delivered to your inbox every
              Tuesday.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              className="input-accent w-full p-3 bg-white dark:bg-zinc-800 border rounded-xl mb-3 outline-none"
            />
            <button className="btn-accent w-full py-3 text-white rounded-xl">
              Join Newsletter
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogListing;
