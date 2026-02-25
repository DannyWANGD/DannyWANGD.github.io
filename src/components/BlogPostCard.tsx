import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateFormat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      <article className="p-6 rounded-lg border border-gray-100 bg-white transition-all hover:shadow-md hover:border-primary/20">
        <div className="flex justify-between items-baseline gap-4 mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <time className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(post.date)}
          </time>
        </div>
        
        <div className="text-sm text-gray-600 line-clamp-2 mb-4 prose prose-sm prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            // Override paragraph to avoid hydration errors or invalid nesting if needed
            p: ({node, ...props}) => <span {...props} />,
            // Disable other block elements that might break the layout
            h1: ({node, ...props}) => <strong {...props} />,
            h2: ({node, ...props}) => <strong {...props} />,
            h3: ({node, ...props}) => <strong {...props} />,
          }}>
            {post.excerpt}
          </ReactMarkdown>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-500 rounded border border-gray-100">
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
};

export default BlogPostCard;