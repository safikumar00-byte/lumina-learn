/**
 * Heading Extraction Utilities
 * Extracts h2 headings from lesson markdown and generates slug IDs
 */

export interface Heading {
    id: string;
    text: string;
    level?: number;
}

/**
 * Convert heading text to URL-safe slug
 * Example: "What Is Dakuten?" -> "what-is-dakuten"
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Extract h2 headings from lesson markdown
 * Ignores h1 (lesson title) and h3+
 * Returns array of headings with generated IDs
 */
export function extractHeadings(markdown: string): Heading[] {
    const headings: Heading[] = [];

    // Match h2 headers: ## Text Here
    const h2Regex = /^## ([^\n]+)$/gm;
    let match;

    while ((match = h2Regex.exec(markdown)) !== null) {
        const text = match[1].trim();
        const id = generateSlug(text);

        headings.push({
            id,
            text,
            level: 2,
        });
    }

    return headings;
}

/**
 * Extract all headings (h2, h3, h4) from markdown
 * Useful for building nested TOCs (not used in current implementation)
 */
export function extractAllHeadings(markdown: string): Heading[] {
    const headings: Heading[] = [];

    // Match h2-h6 headers
    const headingRegex = /^(#{2,6}) ([^\n]+)$/gm;
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateSlug(text);

        headings.push({
            id,
            text,
            level,
        });
    }

    return headings;
}
