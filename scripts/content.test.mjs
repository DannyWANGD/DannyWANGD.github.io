import test from 'node:test';
import assert from 'node:assert/strict';
import { open, readFile, readdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { normalizeSearchText, parseMarkdownPost } from '../src/utils/post-content.mjs';
import { loadPosts } from './content.mjs';

test('CRLF metadata, boolean flags, colon in title, CJK tags and unknown dates', () => {
  const raw = '---\r\ntitle: "笔记: A"\r\ncollection: "deep-reading"\r\ntags: ["中文", "Math"]\r\ndraft: true\r\ndate: ""\r\n---\r\n\r\n## 章节\r\n正文';
  const parsed = parseMarkdownPost(raw, 'sample');
  assert.equal(parsed.metadata.title, '笔记: A');
  assert.equal(parsed.metadata.draft, true);
  assert.equal(parsed.metadata.date, '');
  assert.equal(parsed.metadata.updated, '');
  assert.deepEqual(parsed.metadata.tags, ['中文', 'Math']);
  assert.ok(!parsed.content.includes('\r'));
});

test('Obsidian formatting is normalized while fenced and inline code stay literal', () => {
  const code = '```python\n# fake heading\nprint("==literal== $$x$$ ![[literal.png]]")\n```';
  const raw = `---\ntitle: "Sample"\n---\n# Sample\n\n> [!note] 说明\n> 注释正文\n\n==高亮==\n\n![[figure.png|800]]\n\n$$x^2$$\n\n${code}\n\n\`==code==\``;
  const parsed = parseMarkdownPost(raw, 'sample');
  assert.ok(parsed.content.includes('> **说明**\n>\n> 注释正文'));
  assert.ok(parsed.content.includes('<mark>高亮</mark>'));
  assert.ok(parsed.content.includes('/pictures/figure.png'));
  assert.ok(parsed.content.includes('$$\nx^2\n$$'));
  assert.ok(parsed.content.includes(code));
  assert.ok(parsed.content.includes('`==code==`'));
  assert.ok(!parsed.content.startsWith('# Sample'));
});

test('Public content has no archived Hello World and dates are never invented', async () => {
  const posts = await loadPosts();
  assert.ok(posts.length > 0);
  assert.ok(!posts.some(post => post.slug === 'hello-world'));
  assert.ok(posts.every(post => !post.metadata.draft && !post.metadata.archived));
  assert.equal(parseMarkdownPost('## No date supplied', 'undated').metadata.date, '');
});

test('Blog search normalizes mixed scripts and can index article text outside the excerpt', () => {
  const post = parseMarkdownPost('---\ndescription: "训练笔记"\n---\n## nn.HuberLoss\n用 PyTorch 对比 Huber 损失。', 'example');
  assert.equal(normalizeSearchText('ＰｙＴｏｒｃｈ—损失，L1损失'), 'pytorch 损失 l1 损失');
  assert.equal(post.excerpt, '训练笔记');
  assert.match(normalizeSearchText(post.plainText), /huberloss/);
});

test('Each engineering PDF has one project, a real cover, and valid source-page links', async () => {
  const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
  const reports = projects.filter(project => project.report);
  const files = (await readdir('public/pdf')).filter(file => file.toLowerCase().endsWith('.pdf'));
  const reportFiles = reports.map(project => project.report.file);
  assert.deepEqual([...reportFiles].sort(), files.map(file => `/pdf/${file}`).sort());
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  assert.equal(new Set(reports.map(project => project.slug)).size, reports.length);
  for (const project of reports) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(project.title && project.subtitle && project.description && project.imageAlt && project.imageCaption);
    assert.ok(Number.isInteger(project.report.pages) && project.report.pages > 0);
    for (const page of [project.report.startPage, project.report.figurePage]) {
      assert.ok(Number.isInteger(page) && page >= 1 && page <= project.report.pages);
    }
    assert.match(project.report.file, /^\/pdf\/.+\.pdf$/);
    const source = await open(resolve('public', project.report.file.slice(1)), 'r');
    try {
      const header = Buffer.alloc(5);
      await source.read(header, 0, 5, 0);
      assert.equal(header.toString(), '%PDF-');
    } finally { await source.close(); }
    await access(resolve('public', project.image.slice(1)));
  }
});

test('Both interface languages cover every project, award, and published blog summary', async () => {
  const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
  const awards = JSON.parse(await readFile('src/data/awards.json', 'utf8'));
  const summaries = JSON.parse(await readFile('src/data/post-translations.json', 'utf8'));
  for (const language of ['en', 'zh-CN']) {
    for (const project of projects) {
      const text = project.translations?.[language];
      assert.ok(text, `Missing ${language} project ${project.id}`);
      for (const field of ['title', 'description', 'imageAlt', ...(project.category ? ['category'] : []), ...(project.subtitle ? ['subtitle'] : []), ...(project.imageCaption ? ['imageCaption'] : [])]) {
        assert.ok(text[field]?.trim(), `Missing ${language} ${field} for project ${project.id}`);
        if (language === 'en') assert.doesNotMatch(text[field], /\p{Script=Han}/u);
      }
      assert.equal(text.tags.length, project.tags.length);
      if (project.links) assert.equal(text.linkLabels.length, project.links.length);
      // Translations must not change destinations, assets, report pages, or stable anchors.
      for (const field of ['id', 'slug', 'link', 'links', 'image', 'report']) assert.ok(!(field in text));
    }
    for (const award of awards) {
      assert.ok(award.translations?.[language]?.title?.trim());
      assert.ok(award.translations?.[language]?.description?.trim());
    }
  }
  for (const post of await loadPosts()) {
    assert.ok(summaries[post.slug]?.title?.trim(), `Missing English blog title: ${post.slug}`);
    assert.ok(summaries[post.slug]?.excerpt?.trim(), `Missing English blog summary: ${post.slug}`);
    if (post.metadata.cover) await access(resolve('public', post.metadata.cover.slice(1)));
  }
});
