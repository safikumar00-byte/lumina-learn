// Type declarations for raw markdown imports
declare module '*.md?raw' {
    const content: string;
    export default content;
}

declare module '/content/courses/**/*.md?raw' {
    const content: string;
    export default content;
}

declare module '/content/concepts/*.md?raw' {
    const content: string;
    export default content;
}
