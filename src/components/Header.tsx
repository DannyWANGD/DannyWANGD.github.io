import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import profile from '../data/profile.json';
import life from '../data/life.json';
import SiteImage from './SiteImage';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  useEffect(() => { setIsOpen(false); }, [pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setIsOpen(false); toggle.current?.focus(); } };
    const onOutside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside); };
  }, [isOpen]);
  const items = [{ name: 'Home', path: '/' }, { name: 'Research & Projects', path: '/publications' }, { name: 'Blog', path: '/blog' }, ...(life.length ? [{ name: 'Life', path: '/life' }] : [])];
  const links = items.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{item.name}</NavLink>);
  return <header className="site-header" ref={header}><div className="site-width header-inner"><Link to="/" className="brand" aria-label={`${profile.name}, home`}><SiteImage src={profile.avatar} alt="" width={36} height={36} className="brand-image" /><span>{profile.name}</span></Link><nav className="desktop-nav" aria-label="Main navigation">{links}</nav><button ref={toggle} type="button" className="menu-toggle" aria-label={isOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={22} /> : <Menu size={22} />}</button></div><nav id="mobile-navigation" className="mobile-nav site-width" aria-label="Mobile navigation" hidden={!isOpen}>{links}</nav></header>;
}
