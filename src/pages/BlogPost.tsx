import { useEffect, useState, type ComponentType } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import posts from '../data/posts';
import { parseMarkdownPost, type ParsedMarkdownPost } from '../utils/markdownPost';
import Article from '../components/Article';
import NotFound from './NotFound';
import loaders from '../data/post-loaders';
import useLanguage from '../hooks/useLanguage';

interface Loaded { slug: string; post: ParsedMarkdownPost; Renderer: ComponentType<{ content: string }>; }
export default function BlogPost() {
  const { t } = useLanguage();
  const { slug = '' } = useParams();
  const { hash } = useLocation();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState(false);
  const published = posts.some(post => post.slug === slug);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    if (!published) return;
    Promise.all([loaders[slug](), import('../components/MarkdownBody')]).then(([raw, renderer]) => {
      if (!cancelled) setLoaded({ slug, post: parseMarkdownPost(raw.default, slug), Renderer: renderer.default });
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [slug, published]);
  useEffect(() => {
    if (loaded?.slug !== slug || !hash) return;
    const frame = requestAnimationFrame(() => {
      try { document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(); } catch { /* Ignore malformed anchors. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [loaded, slug, hash]);
  if (!published) return <NotFound message={t.blog.unavailable} />;
  if (error) return <section className="empty-state"><h1>{t.blog.loadTitle}</h1><p>{t.blog.loadError}</p><button className="button-primary" onClick={() => window.location.reload()}>{t.blog.retry}</button></section>;
  if (loaded?.slug !== slug) return <p className="loading-state" role="status">{t.blog.opening}</p>;
  return <Article post={loaded.post}><loaded.Renderer content={loaded.post.content} /></Article>;
}
