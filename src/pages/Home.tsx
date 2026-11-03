import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import profileData from '../data/profile.json';
import projects from '../data/projects.json';
import awards from '../data/awards.json';
import posts from '../data/posts';
import ProjectCard from '../components/ProjectCard';
import BlogPostCard from '../components/BlogPostCard';
import SiteImage from '../components/SiteImage';
import ContactLinks from '../components/ContactLinks';
import useLanguage from '../hooks/useLanguage';
import { localize } from '../i18n/context';

export default function Home() {
  const { language, t } = useLanguage();
  const profile = { ...profileData, ...profileData.translations[language] };
  const research = posts.filter(post => post.collection === 'research').slice(0, 2);
  const sortedAwards = awards.map(award => localize(award, language)).sort((a, b) => b.date.localeCompare(a.date));
  const reportCount = projects.filter(project => project.report).length;
  return <div className="home-page">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow">{t.home.eyebrow}</p>
        <h1 id="home-title">{language === 'en' ? profile.name : profile.chineseName}<span lang={language === 'en' ? 'zh-CN' : 'en'}>{language === 'en' ? profile.chineseName : profile.name}</span></h1>
        <p className="hero-headline">{profile.headline}</p>
        <p className="hero-affiliation">{profile.title}<br />{profile.institution}</p>
        <div className="hero-actions">
          <Link className="button-primary" to="/publications">{t.home.explore} <ArrowRight size={16} /></Link>
          <a className="button-quiet" href="#contact">{t.home.contact} <ArrowRight size={16} /></a>
          {profile.cv && <a className="button-quiet" href={profile.cv}>{t.common.cv} <ArrowUpRight size={16} /></a>}
        </div>
      </div>
      <div className="hero-art"><SiteImage src={profile.heroImage} alt={profile.heroImageAlt} width={1080} height={1080} fetchPriority="high" className="hero-image" /></div>
    </section>
    <ContactLinks />
    <section className="intro-section" aria-label={t.home.about}>
      <p className="eyebrow">{t.home.aboutEyebrow}</p>
      <div>
        {profile.bio.map((paragraph, index) => <p className="intro-copy" key={index}>{paragraph}</p>)}
        <ul className="research-interests" aria-label={t.home.interests}>
          {profile.interests.map(interest => <li key={interest}>{interest}</li>)}
        </ul>
      </div>
    </section>
    {projects.length > 0 && <section className="page-section" id="selected-work"><div className="section-heading"><div><p className="eyebrow">{t.home.practice}</p><h2>{t.home.selectedWork}</h2></div><Link className="text-link" to="/publications">{t.common.allProjects} <ArrowRight size={16} /></Link></div>{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}{reportCount > 0 && <Link className="text-link reports-entry" to="/publications#engineering-reports">{t.home.browseReports} · {reportCount} PDFs <ArrowRight size={16} aria-hidden="true" /></Link>}</section>}
    {sortedAwards.length > 0 && <section className="page-section honors-section" aria-labelledby="honors-title">
      <div className="section-heading">
        <div><p className="eyebrow">{t.home.recognition}</p><h2 id="honors-title">{t.home.honors}</h2></div>
        <p className="honors-period">2025 — 2026</p>
      </div>
      <ol className="honors-list">
        {sortedAwards.map(award => <li key={award.id} className="honor-row">
          <time dateTime={award.date}>{award.date.replace('-', '.')}</time>
          <h3>{award.title}</h3>
          <div className="honor-prizes">{award.description.split('/').map(prize => <span key={prize}>{prize}</span>)}</div>
        </li>)}
      </ol>
    </section>}
    {research.length > 0 && <section className="page-section"><div className="section-heading"><div><p className="eyebrow">{t.home.notes}</p><h2>{t.home.selectedPosts}</h2></div><Link className="text-link" to="/blog">{t.common.allPosts} <ArrowRight size={16} /></Link></div><div className="writing-grid">{research.map(post => <BlogPostCard key={post.slug} post={post} />)}</div></section>}
    <section className="page-section education-section" aria-labelledby="education-title"><p className="eyebrow">{t.home.background}</p><h2 id="education-title">{t.home.education}</h2><div className="education-list">{profile.education.map(edu => <article key={edu.school}><p className="meta">{edu.year}</p><h3>{edu.school}</h3><p>{edu.degree}</p><p className="meta">{edu.field}</p></article>)}</div></section>
  </div>;
}
