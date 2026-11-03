import { useEffect } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import publications from '../data/publications.json';
import projects from '../data/projects.json';
import PublicationCard from '../components/PublicationCard';
import ProjectCard, { type Project } from '../components/ProjectCard';
import useLanguage from '../hooks/useLanguage';
import { localizeProject } from '../i18n/content';

const allProjects: Project[] = projects;
const software = allProjects.filter(project => !project.report);
const reports = allProjects.filter(project => project.report);

export default function Publications() {
  const { language, t } = useLanguage();
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return <>
    <header className="page-intro">
      <p className="eyebrow">{t.projects.eyebrow}</p>
      <h1>{t.common.projects}</h1>
      <p>{t.projects.description}</p>
      {reports.length > 0 && <a className="text-link" href="#engineering-reports">{t.projects.reports} · {reports.length} PDFs <ArrowDownRight size={16} aria-hidden="true" /></a>}
    </header>
    <section aria-label={t.common.projects}>{software.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</section>
    {reports.length > 0 && <section className="page-section reports-section" id="engineering-reports" aria-labelledby="reports-title">
      <div className="section-heading">
        <div><p className="eyebrow">{t.projects.reportsEyebrow}</p><h2 id="reports-title">{t.projects.reports}</h2></div>
        <span className="reports-count">{reports.length} {t.projects.reportCount}</span>
      </div>
      <p className="reports-intro">{t.projects.reportsIntro}</p>
      <nav className="report-index" aria-label={t.projects.indexLabel}>
        <p className="eyebrow">{t.projects.index}</p>
        <ol className="report-index-list">
          {reports.map(source => localizeProject(source, language)).map((project, index) => <li key={project.id}><a href={`#${project.slug}`}>
            <span className="report-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span><strong>{project.title}</strong><span className="report-index-subtitle">{project.subtitle}</span></span>
            <ArrowDownRight size={16} aria-hidden="true" />
          </a></li>)}
        </ol>
      </nav>
      {reports.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
    </section>}
    {publications.length > 0 && <section className="page-section"><div className="section-heading"><h2>{t.projects.publications}</h2></div>{publications.map(pub => <PublicationCard key={pub.id} publication={pub} />)}</section>}
  </>;
}
