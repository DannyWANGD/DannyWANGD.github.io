import publications from '../data/publications.json';
import projects from '../data/projects.json';
import PublicationCard from '../components/PublicationCard';
import ProjectCard from '../components/ProjectCard';

export default function Publications() {
  return <><header className="page-intro"><p className="eyebrow">Ideas into practice</p><h1>Research & Projects</h1><p>Exploring learning algorithms and the machines they help us build.</p></header><section aria-label="Projects">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</section>{publications.length > 0 && <section className="page-section"><div className="section-heading"><h2>Publications</h2></div>{publications.map(pub => <PublicationCard key={pub.id} publication={pub} />)}</section>}</>;
}
