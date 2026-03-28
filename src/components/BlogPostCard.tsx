import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateFormat';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <article className="rounded-2xl border border-slate-200/80 bg-white px-6 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700">
            {post.title}
          </h3>
          {post.date && (
            <time className="whitespace-nowrap text-xs uppercase tracking-[0.18em] text-slate-400">
              {formatDate(post.date)}
            </time>
          )}
        </div>
        
        <p className="mb-5 line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
};

export default BlogPostCard;
