import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/dateFormat';
import type { PostSummary } from '../utils/markdownPost';
import useLanguage from '../hooks/useLanguage';
import { localizePost } from '../i18n/content';
import SiteImage from './SiteImage';

export default function BlogPostCard({ post: source, showCover = false }: { post: PostSummary; showCover?: boolean }) {
  const { language, t } = useLanguage();
  const post = localizePost(source, language);
  const category = post.collection === 'deep-reading' ? post.sourceName || t.blog.deep : post.category || t.blog.researchNote;

  return <article className="writing-item">
    {showCover && post.cover && (
      <div className="writing-cover">
        <SiteImage src={post.cover} loading={post.collection === 'research' ? 'eager' : 'lazy'} alt="" />
      </div>
    )}
    <div className="writing-copy">
      <p className="eyebrow">{category}</p>
      <h3><Link to={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={17} aria-hidden="true" /></Link></h3>
      <p className="writing-excerpt">{post.excerpt}</p>
      <div className="writing-meta">
        {post.date && <time dateTime={post.date}>{formatDate(post.date, language)}</time>}
        <span>{post.readTime} {t.blog.minutes}</span>
      </div>
    </div>
  </article>;
}
