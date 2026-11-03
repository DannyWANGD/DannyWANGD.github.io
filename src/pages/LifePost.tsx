import { Link, useParams } from 'react-router-dom';
import entries from '../data/life.json';
import type { LifeEntry } from './Life';
import SiteImage from '../components/SiteImage';
import NotFound from './NotFound';
import useLanguage from '../hooks/useLanguage';
import { localize } from '../i18n/context';
import { formatDate } from '../utils/dateFormat';

export default function LifePost() {
  const { language, t } = useLanguage();
  const { id } = useParams();
  const source = (entries as LifeEntry[]).find(item => item.id === id);
  if (!source) return <NotFound message={t.life.unpublished} />;
  const entry = localize(source, language);
  return <article className="life-post"><Link className="text-link" to="/life">← {t.life.back}</Link><header className="page-intro"><h1>{entry.title}</h1><p><time dateTime={entry.date}>{formatDate(entry.date, language)}</time>{entry.location && ` · ${entry.location}`}</p></header><SiteImage src={entry.image} alt={entry.title} width={1200} height={900} /><p>{entry.description}</p></article>;
}
