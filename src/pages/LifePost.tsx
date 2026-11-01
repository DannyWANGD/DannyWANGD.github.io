import { Link, useParams } from 'react-router-dom';
import entries from '../data/life.json';
import type { LifeEntry } from './Life';
import SiteImage from '../components/SiteImage';
import NotFound from './NotFound';

export default function LifePost() {
  const { id } = useParams();
  const entry = (entries as LifeEntry[]).find(item => item.id === id);
  if (!entry) return <NotFound message="This photograph has not been published." />;
  return <article className="life-post"><Link className="text-link" to="/life">← All moments</Link><header className="page-intro"><h1>{entry.title}</h1><p><time dateTime={entry.date}>{entry.date}</time>{entry.location && ` · ${entry.location}`}</p></header><SiteImage src={entry.image} alt={entry.title} width={1200} height={900} /><p>{entry.description}</p></article>;
}
