
import React from 'react';
import { Mail, Github, Twitter, Info } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold mb-6">Our Philosophy</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          We believe that learning shouldn't be complicated. Our mission is to take the most complex topics and break them down into their core components.
        </p>
      </header>

      <div className="space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">Clarity First</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Most educational platforms over-complicate things to sound "official". We do the opposite. We strip away the jargon and focus on what actually matters for understanding.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white dark:text-black text-[10px] font-bold">1</span>
                </div>
                <span className="text-sm font-medium">Simplified Visual Aids</span>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white dark:text-black text-[10px] font-bold">2</span>
                </div>
                <span className="text-sm font-medium">Plain Language Explanations</span>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white dark:text-black text-[10px] font-bold">3</span>
                </div>
                <span className="text-sm font-medium">AEO/SEO Optimized Content</span>
              </li>
            </ul>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-12 flex items-center justify-center">
             <Info size={120} className="text-black dark:text-white opacity-10" />
          </div>
        </section>

        <section className="p-12 bg-black text-white dark:bg-white dark:text-black rounded-3xl text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Join our Community</h2>
          <p className="mb-8 opacity-80 max-w-xl mx-auto">
            Stay updated with our newest courses and learning guides. We send out a weekly summary of the best learning resources on the web.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="flex items-center gap-2 font-bold hover:underline underline-offset-4"><Twitter size={20} /> Twitter</a>
            <a href="#" className="flex items-center gap-2 font-bold hover:underline underline-offset-4"><Github size={20} /> GitHub</a>
            <a href="#" className="flex items-center gap-2 font-bold hover:underline underline-offset-4"><Mail size={20} /> Newsletter</a>
          </div>
        </section>

        <section className="text-center py-12">
          <p className="text-zinc-500 italic text-sm">
            "Education is not the learning of facts, but the training of the mind to think." — Albert Einstein
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
