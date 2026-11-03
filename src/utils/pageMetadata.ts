import profile from '../data/profile.json';
import site from '../data/site.json';
import posts from '../data/posts';
import life from '../data/life.json';
import { messages, type Language } from '../i18n/messages';
import { localize } from '../i18n/context';
import type { LifeEntry } from '../pages/Life';

export interface PageMetadata { title: string; description: string; url: string; image: string; type: string; noindex?: boolean; language: string; date?: string; updated?: string; }
export function getPageMetadata(pathname: string, language: Language = 'en'): PageMetadata {
  const t = messages[language];
  const name = language === 'en' ? profile.name : profile.chineseName;
  let path = pathname.replace(/\/$/, '') || '/';
  try { path = decodeURIComponent(path); } catch { /* Invalid URL: use the 404 metadata. */ }
  const defaults = { url: new URL(path === '/' ? '/' : `${path}/`, site.url).href, image: new URL(site.image, site.url).href, type: 'website', language };
  if (path === '/') return { ...defaults, title: t.metadata.homeTitle, description: t.metadata.home };
  if (path === '/publications') return { ...defaults, title: `${t.common.projects} · ${name}`, description: t.metadata.projects };
  if (path === '/blog') return { ...defaults, title: `${t.common.blog} · ${name}`, description: t.metadata.blog };
  const post = posts.find(post => path === `/blog/${post.slug}`);
  if (post) return { ...defaults, title: `${post.title} · ${name}`, description: post.description || post.excerpt, type: 'article', date: post.date, updated: post.updated };
  if (path === '/life') return { ...defaults, title: `${t.common.life} · ${name}`, description: t.life.description, noindex: !life.length };
  const source = (life as LifeEntry[]).find(item => path === `/life/${item.id}`);
  if (source) { const entry = localize(source, language); return { ...defaults, title: `${entry.title} · ${name}`, description: entry.description }; }
  return { ...defaults, title: `${t.notFound.title} · ${name}`, description: t.notFound.message, noindex: true };
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
  set('og:locale', meta.language === 'zh-CN' ? 'zh_CN' : 'en_US', true);
  set('twitter:card', 'summary_large_image'); set('twitter:title', meta.title); set('twitter:description', meta.description); set('twitter:image', meta.image);
  for (const [key, value] of Object.entries({ published_time: meta.date, modified_time: meta.updated })) {
    document.head.querySelector(`meta[property="article:${key}"]`)?.remove();
    if (value) set(`article:${key}`, value, true);
  }
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = meta.url;
}
