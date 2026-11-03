import { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';

interface Heading { id: string; text: string; level: number; }
export default function TableOfContents({ content }: { content: string }) {
  const { t } = useLanguage();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');
  const mobileDetails = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    // Read the actual rendered headings: IDs, punctuation and duplicates already
    // use the same rehype-slug output as the article, including inline HTML.
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.article-body h2[id], .article-body h3[id], .article-body h4[id]'));
    setHeadings(elements.map(element => ({ id: element.id, text: element.textContent || '', level: Number(element.tagName.slice(1)) })));
    const update = () => {
      const preceding = elements.filter(element => element.getBoundingClientRect().top <= 130);
      const current = preceding[preceding.length - 1] || elements[0];
      if (current) setActiveId(current.id);
    };
    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [content]);
  if (headings.length < 2) return null;
  const navigate = (id: string) => {
    if (mobileDetails.current) mobileDetails.current.open = false;
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(history.state, '', `${location.pathname}${location.search}#${encodeURIComponent(id)}`);
    setActiveId(id);
  };
  const items = <ol>{headings.map(heading => <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}><a href={`#${encodeURIComponent(heading.id)}`} aria-current={activeId === heading.id ? 'location' : undefined} onClick={event => { event.preventDefault(); navigate(heading.id); }}>{heading.text}</a></li>)}</ol>;
  return <><nav className="toc-desktop" aria-label={t.blog.articleContents}><p className="eyebrow">{t.blog.contents}</p>{items}</nav><details className="toc-mobile" ref={mobileDetails}><summary>{t.blog.contents}</summary><nav aria-label={t.blog.mobileContents}>{items}</nav></details></>;
}
