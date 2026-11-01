import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseMarkdownPost } from '../src/utils/post-content.mjs';

export async function loadPosts() {
  const names = (await readdir(resolve('src/posts'))).filter(name => name.endsWith('.md'));
  const posts = await Promise.all(names.map(async name => {
    const slug = name.slice(0, -3);
    const post = parseMarkdownPost(await readFile(resolve('src/posts', name), 'utf8'), slug);
    const { metadata } = post;
    if (!['research', 'deep-reading'].includes(metadata.collection)) throw new Error(`Invalid collection: ${name}`);
    for (const key of ['date', 'updated']) {
      if (metadata[key] && (!/^\d{4}-\d{2}-\d{2}$/.test(metadata[key]) || Number.isNaN(Date.parse(metadata[key])))) throw new Error(`Invalid ${key}: ${name}`);
    }
    return { slug, ...post };
  }));
  return posts.filter(post => !post.metadata.draft && !post.metadata.archived).sort((a, b) => b.metadata.date.localeCompare(a.metadata.date) || a.slug.localeCompare(b.slug));
}

export async function generateContentIndex() {
  const posts = await loadPosts();
  const data = posts.map(({ slug, metadata, excerpt, readTime }) => {
    const summary = { slug, ...metadata, excerpt, readTime };
    delete summary.draft;
    delete summary.archived;
    return summary;
  });
  const target = resolve('src/data/post-index.json');
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const previous = await readFile(target, 'utf8').catch(() => '');
  if (previous !== text) await writeFile(target, text);
  const loaders = `// Generated: published posts only.\nexport default {\n${posts.map(post => `  ${JSON.stringify(post.slug)}: () => import(${JSON.stringify(`../posts/${post.slug}.md?raw`)}),`).join('\n')}\n};\n`;
  const loaderPath = resolve('src/data/post-loaders.ts');
  if (await readFile(loaderPath, 'utf8').catch(() => '') !== loaders) await writeFile(loaderPath, loaders);
  return posts;
}
