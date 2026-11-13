import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/dateFormat';
import type { ParsedMarkdownPost } from '../utils/markdownPost';
import TableOfContents from './TableOfContents';
import useLanguage from '../hooks/useLanguage';
import { translateTerm } from '../i18n/content';
import SiteImage from './SiteImage';

export default function Article({ post, children }: { post: ParsedMarkdownPost; children: ReactNode }) {
  const { language, t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const article = useRef<HTMLElement>(null);
  const { metadata, content, readTime } = post;
  useEffect(() => {
    const update = () => {
      if (!article.current) return;
      const { top, height } = article.current.getBoundingClientRect();
      const total = height - window.innerHeight + 90;
      setProgress(total > 0 ? Math.max(0, Math.min(100, (90 - top) / total * 100)) : 100);
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [content]);
  return <div className="article-page">
    <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <Link className="text-link article-back" to="/blog"><ArrowLeft size={16} aria-hidden="true" /> {t.common.allPosts}</Link>
    <article className="article" lang="zh-CN" ref={article}>
      <header className="article-header">
        <div className="article-heading">
          <p className="eyebrow" lang={language}>{metadata.collection === 'deep-reading' ? t.blog.deep : translateTerm(metadata.category, language) || t.blog.researchNote}</p>
          <h1>{metadata.title}</h1>
          {metadata.description && <p className="article-deck">{metadata.description}</p>}
          <div className="article-meta" lang={language}>
            {metadata.date && <time dateTime={metadata.date}>{formatDate(metadata.date, language)}</time>}
            {metadata.updated && metadata.updated !== metadata.date && <span>{t.blog.updated} <time dateTime={metadata.updated}>{formatDate(metadata.updated, language)}</time></span>}
            <span>{readTime} {t.blog.minutes}</span>
          </div>
          {metadata.sourceUrl && <a className="text-link article-source" lang={language} href={metadata.sourceUrl} target="_blank" rel="noreferrer">{t.blog.source} · {metadata.sourceName || t.blog.source} <ArrowUpRight size={14} aria-hidden="true" /></a>}
        </div>
        {metadata.cover && <SiteImage className="article-cover" src={metadata.cover} alt="" />}
      </header>
      <div className="article-layout">
        <TableOfContents content={content} />
        <div className="article-flow">
          {children}
          <footer className="article-footer">
            {metadata.tags.length > 0 && <ul>{metadata.tags.map(tag => <li key={tag}>#{tag}</li>)}</ul>}
            <Link className="text-link" lang={language} to="/blog"><ArrowLeft size={16} aria-hidden="true" /> {t.blog.continue}</Link>
          </footer>
        </div>
      </div>
    </article>
  </div>;
}
