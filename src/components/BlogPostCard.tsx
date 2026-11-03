import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/dateFormat';
import type { PostSummary } from '../utils/markdownPost';
import useLanguage from '../hooks/useLanguage';
import { localizePost } from '../i18n/content';

export default function BlogPostCard({ post: source }: { post: PostSummary }) {
  const { language, t } = useLanguage();
  const post = localizePost(source, language);
  return <article className="writing-item"><p className="eyebrow">{post.collection === 'deep-reading' ? (post.sourceName || t.blog.deep) : (post.category || t.blog.researchNote)}</p><h3><Link to={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={17} aria-hidden="true" /></Link></h3><p className="writing-excerpt">{post.excerpt}</p><div className="writing-meta">{post.date && <time dateTime={post.date}>{formatDate(post.date, language)}</time>}<span>{post.readTime} {t.blog.minutes}</span></div></article>;
}
