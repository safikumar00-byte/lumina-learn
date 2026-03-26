import React from "react";
import { Link } from "react-router-dom";
import { Blog } from "../types";
import { BLOGS } from "../lib/contentAdapter";
import { ChevronRight, Bookmark, Clock, Calendar } from "lucide-react";

interface BlogRecommendationSectionProps {
  currentBlog: Blog;
}

const BlogRecommendationSection: React.FC<BlogRecommendationSectionProps> = ({
  currentBlog,
}) => {
  // Get related blogs by shared keywords
  const getRelatedBlogs = () => {
    const related = BLOGS.filter(
      (b) =>
        b.id !== currentBlog.id &&
        b.keywords &&
        currentBlog.keywords &&
        b.keywords.some((tag) => currentBlog.keywords!.includes(tag)),
    );
    return related.slice(0, 3);
  };

  // Get popular/other blogs as fallback
  const getPopularBlogs = () => {
    return BLOGS.filter((b) => b.id !== currentBlog.id).slice(0, 3);
  };

  const relatedBlogs = getRelatedBlogs();
  const popularBlogs = relatedBlogs.length > 0 ? [] : getPopularBlogs();

  return (
    <div className="space-y-8">
      {/* Related Articles Section */}
      {relatedBlogs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-serif border-b-2 border-blue-500 pb-2 text-blue-400">
            Related Articles
          </h3>
          <div className="grid gap-4">
            {relatedBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="group accent-card bg-white dark:bg-zinc-900 block p-4 rounded-lg transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                    Suggested Read
                  </span>
                  <Bookmark
                    size={14}
                    className="text-zinc-300 group-hover:text-blue-400 transition-colors"
                  />
                </div>
                <h4 className="font-bold text-sm group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {blog.title}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                  {blog.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
                  {blog.publishDate && (
                    <>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {blog.publishDate}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> 5 min read
                  </span>
                </div>
                <div className="flex items-center text-xs font-bold gap-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Full Story <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Articles Section */}
      {(popularBlogs.length > 0 || relatedBlogs.length === 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-serif border-b-2 border-blue-500 pb-2 text-blue-400">
            {relatedBlogs.length > 0 ? "More From Lumina" : "Popular Articles"}
          </h3>
          <div className="grid gap-4">
            {(relatedBlogs.length > 0 ? getPopularBlogs() : popularBlogs)
              .slice(0, 3)
              .map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="group accent-card accent-bg-hover bg-zinc-50 dark:bg-zinc-900/50 block p-4 rounded-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                      Popular
                    </span>
                  </div>
                  <h4 className="font-bold text-sm group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {blog.description}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Editor's Pick / Tip Section */}
      <div className="p-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-90">
          💡 Pro Tip
        </h4>
        <p className="text-sm leading-relaxed">
          Explore topics by keywords to discover more related articles and
          deepen your learning.
        </p>
      </div>
    </div>
  );
};

export default BlogRecommendationSection;
