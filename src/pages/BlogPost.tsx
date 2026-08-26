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
import { ArrowLeft, BookOpen, CalendarDays, Clock3, ExternalLink } from 'lucide-react';
import { parseMarkdownPost, type PostMetadata } from '../utils/markdownPost';
import TableOfContents from '../components/TableOfContents';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<PostMetadata | null>(null);
  const [readTime, setReadTime] = useState(1);
  const [readingProgress, setReadingProgress] = useState(0);

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
          setReadTime(parsedPost.readTime);
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

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [content]);

  if (!content) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="blog-post-page animate-in fade-in duration-500">
      <div className="blog-reading-progress" aria-hidden="true"><span style={{ width: `${readingProgress}%` }} /></div>

      <div className="blog-post-main">
        <Link to="/blog" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-950">
          <ArrowLeft size={16} /> All writing / 返回博客
        </Link>

        <article className="blog-article-shell">
          {metadata && (
            <header className="blog-article-header">
              <p className={`mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] ${metadata.collection === 'deep-reading' ? 'text-amber-700' : 'text-sky-700'}`}>
                <BookOpen size={14} /> {metadata.collection === 'deep-reading' ? 'Deep Reading · 深度阅读' : (metadata.category || 'Research Note')}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-[1.16] tracking-tight text-slate-950 md:text-5xl">{metadata.title}</h1>
              {metadata.description && <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{metadata.description}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
                {metadata.date && <time className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{formatDate(metadata.date)}</time>}
                <span className="inline-flex items-center gap-1.5"><Clock3 size={15} />{readTime} min read</span>
                {metadata.sourceUrl && (
                  <a href={metadata.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-sky-700 transition-colors hover:text-sky-900">
                    {metadata.sourceName ? `原始来源 · ${metadata.sourceName}` : '查看原始来源'} <ExternalLink size={14} />
                  </a>
                )}
              </div>
              {metadata.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {metadata.tags.map((tag: string) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">#{tag}</span>)}
                </div>
              )}
            </header>
          )}

          <div className="obsidian-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
              rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSlug, rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm">
          <Link to="/blog" className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-slate-950"><ArrowLeft size={15} />继续浏览其他文章</Link>
          {metadata?.sourceUrl && <a href={metadata.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sky-800">阅读原始内容 <ExternalLink size={14} /></a>}
        </div>
      </div>

      <aside className="toc-sidebar"><TableOfContents content={content} /></aside>
    </div>
  );
};

export default BlogPost;
