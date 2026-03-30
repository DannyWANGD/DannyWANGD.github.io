import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import { formatDate } from '../utils/dateFormat';
import { ArrowLeft } from 'lucide-react';
import { parseMarkdownPost, type PostMetadata } from '../utils/markdownPost';
import TableOfContents from '../components/TableOfContents';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<PostMetadata | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
        const path = `../posts/${slug}.md`;
        const postContent = modules[path];

        if (postContent) {
          const parsedPost = parseMarkdownPost(postContent, slug ?? '');
          setMetadata(parsedPost.metadata);
          setContent(parsedPost.content);
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
    <div className="blog-post-page animate-in fade-in duration-500">
      {/* TOC sidebar */}
      <aside className="toc-sidebar">
        <TableOfContents content={content} />
      </aside>

      {/* Main content */}
      <div className="blog-post-main">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900">
          <ArrowLeft size={16} /> 返回博客
        </Link>

        {metadata && (
          <div className="obsidian-post-shell mb-8 border border-slate-200/80 px-6 py-8 shadow-sm md:px-10 md:py-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              {metadata.category || 'Technical Note'}
            </p>
            <h1 className="mb-4 text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
              {metadata.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {metadata.date && <time>{formatDate(metadata.date)}</time>}
              {metadata.category && metadata.date && (
                <>
                  <span>•</span>
                  <span>{metadata.category}</span>
                </>
              )}
            </div>
            {metadata.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {metadata.tags.map((tag: string) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <article className="obsidian-post-shell border border-slate-200/80 px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="obsidian-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
              rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSlug, rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
