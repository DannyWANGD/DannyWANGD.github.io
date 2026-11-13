// Shared by the browser, metadata index generator and static HTML build.
const frontmatter = /^---\n([\s\S]*?)\n---\n?/;

export function normalizeSearchText(value) {
  return value.normalize('NFKD').toLowerCase()
    .replace(/\p{M}/gu, '')
    .replace(/\p{Script=Han}(?=[a-z0-9])|[a-z0-9](?=\p{Script=Han})/gu, '$& ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  try { return JSON.parse(value); } catch { return value.replace(/^["']|["']$/g, ''); }
}

export function parseMarkdownPost(raw, slug) {
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const match = normalized.match(frontmatter);
  const metadata = { title: '', date: '', updated: '', description: '', cover: '', category: '', collection: 'research', tags: [], draft: false, archived: false, sourceName: '', sourceUrl: '', sourceType: '', language: undefined };
  for (const line of (match?.[1] || '').split('\n')) {
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    if (Object.hasOwn(metadata, key)) metadata[key] = parseValue(line.slice(separator + 1).trim());
  }
  metadata.title ||= decodeURIComponent(slug).replace(/[-_]+/g, ' ');
  metadata.updated ||= metadata.date;
  metadata.tags = Array.isArray(metadata.tags) ? metadata.tags : [];
  if (metadata.language !== 'en' && metadata.language !== 'zh-CN') metadata.language = undefined;
  let content = normalized.replace(frontmatter, '').trim();
  const titleLine = content.match(/^#\s+(.+)\n+/);
  if (titleLine?.[1].replace(/[*_`]/g, '').trim() === metadata.title) content = content.slice(titleLine[0].length);
  // Protect fenced and inline code from Obsidian / math transformations.
  const protectedCode = [];
  content = content.replace(/(^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\2[^\n]*$)|(`+)[^\n]*?\3/gm, text => {
    protectedCode.push(text);
    return `\uE000${protectedCode.length - 1}\uE001`;
  });
  const labels = { abstract: '核心判断', info: '信息', note: '补充说明', summary: '摘要', tip: '提示', warning: '注意' };
  content = content.replace(/^>\s*\[!(\w+)\][+-]?[^\S\n]*(.*)$/gm, (_, type, title) => `> **${title.trim() || labels[type.toLowerCase()] || type}**\n>`)
    .replace(/!\[\[([^\]|]+?)(?:\|[^\]]*?)?\]\]/g, (_, name) => `![研究笔记配图](/pictures/${encodeURIComponent(name.trim())})`)
    .replace(/==([^=\n]+?)==/g, '<mark>$1</mark>')
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => `\n\n$$\n${math.trim()}\n$$\n\n`);
  content = content.replace(/\uE000(\d+)\uE001/g, (_, index) => protectedCode[Number(index)]);
  const plain = content.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ').replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, ' ').replace(/!\[.*?\]\(.*?\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[#*_`>|~]/g, ' ').replace(/\s+/g, ' ').trim();
  const cjk = (plain.match(/[\u3400-\u9fff]/g) || []).length;
  const words = plain.replace(/[\u3400-\u9fff]/g, ' ').split(/\s+/).filter(Boolean).length;
  const excerpt = metadata.description || plain.slice(0, 160);
  return { metadata, content, plainText: plain, excerpt, readTime: Math.max(1, Math.ceil(cjk / 420 + words / 220)) };
}
