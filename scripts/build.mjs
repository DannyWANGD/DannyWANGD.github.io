import { build, createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { generateContentIndex } from './content.mjs';

const posts = await generateContentIndex();
await build();
const template = await readFile('dist/index.html', 'utf8');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const styles = new Set();
const visited = new Set();
function collectStyles(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const chunk = manifest[key];
  for (const file of chunk?.css || []) styles.add(file);
  for (const imported of chunk?.imports || []) collectStyles(imported);
}
collectStyles('src/components/MarkdownBody.tsx');
const articleStyles = [...styles].map(file => `<link rel="stylesheet" href="/${file}" />`).join('\n');
const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));
const profile = JSON.parse(await readFile('src/data/profile.json', 'utf8'));
const life = JSON.parse(await readFile('src/data/life.json', 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, ssr: { noExternal: ['react-router-dom', 'react-router'], resolve: { conditions: ['module', 'import', 'development'] } } });
const routes = [{ path: '/' }, { path: '/publications' }, { path: '/blog' }, { path: '/life' }, ...posts.map(post => ({ path: `/blog/${post.slug}`, post })), ...life.map(entry => ({ path: `/life/${entry.id}` })), { path: '/404' }];
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx');
  for (const route of routes) {
    const { html, meta } = render(route.path, route.post);
    const tags = `<title>${escape(meta.title)}</title>\n<meta name="description" content="${escape(meta.description)}" />\n<link rel="canonical" href="${escape(meta.url)}" />\n<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow'}" />\n${Object.entries({ title: meta.title, description: meta.description, url: meta.url, image: meta.image, type: meta.type }).map(([key, value]) => `<meta property="og:${key}" content="${escape(value)}" />`).join('\n')}\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escape(meta.title)}" />\n<meta name="twitter:description" content="${escape(meta.description)}" />\n<meta name="twitter:image" content="${escape(meta.image)}" />\n${meta.date ? `<meta property="article:published_time" content="${meta.date}" />` : ''}\n${meta.updated ? `<meta property="article:modified_time" content="${meta.updated}" />` : ''}`;
    const output = template.replace(/<html lang="[^"]*">/, `<html lang="${meta.language}">`).replace(/<title>[\s\S]*?<\/title>/, tags).replace('</head>', `${route.post ? articleStyles : ''}\n</head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    const file = resolve('dist', route.path === '/404' ? '404.html' : route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, output);
  }
} finally { await server.close(); }
const canonical = path => new URL(path === '/' ? '/' : `${path}/`, site.url).href;
const publicRoutes = routes.filter(route => route.path !== '/404' && (route.path !== '/life' || life.length));
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(route => `<url><loc>${escape(canonical(route.path))}</loc>${route.post?.metadata.updated ? `<lastmod>${route.post.metadata.updated}</lastmod>` : ''}</url>`).join('')}</urlset>`);
await writeFile('dist/rss.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(profile.name)} — Blog</title><link>${escape(site.url)}/blog/</link><description>${escape(site.description)}</description><atom:link href="${escape(site.url)}/rss.xml" rel="self" type="application/rss+xml"/>${posts.map(post => `<item><title>${escape(post.metadata.title)}</title><link>${escape(canonical(`/blog/${post.slug}`))}</link><guid>${escape(canonical(`/blog/${post.slug}`))}</guid><description>${escape(post.excerpt)}</description>${post.metadata.date ? `<pubDate>${new Date(`${post.metadata.date}T00:00:00Z`).toUTCString()}</pubDate>` : ''}</item>`).join('')}</channel></rss>`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile('dist/.nojekyll', '');
console.log(`Prerendered ${routes.length} routes; generated sitemap.xml and rss.xml.`);
