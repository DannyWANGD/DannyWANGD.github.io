import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';

export default function NotFound({ message }: { message?: string }) {
  const { t } = useLanguage();
  return <section className="not-found"><p className="eyebrow">{t.notFound.eyebrow}</p><h1>{t.notFound.title}</h1><p>{message || t.notFound.message}</p><div className="hero-actions"><Link className="button-primary" to="/">{t.common.backHome}</Link><Link className="button-quiet" to="/blog">{t.notFound.browse} →</Link></div></section>;
}
