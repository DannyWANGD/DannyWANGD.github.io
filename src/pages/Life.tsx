import { Link } from 'react-router-dom';
import entries from '../data/life.json';
import SiteImage from '../components/SiteImage';

export interface LifeEntry { id: string; title: string; image: string; date: string; description: string; location?: string; }
export default function Life() {
  return <><header className="page-intro"><p className="eyebrow">Away from the desk</p><h1>Life, in moments.</h1><p>Photographs and observations along the way.</p></header>{entries.length ? <div className="life-grid">{(entries as LifeEntry[]).map(entry => <Link key={entry.id} to={`/life/${entry.id}`} className="life-item"><SiteImage src={entry.image} alt={entry.title} width={640} height={480} loading="lazy" /><h2>{entry.title}</h2><time dateTime={entry.date}>{entry.date}</time></Link>)}</div> : <div className="empty-state"><p>No photographs published yet.</p><Link className="text-link" to="/">Return home →</Link></div>}</>;
}
