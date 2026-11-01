import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
  return <div className={`site-shell${isBlog ? ' blog-fonts' : ''}`}><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content" className={`site-main site-width${pathname === '/' ? ' home-main' : ''}`} tabIndex={-1}>{children}</main><Footer /></div>;
}
