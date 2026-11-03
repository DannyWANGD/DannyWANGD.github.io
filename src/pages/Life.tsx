import { Link } from 'react-router-dom';
import entries from '../data/life.json';
import SiteImage from '../components/SiteImage';
import useLanguage from '../hooks/useLanguage';
import { localize, type Translations } from '../i18n/context';
import { formatDate } from '../utils/dateFormat';

export interface LifeEntry extends Translations<LifeEntry> { id: string; title: string; image: string; date: string; description: string; location?: string; }
export default function Life() {
  const { language, t } = useLanguage();
  return <><header className="page-intro"><p className="eyebrow">{t.life.eyebrow}</p><h1>{t.life.title}</h1><p>{t.life.description}</p></header>{entries.length ? <div className="life-grid">{(entries as LifeEntry[]).map(entry => localize(entry, language)).map(entry => <Link key={entry.id} to={`/life/${entry.id}`} className="life-item"><SiteImage src={entry.image} alt={entry.title} width={640} height={480} loading="lazy" /><h2>{entry.title}</h2><time dateTime={entry.date}>{formatDate(entry.date, language)}</time></Link>)}</div> : <div className="empty-state"><p>{t.life.empty}</p><Link className="text-link" to="/">{t.common.backHome} →</Link></div>}</>;
}
