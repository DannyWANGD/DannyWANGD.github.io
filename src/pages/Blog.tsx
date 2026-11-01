import { useState } from 'react';
import { Search } from 'lucide-react';
import BlogPostCard from '../components/BlogPostCard';
import posts from '../data/posts';
import type { PostMetadata } from '../utils/markdownPost';

type Filter = 'all' | PostMetadata['collection'];
export default function Blog() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const filtered = posts.filter(post => (filter === 'all' || post.collection === filter) && [post.title, post.excerpt, post.category, post.sourceName, ...post.tags].join(' ').toLowerCase().includes(normalized));
  const groups = [{ key: 'research', title: 'Research & Tutorials', subtitle: '研究与教程' }, { key: 'deep-reading', title: 'Deep Reading', subtitle: '深度阅读' }];
  return <><header className="page-intro writing-intro"><p className="eyebrow">The notebook</p><h1>Notes & ideas.</h1><p lang="zh-CN">研究中的推导与实践，以及值得反复阅读的思考。</p></header><section className="writing-tools" aria-label="Filter and search blog"><div className="filter-list" role="group" aria-label="Blog categories">{([{ key: 'all', name: 'All' }, { key: 'research', name: 'Research' }, { key: 'deep-reading', name: 'Deep reading' }] as const).map(item => <button type="button" key={item.key} aria-pressed={filter === item.key} className={filter === item.key ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(item.key)}>{item.name}<span>{posts.filter(post => item.key === 'all' || post.collection === item.key).length}</span></button>)}</div><label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">Search blog</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search notes…" /></label></section><p className="sr-only" role="status">{filtered.length} articles found</p>{filtered.length ? groups.map(group => { const items = filtered.filter(post => post.collection === group.key); return items.length > 0 && <section className="writing-section" key={group.key}><div className="section-heading"><h2>{group.title} <span lang="zh-CN">{group.subtitle}</span></h2></div><div className="writing-grid">{items.map(post => <BlogPostCard key={post.slug} post={post} />)}</div></section>; }) : <div className="empty-state"><h2>No matching notes</h2><p>Try another topic or clear your search.</p><button type="button" className="button-quiet" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</button></div>}</>;
}
