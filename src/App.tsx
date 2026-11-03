import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import { applyPageMetadata, getPageMetadata } from './utils/pageMetadata';
import useLanguage from './hooks/useLanguage';

const Home = lazy(() => import('./pages/Home'));
const Publications = lazy(() => import('./pages/Publications'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Life = lazy(() => import('./pages/Life'));
const LifePost = lazy(() => import('./pages/LifePost'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageEffects() {
  const { language } = useLanguage();
  const { pathname, hash } = useLocation();
  const navigation = useNavigationType();
  useEffect(() => { applyPageMetadata(getPageMetadata(pathname, language)); }, [pathname, language]);
  useEffect(() => { if (!hash && navigation !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname, hash, navigation]);
  return null;
}
export default function App() {
  const { t } = useLanguage();
  return <BrowserRouter><PageEffects /><SiteLayout><Suspense fallback={<p className="loading-state" role="status">{t.common.loading}</p>}><Routes><Route path="/" element={<Home />} /><Route path="/publications" element={<Publications />} /><Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} /><Route path="/life" element={<Life />} /><Route path="/life/:id" element={<LifePost />} /><Route path="*" element={<NotFound />} /></Routes></Suspense></SiteLayout></BrowserRouter>;
}
