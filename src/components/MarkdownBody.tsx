import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import SiteImage from './SiteImage';

export default function MarkdownBody({ content }: { content: string }) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const regions = body.current?.querySelectorAll<HTMLElement>('pre, .table-scroll, .katex-display');
    if (!regions?.length) return;
    const update = () => {
      for (const region of regions) {
        const overflow = region.scrollWidth > region.clientWidth + 1;
        if (overflow) region.tabIndex = 0;
        else region.removeAttribute('tabindex');
      }
    };
    update();
    const observer = new ResizeObserver(update);
    for (const region of regions) observer.observe(region);
    document.fonts.addEventListener('loadingdone', update);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', update);
    };
  }, [content]);

  return <div className="article-body" ref={body}><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeKatex, { strict: false }], [rehypeHighlight, { detect: false }]]} components={{
    img: ({ src, alt, title, width, height }) => <SiteImage src={src} alt={alt} title={title} width={width} height={height} loading="lazy" />,
    a: ({ href, children, title }) => <a href={href} title={title} {...(/^https?:/.test(href || '') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>,
    table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
  }}>{content}</ReactMarkdown></div>;
}
