import profile from '../data/profile.json';
import useLanguage from '../hooks/useLanguage';

export default function Footer() {
  const { language, t } = useLanguage();
  return <footer className="site-footer site-width"><p>© {new Date().getFullYear()} {language === 'en' ? profile.name : profile.chineseName} <span className="footer-dot">·</span> <span lang={language === 'en' ? 'zh-CN' : 'en'}>{language === 'en' ? profile.chineseName : profile.name}</span></p><div className="footer-links"><a href={`mailto:${profile.email}`}>{t.common.email}</a><a href={profile.social.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href="/rss.xml">RSS</a></div></footer>;
}
