import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdownPost } from '../src/utils/post-content.mjs';
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
  const raw = `---\ntitle: "Sample"\n---\n# Sample\n\n> [!note] 说明\n\n==高亮==\n\n![[figure.png|800]]\n\n$$x^2$$\n\n${code}\n\n\`==code==\``;
  const parsed = parseMarkdownPost(raw, 'sample');
  assert.ok(parsed.content.includes('> **说明**'));
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
