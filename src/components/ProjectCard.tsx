import { ArrowUpRight } from 'lucide-react';
import SiteImage from './SiteImage';

export interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  contribution?: string;
  result?: string;
}

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return <article className={`project-row ${project.image ? 'project-with-image' : ''}`}>{project.image ? <SiteImage src={project.image} alt={project.imageAlt || project.title} width={640} height={400} loading="lazy" className="project-image" /> : <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}<div className="project-content"><p className="eyebrow">{project.tags.join(' / ')}</p><h3>{project.link ? <a href={project.link} target="_blank" rel="noreferrer">{project.title}<ArrowUpRight size={21} aria-hidden="true" /></a> : project.title}</h3><p>{project.description}</p>{project.contribution && <p><strong>My contribution.</strong> {project.contribution}</p>}{project.result && <p><strong>Result.</strong> {project.result}</p>}{project.link && <a className="text-link" href={project.link} target="_blank" rel="noreferrer">Explore the code <ArrowUpRight size={15} aria-hidden="true" /></a>}</div></article>;
}
