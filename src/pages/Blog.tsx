import { useState } from 'react';
import { BookOpen, FlaskConical, Search } from 'lucide-react';
import BlogPostCard from '../components/BlogPostCard';
import posts from '../data/posts';
import type { PostMetadata } from '../utils/markdownPost';
import useLanguage from '../hooks/useLanguage';
import { localizePost } from '../i18n/content';

type Filter = 'all' | PostMetadata['collection'];
export default function Blog() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const filtered = posts.filter(post => {
    const localized = localizePost(post, language);
    const english = localizePost(post, 'en');
    const searchable = [post, localized, english].flatMap(item => [item.title, item.excerpt, item.category, item.sourceName, ...item.tags]).join(' ').toLowerCase();
    return (filter === 'all' || post.collection === filter) && searchable.includes(normalized);
  });
  const groups = [
    { key: 'research', title: t.blog.researchTitle, Icon: FlaskConical },
    { key: 'deep-reading', title: t.blog.deepTitle, Icon: BookOpen },
  ] as const;
  const filters = [{ key: 'all', name: t.blog.all }, { key: 'research', name: t.blog.research }, { key: 'deep-reading', name: t.blog.deep }] as const;

  return <div className="blog-index">
    <div className="writing-masthead">
      <header className="writing-intro">
        <div className="writing-intro-copy">
          <p className="eyebrow">{t.blog.eyebrow}</p>
          <h1>{t.blog.title}</h1>
          <p className="writing-description">{t.blog.description}</p>
        </div>
      </header>
      <div className="writing-tools" role="group" aria-label={t.blog.tools}>
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
              <span>{posts.filter(post => item.key === 'all' || post.collection === item.key).length}</span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">{t.blog.search}</span>
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.blog.placeholder} />
        </label>
      </div>
    </div>
    <p className="sr-only" role="status">{filtered.length} {t.blog.found}</p>
    {filtered.length ? groups.map(({ key, title, Icon }) => {
      const items = filtered.filter(post => post.collection === key);
      return items.length > 0 && (
        <section className={`writing-section writing-section--${key}`} key={key} aria-labelledby={`writing-${key}`}>
          <div className="writing-section-heading">
            <span className="writing-section-icon"><Icon size={19} aria-hidden="true" /></span>
            <h2 id={`writing-${key}`}>{title}</h2>
          </div>
          <div className="writing-grid">
            {items.map(post => <BlogPostCard key={post.slug} post={post} />)}
          </div>
        </section>
      );
    }) : (
      <div className="empty-state writing-empty">
        <h2>{t.blog.noMatch}</h2>
        <p>{t.blog.trySearch}</p>
        <button type="button" className="button-quiet" onClick={() => { setQuery(''); setFilter('all'); }}>{t.blog.clear}</button>
      </div>
    )}
  </div>;
}
