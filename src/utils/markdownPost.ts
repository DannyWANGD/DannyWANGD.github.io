export interface PostMetadata {
  title: string;
  date: string;
  category?: string;
  tags: string[];
}

export interface ParsedMarkdownPost {
  metadata: PostMetadata;
  content: string;
  excerpt: string;
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const HEADING_REGEX = /^\s{0,3}#{1,6}\s+(.+?)\s*$/m;

const parseTags = (value: string): string[] => {
  const normalized = value.trim();

  if (!normalized) {
    return [];
  }

  try {
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()).filter(Boolean) : [];
  } catch {
    return normalized
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
};

const toReadableTitle = (slug: string): string =>
  decodeURIComponent(slug)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractFirstHeading = (content: string): string => {
  const match = content.match(HEADING_REGEX);
  return match?.[1]?.replace(/[*_`#[\]]/g, '').trim() ?? '';
};

const stripMarkdown = (content: string): string =>
  content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]+\$/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/[>*_`~|-]/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeObsidianImages = (content: string): string =>
  content.replace(/!\[\[([^\]|]+?)(?:\|[^\]]*?)?\]\]/g, (_, filename: string) => {
    const name = filename.trim();
    return `![](/pictures/${name})`;
  });

const normalizeMathBlocks = (content: string): string =>
  content.replace(/\$\$([\s\S]+?)\$\$/g, (_, expression: string) => {
    const trimmed = expression.trim();

    if (!trimmed) {
      return '$$$$';
    }

    return `\n\n$$\n${trimmed}\n$$\n\n`;
  });

export const parseMarkdownPost = (raw: string, slug: string): ParsedMarkdownPost => {
  const frontmatterMatch = raw.match(FRONTMATTER_REGEX);
  const content = normalizeMathBlocks(normalizeObsidianImages(raw.replace(FRONTMATTER_REGEX, '').trim()));
  const metadata: PostMetadata = {
    title: '',
    date: '',
    category: '',
    tags: [],
  };

  if (frontmatterMatch) {
    frontmatterMatch[1]
      .split(/\r?\n/)
      .forEach((line) => {
        const separatorIndex = line.indexOf(':');

        if (separatorIndex === -1) {
          return;
        }

        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^["']|["']$/g, '');

        if (key === 'title') {
          metadata.title = value;
        }

        if (key === 'date') {
          metadata.date = value;
        }

        if (key === 'category') {
          metadata.category = value;
        }

        if (key === 'tags') {
          metadata.tags = parseTags(rawValue);
        }
      });
  }

  metadata.title = metadata.title || toReadableTitle(slug) || extractFirstHeading(content) || 'Untitled';

  const excerpt = stripMarkdown(content).slice(0, 180).trim();

  return {
    metadata,
    content,
    excerpt: excerpt ? `${excerpt}...` : '',
  };
};
