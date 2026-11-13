import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

interface Heading { id: string; text: string; level: number; }
export default function TableOfContents({ content }: { content: string }) {
  const { language, t } = useLanguage();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');
  const mobileDetails = useRef<HTMLDetailsElement>(null);
  const desktopNav = useRef<HTMLElement>(null);
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
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [content]);

  useEffect(() => {
    const nav = desktopNav.current;
    const active = nav?.querySelector('a[aria-current]');
    if (!active || !nav.clientHeight) return;
    const bounds = nav.getBoundingClientRect();
    const visibleTop = nav.querySelector('.toc-heading')?.getBoundingClientRect().bottom ?? bounds.top;
    const link = active.getBoundingClientRect();
    if (link.top < visibleTop) nav.scrollTop += link.top - visibleTop;
    else if (link.bottom > bounds.bottom) nav.scrollTop += link.bottom - bounds.bottom;
  }, [activeId]);

  if (headings.length < 2) return null;
  const navigate = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (mobileDetails.current) mobileDetails.current.open = false;
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(history.state, '', `${location.pathname}${location.search}#${encodeURIComponent(id)}`);
    setActiveId(id);
  };
  const items = <ol lang="zh-CN">
    {headings.map(heading => (
      <li key={heading.id} data-level={heading.level}>
        <a href={`#${encodeURIComponent(heading.id)}`} aria-current={activeId === heading.id ? 'location' : undefined} onClick={event => { event.preventDefault(); navigate(heading.id); }}>{heading.text}</a>
      </li>
    ))}
  </ol>;
  return <div className="article-toc" lang={language}>
    <nav className="toc-desktop" aria-label={t.blog.articleContents} ref={desktopNav}>
      <p className="toc-heading">{t.blog.contents}</p>
      {items}
    </nav>
    <details className="toc-mobile" ref={mobileDetails}>
      <summary>{t.blog.contents}<ChevronDown size={17} aria-hidden="true" /></summary>
      <nav aria-label={t.blog.mobileContents}>{items}</nav>
    </details>
  </div>;
}
