import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateFormat';
import { ArrowUpRight, BookOpen, Clock3, FlaskConical, Headphones, Newspaper } from 'lucide-react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category?: string;
  collection: 'research' | 'deep-reading';
  sourceName?: string;
  sourceType?: string;
  readTime: number;
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'featured' | 'compact';
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, variant = 'compact' }) => {
  const isDeepReading = post.collection === 'deep-reading';
  const SourceIcon = post.sourceType === 'Podcast' ? Headphones : post.sourceType === 'Article' ? Newspaper : BookOpen;

  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className={`blog-card h-full ${isDeepReading ? 'blog-card-reading' : 'blog-card-research'} ${variant === 'featured' ? 'blog-card-featured' : ''}`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className={`inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${isDeepReading ? 'text-amber-700' : 'text-sky-700'}`}>
            {isDeepReading ? <SourceIcon size={14} /> : <FlaskConical size={14} />}
            {isDeepReading ? (post.sourceName || 'Deep Reading') : (post.category || 'Research Note')}
          </span>
          <ArrowUpRight size={17} className="text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-700" />
        </div>

        <div className="flex h-[calc(100%-2.5rem)] flex-col">
          <h3 className={`${variant === 'featured' ? 'text-[1.35rem]' : 'text-xl'} font-semibold leading-snug text-slate-950 transition-colors group-hover:text-sky-900`}>
            {post.title}
          </h3>
          <p className={`${variant === 'featured' ? 'line-clamp-4' : 'line-clamp-3'} mt-3 flex-1 text-sm leading-7 text-slate-600`}>{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/70 pt-4 text-xs text-slate-400">
            {post.date && <time>{formatDate(post.date)}</time>}
            <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{post.readTime} min read</span>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-slate-500">#{tag}</span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogPostCard;
