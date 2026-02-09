
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Search as SearchIcon, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import ConceptView from './pages/ConceptView';
import About from './pages/About';
import Search from './pages/Search';
import BlogListing from './pages/BlogListing';
import AdminEditor from './pages/AdminEditor';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md lg:hidden"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight">
              <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center rounded">
                <span className="text-white dark:text-black text-sm">LL</span>
              </div>
              <span className="hidden sm:inline">Lumina Learn</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="hover:text-zinc-500 transition-colors">Home</Link>
            <Link to="/search" className="hover:text-zinc-500 transition-colors">Courses</Link>
            <Link to="/blog" className="hover:text-zinc-500 transition-colors">Blogs</Link>
            <Link to="/admin" className="hover:text-zinc-500 transition-colors">Admin</Link>
            <Link to="/about" className="hover:text-zinc-500 transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/search" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
              <SearchIcon size={20} />
            </Link>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:slug" element={<CourseView />} />
          <Route path="/lessons/:courseSlug/:lessonSlug" element={<LessonView />} />
          <Route path="/blog/:lessonSlug" element={<LessonView />} />
          <Route path="/concepts/:slug" element={<ConceptView />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/admin" element={<AdminEditor />} />
        </Routes>
      </main>

      <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Lumina Learn. Simple explanations for complex topics.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/admin" className="hover:underline">Admin Panel</Link>
            <Link to="/search" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
