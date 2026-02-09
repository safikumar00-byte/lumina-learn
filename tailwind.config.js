import typography from "@tailwindcss/typography";

export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./{components,pages}/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [typography],
  safelist: [
    { pattern: /prose-.*/ },
    { pattern: /^(hidden|flex)/ },
    { pattern: /^md:/ },
    { pattern: /^lg:/ },
  ],
  corePlugins: {
    preflight: true,
  },
};
