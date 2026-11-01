import { Link } from 'react-router-dom';

export default function NotFound({ message = 'This page could not be found.' }: { message?: string }) {
  return <section className="not-found"><p className="eyebrow">404 / A little off the path</p><h1>Page not found.</h1><p>{message}</p><div className="hero-actions"><Link className="button-primary" to="/">Back home</Link><Link className="button-quiet" to="/blog">Browse blog →</Link></div></section>;
}
