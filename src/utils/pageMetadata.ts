import profile from '../data/profile.json';
import site from '../data/site.json';
import posts from '../data/posts';
import life from '../data/life.json';

export interface PageMetadata { title: string; description: string; url: string; image: string; type: string; noindex?: boolean; language: string; date?: string; updated?: string; }
export function getPageMetadata(pathname: string): PageMetadata {
  let path = pathname.replace(/\/$/, '') || '/';
  try { path = decodeURIComponent(path); } catch { /* Invalid URL: use the 404 metadata. */ }
  const defaults = { url: new URL(path === '/' ? '/' : `${path}/`, site.url).href, image: new URL(site.image, site.url).href, type: 'website', language: site.language };
  if (path === '/') return { ...defaults, title: `${profile.name} · Robotics & Machine Learning`, description: site.description };
  if (path === '/publications') return { ...defaults, title: `Research & Projects · ${profile.name}`, description: 'Open-source projects and research explorations in robotics and machine learning.' };
  if (path === '/blog') return { ...defaults, title: `Blog · ${profile.name}`, description: 'Research notes, practical tutorials, and deep reading on robotics, machine learning, and ideas worth keeping.' };
  const post = posts.find(post => path === `/blog/${post.slug}`);
  if (post) return { ...defaults, title: `${post.title} · ${profile.name}`, description: post.description || post.excerpt, type: 'article', language: 'zh-CN', date: post.date, updated: post.updated };
  if (path === '/life') return { ...defaults, title: `Life · ${profile.name}`, description: 'Photographs and observations along the way.', noindex: !life.length };
  const entry = (life as { id: string; title: string; description: string }[]).find(item => path === `/life/${item.id}`);
  if (entry) return { ...defaults, title: `${entry.title} · ${profile.name}`, description: entry.description };
  return { ...defaults, title: `Page not found · ${profile.name}`, description: 'This page could not be found. Return home or browse the notebook.', noindex: true };
}

export function applyPageMetadata(meta: PageMetadata) {
  document.title = meta.title;
  document.documentElement.lang = meta.language;
  const set = (name: string, content: string, property = false) => {
    const attribute = property ? 'property' : 'name';
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element); }
    element.content = content;
  };
  set('description', meta.description); set('robots', meta.noindex ? 'noindex, follow' : 'index, follow');
  for (const [key, value] of Object.entries({ title: meta.title, description: meta.description, url: meta.url, image: meta.image, type: meta.type })) set(`og:${key}`, value, true);
  set('twitter:card', 'summary_large_image'); set('twitter:title', meta.title); set('twitter:description', meta.description); set('twitter:image', meta.image);
  for (const [key, value] of Object.entries({ published_time: meta.date, modified_time: meta.updated })) {
    document.head.querySelector(`meta[property="article:${key}"]`)?.remove();
    if (value) set(`article:${key}`, value, true);
  }
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = meta.url;
}
