import type { CSSProperties } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import SiteImage from './SiteImage';

export interface Project {
  id: number;
  slug?: string;
  title: string;
  subtitle?: string;
  description: string;
  language?: string;
  link?: string;
  links?: { label: string; url: string }[];
  tags: string[];
  image?: string;
  imageScale?: number;
  imageAlt?: string;
  imageCaption?: string;
  report?: { file: string; pages: number; startPage: number; figurePage: number };
  contribution?: string;
  result?: string;
}

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const imageStyle = project.image ? { '--project-image-scale': project.imageScale ?? 1 } as CSSProperties : undefined;
  const english = project.language === 'en';
  const reportUrl = project.report ? `${project.report.file}#page=${project.report.startPage}` : undefined;
  const figureUrl = project.report ? `${project.report.file}#page=${project.report.figurePage}` : undefined;
  const primaryUrl = reportUrl || project.link;
  const links = project.report ? [
    { label: english ? `Read report · ${project.report.pages} pp.` : `阅读报告 · ${project.report.pages} 页`, url: reportUrl! },
    { label: english ? 'Figure source' : '图表出处', url: figureUrl! },
  ] : project.links?.length ? project.links : project.link ? [{ label: 'Explore the code', url: project.link }] : [];
  const image = project.image && <SiteImage src={project.image} alt={project.imageAlt || project.title} width={640} height={400} loading="lazy" className="project-image" />;

  return <article id={project.slug || `project-${project.id}`} lang={project.language} className={`project-row ${project.image ? 'project-with-image' : ''} ${project.report ? 'report-row' : ''}`} style={imageStyle}>
    {image ? project.report ? <figure className="project-figure">
      <a href={figureUrl} target="_blank" rel="noreferrer">{image}</a>
      {project.imageCaption && <figcaption>{project.imageCaption}</figcaption>}
    </figure> : image : <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
    <div className="project-content">
      <p className="eyebrow">{project.tags.join(' / ')}</p>
      <h3>{primaryUrl ? <a href={primaryUrl} target="_blank" rel="noreferrer">{project.title}<ArrowUpRight size={21} aria-hidden="true" /></a> : project.title}</h3>
      {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
      <p>{project.description}</p>
      {project.contribution && <p><strong>My contribution.</strong> {project.contribution}</p>}
      {project.result && <p><strong>Result.</strong> {project.result}</p>}
      {links.length > 0 && <div className="project-links">
        {links.map((link, linkIndex) => <a key={link.url} className="text-link" href={link.url} target="_blank" rel="noreferrer">{project.report && linkIndex === 0 && <FileText size={16} aria-hidden="true" />}{link.label} <ArrowUpRight size={15} aria-hidden="true" /></a>)}
      </div>}
    </div>
  </article>;
}
