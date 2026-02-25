import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import { formatDate } from '../utils/dateFormat';
import { ArrowLeft } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        // In Vite we need to handle dynamic imports carefully
        // Ideally we should have a map or utility, but here we try to match the slug
        const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
        const path = `../posts/${slug}.md`;
        const postContent = modules[path];

        if (postContent) {
           const frontmatterRegex = /---\n([\s\S]*?)\n---/;
           const match = postContent.match(frontmatterRegex);
           
           if (match) {
             const frontmatter = match[1];
             const lines = frontmatter.split('\n');
             const meta: any = {};
             
             lines.forEach(line => {
               const [key, ...valueParts] = line.split(':');
               if (key && valueParts.length) {
                 const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                 if (key.trim() === 'tags') {
                     // Simple parsing for tags
                     meta[key.trim()] = value.replace(/^\[|\]$/g, '').split(',').map((t: string) => t.trim().replace(/^["']|["']$/g, ''));
                 } else {
                     meta[key.trim()] = value;
                 }
               }
             });
             
             setMetadata(meta);
             setContent(postContent.replace(frontmatterRegex, ''));
           } else {
             setContent(postContent);
           }
        } else {
            setContent('# Post not found');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        setContent('# Error loading post');
      }
    };

    loadPost();
  }, [slug]);

  if (!content) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <Link to="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Blog
      </Link>
      
      {metadata && (
        <div className="mb-8 pb-8 border-b border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {metadata.title}
          </h1>
          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
            <time>{formatDate(metadata.date)}</time>
            {metadata.category && (
              <>
                <span>•</span>
                <span className="text-primary font-medium">{metadata.category}</span>
              </>
            )}
          </div>
          {metadata.tags && (
             <div className="flex gap-2 mt-4">
               {metadata.tags.map((tag: string) => (
                 <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">#{tag}</span>
               ))}
             </div>
          )}
        </div>
      )}

      <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-primary prose-a:text-primary hover:prose-a:text-blue-700">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default BlogPost;