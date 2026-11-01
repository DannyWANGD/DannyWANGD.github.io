import profile from '../data/profile.json';

export default function Footer() {
  return <footer className="site-footer site-width"><p>© {new Date().getFullYear()} {profile.name} <span className="footer-dot">·</span> {profile.chineseName}</p><div className="footer-links"><a href={`mailto:${profile.email}`}>Email</a><a href={profile.social.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href="/rss.xml">RSS</a></div></footer>;
}
