import { useEffect, useState, type ComponentType } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import posts from '../data/posts';
import { parseMarkdownPost, type ParsedMarkdownPost } from '../utils/markdownPost';
import Article from '../components/Article';
import NotFound from './NotFound';
import loaders from '../data/post-loaders';

interface Loaded { slug: string; post: ParsedMarkdownPost; Renderer: ComponentType<{ content: string }>; }
export default function BlogPost() {
  const { slug = '' } = useParams();
  const { hash } = useLocation();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState('');
  const published = posts.some(post => post.slug === slug);
  useEffect(() => {
    let cancelled = false;
    setError('');
    if (!published) return;
    Promise.all([loaders[slug](), import('../components/MarkdownBody')]).then(([raw, renderer]) => {
      if (!cancelled) setLoaded({ slug, post: parseMarkdownPost(raw.default, slug), Renderer: renderer.default });
    }).catch(() => { if (!cancelled) setError('The article could not be loaded. Please try refreshing the page.'); });
    return () => { cancelled = true; };
  }, [slug, published]);
  useEffect(() => {
    if (loaded?.slug !== slug || !hash) return;
    const frame = requestAnimationFrame(() => {
      try { document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(); } catch { /* Ignore malformed anchors. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [loaded, slug, hash]);
  if (!published) return <NotFound message="This article is unavailable or has been archived." />;
  if (error) return <section className="empty-state"><h1>Unable to load this article</h1><p>{error}</p><button className="button-primary" onClick={() => window.location.reload()}>Try again</button></section>;
  if (loaded?.slug !== slug) return <p className="loading-state" role="status">Opening the notebook…</p>;
  return <Article post={loaded.post}><loaded.Renderer content={loaded.post.content} /></Article>;
}
