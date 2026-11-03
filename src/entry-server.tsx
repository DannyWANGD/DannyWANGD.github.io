import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Publications from './pages/Publications';
import Life from './pages/Life';
import LifePost from './pages/LifePost';
import NotFound from './pages/NotFound';
import Article from './components/Article';
import MarkdownBody from './components/MarkdownBody';
import { getPageMetadata } from './utils/pageMetadata';
import type { ParsedMarkdownPost } from './utils/markdownPost';
import LanguageProvider from './i18n/LanguageProvider';

export function render(path: string, post?: ParsedMarkdownPost) {
  const page = post ? <Article post={post}><MarkdownBody content={post.content} /></Article> : path === '/' ? <Home /> : path === '/blog' ? <Blog /> : path === '/publications' ? <Publications /> : path === '/life' ? <Life /> : path.startsWith('/life/') ? <LifePost /> : <NotFound />;
  return { html: renderToString(<LanguageProvider><StaticRouter location={path}><SiteLayout><Routes><Route path="/life/:id" element={<LifePost />} /><Route path="*" element={page} /></Routes></SiteLayout></StaticRouter></LanguageProvider>), meta: getPageMetadata(path) };
}
