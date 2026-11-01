import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/dateFormat';
import type { ParsedMarkdownPost } from '../utils/markdownPost';
import TableOfContents from './TableOfContents';

export default function Article({ post, children }: { post: ParsedMarkdownPost; children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const { metadata, content, readTime } = post;
  useEffect(() => {
    const update = () => {
      const article = document.querySelector('article.article');
      if (!article) return;
      const top = window.scrollY + article.getBoundingClientRect().top;
      const total = article.scrollHeight - window.innerHeight + 90;
      setProgress(total > 0 ? Math.max(0, Math.min(100, (window.scrollY - top + 90) / total * 100)) : 100);
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [content]);
  return <div className="article-page"><div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div><Link className="text-link back-link" to="/blog"><ArrowLeft size={16} /> All posts</Link><div className="article-layout"><article className="article" lang="zh-CN"><header className="article-header"><p className="eyebrow">{metadata.collection === 'deep-reading' ? 'Deep reading / 深度阅读' : metadata.category || 'Research note'}</p><h1>{metadata.title}</h1>{metadata.description && <p className="article-deck">{metadata.description}</p>}<div className="article-meta">{metadata.date && <time dateTime={metadata.date}>{formatDate(metadata.date)}</time>}{metadata.updated && metadata.updated !== metadata.date && <span>Updated <time dateTime={metadata.updated}>{formatDate(metadata.updated)}</time></span>}<span>{readTime} min read</span></div>{metadata.sourceUrl && <a className="text-link article-source" href={metadata.sourceUrl} target="_blank" rel="noreferrer">原始来源 · {metadata.sourceName || 'Source'} <ArrowUpRight size={14} /></a>}</header>{children}<footer className="article-footer"><p>{metadata.tags.map(tag => `#${tag}`).join('  ')}</p><Link className="text-link" to="/blog"><ArrowLeft size={16} /> Continue reading</Link></footer></article><aside className="article-toc"><TableOfContents content={content} /></aside></div></div>;
}
