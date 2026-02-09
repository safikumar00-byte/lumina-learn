

export interface Frontmatter {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  thumbnail?: string;
  publishDate?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  courseSlug: string;
  week: number;
  videoNumber: number;
  slug: string;
  markdown: string; // SINGLE SOURCE OF TRUTH
  frontmatter: Frontmatter;
  prevId?: string;
  nextId?: string;
  validation?: {
    isValid: boolean;
    errors: Array<{ rule: string; message: string; severity: 'error' | 'warning' }>;
  };
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  markdown: string;
  publishDate?: string;
  keywords?: string[];
  thumbnail?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  weeks: {
    week: number;
    lessons: Lesson[];
  }[];
  startHereId: string;
}

export interface Concept {
  id: string;
  title: string;
  slug: string;
  description: string;
  linkedLessonId: string;
  courseId: string;
  tags: string[];
}

export interface Comment {
  id: string;
  lessonId: string;
  name: string;
  content: string;
  timestamp: string;
  likes: number;
}
