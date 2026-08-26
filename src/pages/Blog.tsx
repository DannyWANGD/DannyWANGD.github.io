import React, { useMemo, useState } from 'react';
import BlogPostCard, { BlogPost } from '../components/BlogPostCard';
import { parseMarkdownPost } from '../utils/markdownPost';
import { BookOpen, FlaskConical, Search, Sparkles } from 'lucide-react';

type FilterKey = 'all' | 'deep-reading' | 'research';

const Blog: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  const posts = useMemo(() => {
    const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

    const loadedPosts: BlogPost[] = Object.entries(modules).map(([path, content]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const { metadata, excerpt, readTime } = parseMarkdownPost(content, slug);

      return {
        slug,
        title: metadata.title,
        date: metadata.date,
        excerpt,
        tags: metadata.tags,
        category: metadata.category,
        collection: metadata.collection,
        sourceName: metadata.sourceName,
        sourceType: metadata.sourceType,
        readTime,
      };
    });

    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return loadedPosts;
  }, []);

  const deepReadingPosts = posts.filter((post) => post.collection === 'deep-reading');
  const researchPosts = posts.filter((post) => post.collection === 'research');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilter === 'all' || post.collection === activeFilter;
    const searchable = [post.title, post.excerpt, post.category, post.sourceName, ...post.tags].join(' ').toLowerCase();
    return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
  });

  const showGroupedSections = activeFilter === 'all' && !normalizedQuery;

  const filters: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: 'all', label: 'All writing', count: posts.length },
    { key: 'deep-reading', label: 'Deep Reading', count: deepReadingPosts.length },
    { key: 'research', label: 'Research & Tutorials', count: researchPosts.length },
  ];

  return (
    <div className="blog-index mx-auto max-w-6xl animate-in fade-in px-1 duration-500 md:px-4">
      <section className="blog-hero">
        <div className="relative z-10 max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
            <Sparkles size={14} /> Knowledge garden · 知识花园
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 md:text-6xl">
            Research notes, tutorials, and ideas worth keeping.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            记录机器人、具身智能与机器学习的研究过程，也把值得反复阅读的播客和长文，整理成可以长期回看的知识笔记。
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
            <span><strong className="mr-2 text-2xl font-semibold text-slate-900">{researchPosts.length}</strong>research notes</span>
            <span><strong className="mr-2 text-2xl font-semibold text-slate-900">{deepReadingPosts.length}</strong>deep readings</span>
          </div>
        </div>
        <div className="blog-hero-orbit" aria-hidden="true" />
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm backdrop-blur md:flex md:items-center md:justify-between md:gap-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${activeFilter === filter.key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              {filter.label}<span className={`ml-2 text-xs ${activeFilter === filter.key ? 'text-slate-300' : 'text-slate-400'}`}>{filter.count}</span>
            </button>
          ))}
        </div>
        <label className="mt-3 flex min-w-0 items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 md:mt-0 md:w-72">
          <Search size={16} className="shrink-0 text-slate-400" />
          <span className="sr-only">Search posts</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes and topics"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>
      </section>

      {showGroupedSections ? (
        <div className="mt-14 space-y-16">
          <section>
            <div className="mb-7 flex items-end justify-between gap-6 border-b border-slate-200 pb-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700"><BookOpen size={14} /> Curated notes</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Deep Reading <span className="font-normal text-slate-400">/ 深度阅读</span></h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">从播客与长文中提炼论点、证据和边界，而不是复述原文。</p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {deepReadingPosts.map((post) => <BlogPostCard key={post.slug} post={post} variant="featured" />)}
            </div>
          </section>

          <section>
            <div className="mb-7 border-b border-slate-200 pb-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700"><FlaskConical size={14} /> Built while learning</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Research & Tutorials <span className="font-normal text-slate-400">/ 研究与教程</span></h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">数学推导、工程实践，以及科研过程中真正解决过的问题。</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {researchPosts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
            </div>
          </section>
        </div>
      ) : (
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-semibold text-slate-950">{normalizedQuery ? `Search results for “${query.trim()}”` : filters.find((item) => item.key === activeFilter)?.label}</h2>
            <span className="text-sm text-slate-400">{filteredPosts.length} posts</span>
          </div>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredPosts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center text-slate-500">No posts match this search yet.</div>
          )}
        </section>
      )}
    </div>
  );
};

export default Blog;
