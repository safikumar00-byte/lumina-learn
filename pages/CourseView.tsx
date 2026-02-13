import React from "react";
import { useParams, Link } from "react-router-dom";
import { COURSES } from "../lib/contentAdapter";
import {
  Play,
  ChevronRight,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
} from "lucide-react";

const CourseView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const course = COURSES.find((c) => c.slug === slug);

  if (!course) {
    return <div className="p-20 text-center">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Course Hero */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
              <Link to="/">Home</Link>
              <ChevronRight size={12} />
              <span>Courses</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {course.title}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl">
              {course.description} This comprehensive curriculum is designed to
              take you from a complete beginner to mastering core concepts
              through visual aids and simplified examples.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-10 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-zinc-500" />
                <span>8 weeks duration</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-zinc-500" />
                <span>24 total lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-zinc-500" />
                <span>Led by expert instructors</span>
              </div>
            </div>
            <Link
              to={`/lessons/${course.slug}/${course.weeks[0]?.lessons[0]?.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-80 transition-all shadow-lg"
            >
              <Play size={18} /> Start Learning Now
            </Link>
          </div>
          <div className="relative group">
            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden border-8 border-white dark:border-zinc-900 shadow-2xl">
              <img
                src={
                  course.thumbnail ||
                  `https://picsum.photos/seed/${course.id}/800/450`
                }
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-black ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section id="syllabus">
              <h2 className="text-3xl font-serif font-bold mb-8">
                Course Syllabus
              </h2>
              <div className="space-y-6">
                {course.weeks.map((weekData) => (
                  <div
                    key={weekData.week}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
                  >
                    <div className="bg-zinc-50 dark:bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                      <h3 className="font-bold flex items-center gap-2">
                        Week {weekData.week}: Foundations
                      </h3>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest">
                        {weekData.lessons.length} Lessons
                      </span>
                    </div>
                    <div className="p-0">
                      {weekData.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/lessons/${course.slug}/${lesson.slug}`}
                          className="group flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-b last:border-0 border-zinc-100 dark:border-zinc-800"
                        >
                          <div className="flex gap-4">
                            <span className="text-zinc-400 font-serif italic text-lg w-6">
                              {lesson.videoNumber}
                            </span>
                            <div>
                              {/* Fix: Access title and description through frontmatter */}
                              <h4 className="font-bold group-hover:underline">
                                {lesson.frontmatter.title}
                              </h4>
                              <p className="text-xs text-zinc-500 mt-1">
                                {lesson.frontmatter.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                {course.weeks.length === 0 && (
                  <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <p className="text-zinc-500">Coming soon. Stay tuned!</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-serif font-bold mb-8">
                What you will learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Master fundamental sentence structures.",
                  "Learn practical everyday vocabulary.",
                  "Understand cultural nuances and etiquette.",
                  "Apply learning to real-world scenarios.",
                  "Visual-first explanations of complex grammar.",
                  "Interactive community and support.",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-zinc-400 flex-shrink-0"
                    />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="sticky top-24">
              <div className="p-8 bg-black text-white dark:bg-white dark:text-black rounded-2xl shadow-xl">
                <h3 className="text-2xl font-serif font-bold mb-4">
                  Start Here
                </h3>
                <p className="text-sm opacity-80 mb-6">
                  Beginning your journey can be daunting. We've curated a
                  specific "Start Here" lesson to ground you in the basics.
                </p>
                <Link
                  to={`/lessons/${course.slug}/${course.weeks[0]?.lessons[0]?.slug}`}
                  className="block text-center py-3 bg-white text-black dark:bg-black dark:text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Jump to Introduction
                </Link>
              </div>

              <div className="mt-12 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <h4 className="font-bold mb-4">Instructor Note</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  "This course is designed for both casual learners and serious
                  students. We focus on clarity above all else. Welcome to
                  Lumina Learn."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  <div>
                    <span className="block font-bold text-sm">
                      Professor Lumina
                    </span>
                    <span className="block text-xs text-zinc-500">
                      Curriculum Director
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
