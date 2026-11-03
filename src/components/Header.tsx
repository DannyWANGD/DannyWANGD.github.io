import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';
import profile from '../data/profile.json';
import life from '../data/life.json';
import SiteImage from './SiteImage';
import useLanguage from '../hooks/useLanguage';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
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
  const items = [{ name: t.common.home, path: '/' }, { name: t.common.projects, path: '/publications' }, { name: t.common.blog, path: '/blog' }, ...(life.length ? [{ name: t.common.life, path: '/life' }] : [])];
  const links = items.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{item.name}</NavLink>);
  return <header className="site-header" ref={header}>
    <div className="site-width header-inner">
      <Link to="/" className="brand" aria-label={`${language === 'en' ? profile.name : profile.chineseName} · ${t.common.home}`}>
        <SiteImage src={profile.avatar} alt="" width={36} height={36} className="brand-image" />
        <span>{language === 'en' ? profile.name : profile.chineseName}</span>
      </Link>
      <div className="header-actions">
        <nav className="desktop-nav" aria-label={t.common.mainNav}>{links}</nav>
        <button type="button" className="language-toggle" aria-label={t.common.switchLanguage} title={t.common.switchLanguage} onClick={() => setLanguage(language === 'en' ? 'zh-CN' : 'en')}>
          <Globe2 size={15} aria-hidden="true" /><span lang={language === 'en' ? 'zh-CN' : 'en'}>{language === 'en' ? '中文' : 'EN'}</span>
        </button>
        <button ref={toggle} type="button" className="menu-toggle" aria-label={isOpen ? t.common.closeNav : t.common.openNav} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    <nav id="mobile-navigation" className="mobile-nav site-width" aria-label={t.common.mobileNav} hidden={!isOpen}>{links}</nav>
  </header>;
}
