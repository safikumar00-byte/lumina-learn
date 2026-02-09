/**
 * Content Adapter: Temporary bridge between filesystem Markdown and component API
 * Loads Markdown files and exposes same interface as old mockData.ts
 */

import { Course, Lesson, Concept, Blog } from '../types';
import { validateMarkdown, formatValidationErrors, ValidationResult } from './markdownValidator';

// Dynamically import all markdown content under /content using Vite's glob
// This removes the need to add explicit imports when adding new files.
const rawModules = import.meta.glob('../content/**/*.md', { eager: true, as: 'raw' }) as Record<string, string>;

// Partition files by path pattern
const allContent: string[] = [];
const blogContent: string[] = [];
const courseIndexMap = new Map<string, string>();

for (const [path, content] of Object.entries(rawModules)) {
    // Normalize path to forward slashes
    const p = path.replaceAll('\\', '/');
    if (p.includes('/content/blogs/')) {
        blogContent.push(content);
    } else if (p.endsWith('/index.md') && p.includes('/content/courses/')) {
        // course index page
        // extract course slug from path: ../content/courses/<slug>/index.md
        const parts = p.split('/');
        const idx = parts.indexOf('courses');
        const slug = parts[idx + 1];
        courseIndexMap.set(slug, content);
        allContent.push(content);
    } else {
        // include lessons, concepts and other course pages
        allContent.push(content);
    }
}


// ============================================================================
// YAML Frontmatter Parser
// ============================================================================

function parseYamlArray(str: string): string[] {
    const lines = str.split('\n');
    const result: string[] = [];
    for (const line of lines) {
        const match = line.trim().match(/^-\s+(.+)$/);
        if (match) {
            result.push(match[1]);
        }
    }
    return result;
}

function parseFrontmatter(content: string): { fm: Record<string, any>; body: string } {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
        console.warn('[ContentAdapter] Invalid frontmatter');
        return { fm: {}, body: '' };
    }

    const frontmatterStr = match[1];
    const body = match[2];
    const fm: Record<string, any> = {};

    const lines = frontmatterStr.split('\n');
    let currentKey: string | null = null;
    let arrayBuffer = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) continue;

        if (line.startsWith('  ') && currentKey) {
            // Continuation of array or multi-line value
            arrayBuffer += '\n' + line;
        } else if (trimmed.includes(':')) {
            // Save previous array if any
            if (arrayBuffer && currentKey) {
                fm[currentKey] = parseYamlArray(arrayBuffer);
                arrayBuffer = '';
            }

            const [key, ...rest] = line.split(':');
            const keyName = key.trim();
            const value = rest.join(':').trim();

            if (value === '' && i + 1 < lines.length && lines[i + 1].startsWith('  -')) {
                // Start of array
                currentKey = keyName;
                arrayBuffer = '';
            } else if (value === 'null') {
                fm[keyName] = null;
            } else if (value === 'true') {
                fm[keyName] = true;
            } else if (value === 'false') {
                fm[keyName] = false;
            } else {
                // Trim and unquote scalar values (support quoted YAML values)
                let parsedValue = value;
                if (typeof parsedValue === 'string') {
                    parsedValue = parsedValue.trim();
                    if ((parsedValue.startsWith('"') && parsedValue.endsWith('"')) ||
                        (parsedValue.startsWith("'") && parsedValue.endsWith("'"))) {
                        parsedValue = parsedValue.substring(1, parsedValue.length - 1);
                    }
                }
                fm[keyName] = parsedValue;
                currentKey = null;
            }
        }
    }

    // Save final array if any
    if (arrayBuffer && currentKey) {
        fm[currentKey] = parseYamlArray(arrayBuffer);
    }

    return { fm, body };
}

// ============================================================================
// Data Processing
// ============================================================================

// (allContent and blogContent are populated dynamically above via import.meta.glob)

interface LessonData {
    slug: string;
    courseSlug: string;
    order: number;
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    thumbnail?: string;
    publishDate?: string;
    markdown: string;
    prev?: string | null;
    next?: string | null;
    week: number;
    videoNumber: number;
}

interface CourseData {
    slug: string;
    title: string;
    description: string;
    keywords?: string[];
    canonical: string;
    thumbnail?: string;
    startHereLesson: string;
}

interface ConceptData {
    slug: string;
    title: string;
    description: string;
    keywords?: string[];
    canonical: string;
    linkedLesson: string;
}

interface BlogData {
    slug: string;
    title: string;
    description: string;
    keywords?: string[];
    canonical: string;
    thumbnail?: string;
    publishDate?: string;
    markdown: string;
}


const lessonDataMap = new Map<string, LessonData>();
const courseDataMap = new Map<string, CourseData>();
const conceptDataMap = new Map<string, ConceptData>();
const blogDataMap = new Map<string, BlogData>();
const lessonValidationMap = new Map<string, ValidationResult>();

// Parse all content
for (const content of allContent) {
    const { fm, body } = parseFrontmatter(content);

    // Run Markdown Authoring Enforcement
    const validationResult = validateMarkdown(content, fm.slug || 'unknown');

    // Store validation result for lessons (will be attached to Lesson object later)
    if (fm.type === 'lesson') {
        lessonValidationMap.set(fm.slug, validationResult);

        // Log blocking errors to console in dev mode
        if (typeof window !== 'undefined' && validationResult.blockingErrors.length > 0) {
            console.error(formatValidationErrors(fm.slug, validationResult));
        }
    }

    if (fm.type === 'lesson') {
        const lessonData: LessonData = {
            slug: fm.slug,
            courseSlug: fm.courseSlug,
            order: fm.order || 0,
            title: fm.title,
            description: fm.description,
            keywords: fm.keywords || [],
            canonical: fm.canonical,
            thumbnail: fm.thumbnail,
            publishDate: fm.publishDate,
            markdown: body.trim(),
            prev: fm.prev || null,
            next: fm.next || null,
            week: fm.week || 1,
            videoNumber: fm.videoNumber || 0,
        };
        lessonDataMap.set(fm.slug, lessonData);
    } else if (fm.type === 'course') {
        const courseData: CourseData = {
            slug: fm.slug,
            title: fm.title,
            description: fm.description,
            keywords: fm.keywords,
            canonical: fm.canonical,
            thumbnail: fm.thumbnail,
            startHereLesson: fm.startHereLesson,
        };
        courseDataMap.set(fm.slug, courseData);
    } else if (fm.type === 'concept') {
        const conceptData: ConceptData = {
            slug: fm.slug,
            title: fm.title,
            description: fm.description,
            keywords: fm.keywords,
            canonical: fm.canonical,
            linkedLesson: fm.linkedLesson,
        };
        conceptDataMap.set(fm.slug, conceptData);
    }
}

// Parse all blogs (no validation, separate workflow)
for (const content of blogContent) {
    const { fm, body } = parseFrontmatter(content);

    if (fm.type === 'blog') {
        const blogData: BlogData = {
            slug: fm.slug,
            title: fm.title,
            description: fm.description,
            keywords: fm.keywords || [],
            canonical: fm.canonical,
            thumbnail: fm.thumbnail,
            publishDate: fm.publishDate,
            markdown: body.trim(),
        };
        blogDataMap.set(fm.slug, blogData);
    }
}

// ============================================================================
// Build Final Data Structures
// ============================================================================

// Convert to Lesson objects
const lessonsArray: Lesson[] = Array.from(lessonDataMap.values()).map((ld) => {
    const prevLesson = ld.prev ? lessonDataMap.get(ld.prev) : null;
    const nextLesson = ld.next ? lessonDataMap.get(ld.next) : null;

    return {
        id: `${ld.courseSlug}-${ld.slug}`,
        courseId: ld.courseSlug,
        courseSlug: ld.courseSlug,
        slug: ld.slug,
        week: ld.week,
        videoNumber: ld.videoNumber,
        markdown: ld.markdown,
        frontmatter: {
            title: ld.title,
            description: ld.description,
            keywords: ld.keywords,
            canonical: ld.canonical,
            thumbnail: ld.thumbnail,
            publishDate: ld.publishDate,
        },
        prevId: prevLesson ? `${ld.courseSlug}-${prevLesson.slug}` : undefined,
        nextId: nextLesson ? `${ld.courseSlug}-${nextLesson.slug}` : undefined,
        validation: lessonValidationMap.get(ld.slug) ? {
            isValid: lessonValidationMap.get(ld.slug)!.isValid,
            errors: lessonValidationMap.get(ld.slug)!.blockingErrors.map(e => ({
                rule: e.rule,
                message: e.message,
                severity: e.severity as 'error' | 'warning'
            }))
        } : undefined,
    };
});

// Convert to Course objects
const coursesArray: Course[] = Array.from(courseDataMap.values()).map((cd) => {
    // Get all lessons for this course and sort by order
    const courseLessons = lessonsArray
        .filter((l) => l.courseId === cd.slug)
        .sort((a, b) => {
            const aData = lessonDataMap.get(a.slug);
            const bData = lessonDataMap.get(b.slug);
            return (aData?.order || 0) - (bData?.order || 0);
        });

    // Group by week
    const weekMap = new Map<number, Lesson[]>();
    for (const lesson of courseLessons) {
        const week = lesson.week;
        if (!weekMap.has(week)) {
            weekMap.set(week, []);
        }
        weekMap.get(week)!.push(lesson);
    }

    const weeks = Array.from(weekMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([week, lessons]) => ({ week, lessons }));

    // Find start lesson
    const startLessonId = courseLessons.find((l) => l.slug === cd.startHereLesson)?.id || courseLessons[0]?.id || '';

    return {
        id: cd.slug,
        title: cd.title,
        slug: cd.slug,
        description: cd.description,
        thumbnail: cd.thumbnail || '',
        weeks,
        startHereId: startLessonId,
    };
});

// Convert to Concept objects
const conceptsArray: Concept[] = Array.from(conceptDataMap.values()).map((cd) => {
    const linkedLesson = lessonDataMap.get(cd.linkedLesson);
    const linkedLessonId = linkedLesson ? `${linkedLesson.courseSlug}-${linkedLesson.slug}` : '';

    return {
        id: cd.slug,
        title: cd.title,
        slug: cd.slug,
        description: cd.description,
        linkedLessonId,
        courseId: linkedLesson?.courseSlug || '',
        tags: cd.keywords || [],
    };
});

// Convert to Blog objects
const blogsArray: Blog[] = Array.from(blogDataMap.values()).map((bd) => {
    return {
        id: bd.slug,
        slug: bd.slug,
        title: bd.title,
        description: bd.description,
        markdown: bd.markdown,
        publishDate: bd.publishDate,
        keywords: bd.keywords,
        thumbnail: bd.thumbnail,
    };
});

// ============================================================================
// Export Public API
// ============================================================================

export const LESSONS = lessonsArray;
export const COURSES = coursesArray;
export const CONCEPTS = conceptsArray;
export const BLOGS = blogsArray;

// Validation logging
if (typeof window !== 'undefined') {
    console.log('[ContentAdapter] === VALIDATION LOG ===');
    console.log('[ContentAdapter] LESSONS.length:', LESSONS.length);
    console.log('[ContentAdapter] COURSES.length:', COURSES.length);
    console.log('[ContentAdapter] CONCEPTS.length:', CONCEPTS.length);
    console.log('[ContentAdapter] BLOGS.length:', BLOGS.length);
    console.log('[ContentAdapter] Course slugs:', COURSES.map(c => c.slug));
    console.log('[ContentAdapter] Lesson courseIds:', LESSONS.map(l => l.courseId));
    console.log('[ContentAdapter] Blog slugs:', BLOGS.map(b => b.slug));
    if (LESSONS.length > 0) {
        console.log('[ContentAdapter] Sample lesson:', LESSONS[0]);
    }
    if (COURSES.length > 0) {
        console.log('[ContentAdapter] Sample course:', COURSES[0]);
    }
    if (BLOGS.length > 0) {
        console.log('[ContentAdapter] Sample blog:', BLOGS[0]);
    }
    console.log('[ContentAdapter] === END VALIDATION ===');
}
