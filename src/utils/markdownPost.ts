export interface PostMetadata {
  title: string;
  date: string;
  category?: string;
  collection: 'research' | 'deep-reading';
  description?: string;
  sourceName?: string;
  sourceUrl?: string;
  sourceType?: string;
  tags: string[];
}

export interface ParsedMarkdownPost {
  metadata: PostMetadata;
  content: string;
  excerpt: string;
  readTime: number;
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
    .replace(/<[^>]+>/g, ' ')
    .replace(/==(.+?)==/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/[>*_`~|-]/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeObsidianCallouts = (content: string): string => {
  const labels: Record<string, string> = {
    abstract: '核心判断',
    info: '信息',
    note: '补充说明',
    summary: '摘要',
    tip: '提示',
    warning: '注意',
  };

  return content.replace(/^>\s*\[!(\w+)\][+-]?\s*(.*)$/gm, (_, type: string, title: string) => {
    const label = labels[type.toLowerCase()] || type;
    const normalizedTitle = title.trim();
    const displayTitle = normalizedTitle && normalizedTitle !== label ? `${label} · ${normalizedTitle}` : label;
    return `> **${displayTitle}**`;
  });
};

const normalizeObsidianHighlights = (content: string): string =>
  content.replace(/==([^=\n]+?)==/g, '<mark>$1</mark>');

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

const stripRedundantTitleHeading = (content: string, title: string): string => {
  const match = content.match(/^#\s+(.+)\r?\n+/);

  if (!match) {
    return content;
  }

  const heading = match[1].replace(/[*_`]/g, '').trim();
  if (heading.startsWith(title) || title.startsWith(heading)) {
    return content.slice(match[0].length).trim();
  }

  return content;
};

const estimateReadTime = (plainText: string): number => {
  const cjkCount = (plainText.match(/[\u3400-\u9fff]/g) || []).length;
  const latinWords = plainText
    .replace(/[\u3400-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(cjkCount / 420 + latinWords / 220));
};

export const parseMarkdownPost = (raw: string, slug: string): ParsedMarkdownPost => {
  const frontmatterMatch = raw.match(FRONTMATTER_REGEX);
  const metadata: PostMetadata = {
    title: '',
    date: '',
    category: '',
    collection: 'research',
    description: '',
    sourceName: '',
    sourceUrl: '',
    sourceType: '',
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

        if (key === 'collection' && value === 'deep-reading') {
          metadata.collection = 'deep-reading';
        }

        if (key === 'description') {
          metadata.description = value;
        }

        if (key === 'sourceName') {
          metadata.sourceName = value;
        }

        if (key === 'sourceUrl') {
          metadata.sourceUrl = value;
        }

        if (key === 'sourceType') {
          metadata.sourceType = value;
        }

        if (key === 'tags') {
          metadata.tags = parseTags(rawValue);
        }
      });
  }

  const normalizedContent = normalizeMathBlocks(
    normalizeObsidianHighlights(
      normalizeObsidianCallouts(
        normalizeObsidianImages(raw.replace(FRONTMATTER_REGEX, '').trim()),
      ),
    ),
  );

  metadata.title = metadata.title || toReadableTitle(slug) || extractFirstHeading(normalizedContent) || 'Untitled';
  const content = stripRedundantTitleHeading(normalizedContent, metadata.title);
  const plainText = stripMarkdown(content);

  const excerpt = (metadata.description || plainText.slice(0, 180)).trim();

  return {
    metadata,
    content,
    excerpt: excerpt ? `${excerpt}${excerpt.endsWith('。') || excerpt.endsWith('.') ? '' : '…'}` : '',
    readTime: estimateReadTime(plainText),
  };
};
