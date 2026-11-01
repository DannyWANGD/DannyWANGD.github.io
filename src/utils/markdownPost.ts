import { parseMarkdownPost as parse } from './post-content.mjs';

export interface PostMetadata {
  title: string;
  date: string;
  updated: string;
  category: string;
  collection: 'research' | 'deep-reading';
  description: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  tags: string[];
  draft: boolean;
  archived: boolean;
}
export interface ParsedMarkdownPost { metadata: PostMetadata; content: string; excerpt: string; readTime: number; }
export interface PostSummary extends Omit<PostMetadata, 'draft' | 'archived'> { slug: string; excerpt: string; readTime: number; }
export const parseMarkdownPost: (raw: string, slug: string) => ParsedMarkdownPost = parse;
