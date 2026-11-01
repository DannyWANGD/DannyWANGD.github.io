import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/dateFormat';
import type { PostSummary } from '../utils/markdownPost';

export default function BlogPostCard({ post }: { post: PostSummary }) {
  return <article className="writing-item"><p className="eyebrow">{post.collection === 'deep-reading' ? (post.sourceName || 'Deep reading') : (post.category || 'Research note')}</p><h3><Link to={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={17} aria-hidden="true" /></Link></h3><p className="writing-excerpt">{post.excerpt}</p><div className="writing-meta">{post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}<span>{post.readTime} min read</span></div></article>;
}
