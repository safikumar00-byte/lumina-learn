import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Heading } from "../lib/headingExtractor";

interface QuickLinksProps {
  headings: Heading[];
}

/**
 * Quick Links Navigation Component
 * Displays h2 headings from the lesson as internal navigation links
 * Includes smooth scrolling and active section highlighting using IntersectionObserver
 */
const QuickLinks: React.FC<QuickLinksProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Set up IntersectionObserver to track visible headings
  useEffect(() => {
    // Don't run observer if there are no headings
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        let topVisibleId: string | null = null;
        let topVisiblePosition = Infinity;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            if (rect.top < topVisiblePosition && rect.top >= 0) {
              topVisiblePosition = rect.top;
              topVisibleId = entry.target.id;
            }
          }
        });

        // Update active ID if we found a visible heading
        if (topVisibleId) {
          setActiveId(topVisibleId);
        }
      },
      {
        rootMargin: "-64px 0px -60% 0px", // Top nav offset + highlight top 40% of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  // Don't render if there are fewer than 2 headings
  if (headings.length < 2) {
    return null;
  }

  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 mb-8">
      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-4">
        <ChevronDown size={12} />
        Quick Links
      </h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                // Smooth scroll to heading
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  // Update URL hash without page jump
                  window.history.replaceState(null, "", `#${heading.id}`);
                }
              }}
              className={`text-sm block transition-colors cursor-pointer py-1 ${
                activeId === heading.id
                  ? "text-blue-400 font-medium border-l-2 border-blue-500 bg-blue-500/10 px-3 rounded-sm"
                  : "text-zinc-500 hover:text-blue-400 px-3"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
