import React, { useEffect, useState, useRef } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  const idCount: Record<string, number> = {};

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      let id = slugify(text);
      if (idCount[id] !== undefined) {
        idCount[id]++;
        id = `${id}-${idCount[id]}`;
      } else {
        idCount[id] = 0;
      }
      headings.push({ id, text, level });
    }
  }
  return headings;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    setHeadings(extractHeadings(content));
  }, [content]);

  // Scroll active TOC item into view within the panel
  useEffect(() => {
    if (!activeId || !navRef.current || !activeLinkRef.current) return;
    const panel = navRef.current;
    const link = activeLinkRef.current;
    const panelTop = panel.scrollTop;
    const panelBottom = panelTop + panel.clientHeight;
    const linkTop = link.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;
    if (linkTop < panelTop + 32) {
      panel.scrollTo({ top: linkTop - 32, behavior: 'smooth' });
    } else if (linkBottom > panelBottom - 32) {
      panel.scrollTo({ top: linkBottom - panel.clientHeight + 32, behavior: 'smooth' });
    }
  }, [activeId]);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();

    const callback: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className="toc-panel" ref={navRef}>
      <p className="toc-title">目录</p>
      <ul className="toc-list">
        {headings.map((h) => {
          const indent = (h.level - minLevel) * 12;
          const isActive = activeId === h.id;
          return (
            <li key={h.id} style={{ paddingLeft: indent }}>
              <a
                href={`#${h.id}`}
                ref={isActive ? activeLinkRef : null}
                className={`toc-link${isActive ? ' toc-link-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveId(h.id);
                  }
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;
