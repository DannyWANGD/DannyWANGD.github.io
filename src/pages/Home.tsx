import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import profile from '../data/profile.json';
import projects from '../data/projects.json';
import awards from '../data/awards.json';
import posts from '../data/posts';
import ProjectCard from '../components/ProjectCard';
import BlogPostCard from '../components/BlogPostCard';
import SiteImage from '../components/SiteImage';
import ContactLinks from '../components/ContactLinks';

export default function Home() {
  const research = posts.filter(post => post.collection === 'research').slice(0, 2);
  const sortedAwards = [...awards].sort((a, b) => b.date.localeCompare(a.date));
  return <div className="home-page">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow">Robotics · Learning · Building</p>
        <h1 id="home-title">{profile.name}<span lang="zh-CN">{profile.chineseName}</span></h1>
        <p className="hero-headline">{profile.headline}</p>
        <p className="hero-affiliation">{profile.title}<br />{profile.institution}</p>
        <div className="hero-actions">
          <Link className="button-primary" to="/publications">Explore my work <ArrowRight size={16} /></Link>
          <a className="button-quiet" href="#contact">Get in touch <ArrowRight size={16} /></a>
          {profile.cv && <a className="button-quiet" href={profile.cv}>CV <ArrowUpRight size={16} /></a>}
        </div>
      </div>
      <div className="hero-art"><SiteImage src={profile.heroImage} alt={profile.heroImageAlt} width={1080} height={1080} fetchPriority="high" className="hero-image" /></div>
    </section>
    <ContactLinks />
    <section className="intro-section" aria-label="About me">
      <p className="eyebrow">A little about me</p>
      <div>
        <p className="intro-copy">{profile.bio}</p>
        <ul className="research-interests" aria-label="Research interests">
          {profile.interests.map(interest => <li key={interest}>{interest}</li>)}
        </ul>
        <details className="about-details">
          <summary>More about me / 中文简介</summary>
          <div><p className="bio-chinese" lang="zh-CN">{profile.bioChinese}</p></div>
        </details>
      </div>
    </section>
    {projects.length > 0 && <section className="page-section" id="selected-work"><div className="section-heading"><div><p className="eyebrow">01 / In practice</p><h2>Selected work</h2></div><Link className="text-link" to="/publications">All projects <ArrowRight size={16} /></Link></div>{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</section>}
    {sortedAwards.length > 0 && <section className="page-section honors-section" aria-labelledby="honors-title">
      <div className="section-heading">
        <div><p className="eyebrow">02 / Recognition</p><h2 id="honors-title">Honors & awards</h2></div>
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
    {research.length > 0 && <section className="page-section"><div className="section-heading"><div><p className="eyebrow">03 / Working things out</p><h2>Selected posts</h2></div><Link className="text-link" to="/blog">All posts <ArrowRight size={16} /></Link></div><div className="writing-grid">{research.map(post => <BlogPostCard key={post.slug} post={post} />)}</div></section>}
    <section className="page-section education-section" aria-labelledby="education-title"><p className="eyebrow">04 / Background</p><h2 id="education-title">Education</h2><div className="education-list">{profile.education.map(edu => <article key={edu.school}><p className="meta">{edu.year}</p><h3>{edu.school}</h3><p>{edu.degree}</p><p className="meta">{edu.field}</p></article>)}</div></section>
  </div>;
}
