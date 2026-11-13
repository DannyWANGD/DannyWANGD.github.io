import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import BlogPostCard from '../components/BlogPostCard';
import posts from '../data/posts';
import type { PostMetadata } from '../utils/markdownPost';
import { normalizeSearchText } from '../utils/post-content.mjs';
import useLanguage from '../hooks/useLanguage';
import { localizePost } from '../i18n/content';

type Filter = 'all' | PostMetadata['collection'];

const searchEntries = posts.map(post => {
  const fields = (['en', 'zh-CN'] as const).flatMap(language => {
    const { title, excerpt, category, sourceName, sourceType, tags } = localizePost(post, language);
    return [title, excerpt, category, sourceName, sourceType, ...tags];
  });
  return { post, text: normalizeSearchText([post.slug, ...fields].join(' ')) };
});

export default function Blog() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [bodyIndex, setBodyIndex] = useState<Record<string, string> | 'unavailable' | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchStatus = useRef<HTMLParagraphElement>(null);
  const keywords = normalizeSearchText(query).split(' ').filter(Boolean);
  const searching = keywords.length > 0;
  const loadingIndex = searching && !bodyIndex;

  useEffect(() => {
    if (!loadingIndex) return;
    let cancelled = false;
    import('../data/post-search-index.json').then(({ default: index }) => {
      if (!cancelled) setBodyIndex(index);
    }).catch(() => {
      if (!cancelled) setBodyIndex('unavailable');
    });
    return () => { cancelled = true; };
  }, [loadingIndex]);

  const matches = searching ? searchEntries.filter(({ post, text }) => {
    const body = bodyIndex && bodyIndex !== 'unavailable' ? bodyIndex[post.slug] : '';
    return keywords.every(keyword => text.includes(keyword) || body?.includes(keyword));
  }).map(({ post }) => post) : posts;
  const filtered = filter === 'all' ? matches : matches.filter(post => post.collection === filter);
  const groups = [
    { key: 'research', title: t.blog.researchTitle },
    { key: 'deep-reading', title: t.blog.deepTitle },
  ] as const;
  const filters = [{ key: 'all', name: t.blog.all }, { key: 'research', name: t.blog.research }, { key: 'deep-reading', name: t.blog.deep }] as const;
  const resultCount = (filtered.length === 1 ? t.blog.oneResult : t.blog.results).replace('{count}', String(filtered.length));

  function clearSearch() {
    setQuery('');
    setFilter('all');
    searchInput.current?.focus();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searching) searchStatus.current?.focus();
    else searchInput.current?.focus();
  }

  return <div className="blog-index">
    <header className="writing-intro">
      <h1>{t.blog.title}</h1>
      <p className="writing-description">{t.blog.description}</p>
    </header>
    <div className="writing-tools">
      <div className="filter-list" role="group" aria-label={t.blog.categories}>
        {filters.map(item => (
          <button
            type="button"
            key={item.key}
            aria-pressed={filter === item.key}
            className="filter-button"
            onClick={() => setFilter(item.key)}
          >
            {item.name}
            <span>{matches.filter(post => item.key === 'all' || post.collection === item.key).length}</span>
          </button>
        ))}
      </div>
      <form className="writing-search" role="search" aria-label={t.blog.search} onSubmit={submitSearch}>
        <label htmlFor="writing-search-input" className="sr-only">{t.blog.search}</label>
        <input
          id="writing-search-input"
          ref={searchInput}
          type="search"
          value={query}
          onChange={event => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            if (!searching || !normalizeSearchText(nextQuery)) setFilter('all');
          }}
          onKeyDown={event => {
            if (event.key === 'Escape' && query && !event.nativeEvent.isComposing) {
              event.preventDefault();
              clearSearch();
            }
          }}
          placeholder={t.blog.placeholder}
          autoComplete="off"
        />
        {query && <button type="button" className="writing-search-clear" aria-label={t.blog.clearSearch} onClick={clearSearch}><X size={16} aria-hidden="true" /></button>}
        <button type="submit" className="writing-search-submit" aria-label={t.blog.search}><Search size={18} aria-hidden="true" /></button>
      </form>
    </div>
    <p ref={searchStatus} className={searching ? 'writing-search-status' : 'sr-only'} role="status" tabIndex={searching ? -1 : undefined}>
      {loadingIndex ? t.blog.searching : resultCount}
      {searching && bodyIndex === 'unavailable' && <span>{t.blog.limitedSearch}</span>}
    </p>
    {groups.map(({ key, title }) => {
      const items = filtered.filter(post => post.collection === key);
      return items.length > 0 && (
        <section className={`writing-section writing-section--${key}`} key={key} aria-labelledby={`writing-${key}`}>
          <h2 className="writing-section-heading" id={`writing-${key}`}>{title}</h2>
          <div className="writing-grid">
            {items.map(post => <BlogPostCard key={post.slug} post={post} showCover />)}
          </div>
        </section>
      );
    })}
    {!filtered.length && !loadingIndex && (
      <div className="empty-state writing-empty">
        <h2>{t.blog.noMatch}</h2>
        <p>{t.blog.trySearch}</p>
        <button type="button" className="button-quiet" onClick={clearSearch}>{t.blog.clear}</button>
      </div>
    )}
  </div>;
}
