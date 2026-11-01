import { useEffect } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import publications from '../data/publications.json';
import projects from '../data/projects.json';
import PublicationCard from '../components/PublicationCard';
import ProjectCard, { type Project } from '../components/ProjectCard';

const allProjects: Project[] = projects;
const software = allProjects.filter(project => !project.report);
const reports = allProjects.filter(project => project.report);

export default function Publications() {
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
      <p className="eyebrow">Ideas into practice</p>
      <h1>Research & Projects</h1>
      <p>Open-source tools and engineering studies in perception, prediction, and decision-making.</p>
      {reports.length > 0 && <a className="text-link" href="#engineering-reports">Engineering reports · {reports.length} PDFs <ArrowDownRight size={16} aria-hidden="true" /></a>}
    </header>
    <section aria-label="Projects">{software.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</section>
    {reports.length > 0 && <section className="page-section reports-section" id="engineering-reports" aria-labelledby="reports-title">
      <div className="section-heading">
        <div><p className="eyebrow">Engineering / Analysis / Modeling</p><h2 id="reports-title">Engineering reports</h2></div>
        <span className="reports-count">{reports.length} reports · PDF</span>
      </div>
      <p className="reports-intro" lang="zh-CN">从感知与信号处理到预测与决策优化，以下条目整理了各报告的问题、方法与代表图。选择索引可定位项目，点击标题或“阅读报告”可直接打开 PDF 原文。</p>
      <nav className="report-index" aria-label="工程报告索引">
        <p className="eyebrow">Report index / 报告索引</p>
        <ol className="report-index-list">
          {reports.map((project, index) => <li key={project.id}><a href={`#${project.slug}`}>
            <span className="report-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span><strong>{project.title}</strong><span className="report-index-subtitle">{project.subtitle}</span></span>
            <ArrowDownRight size={16} aria-hidden="true" />
          </a></li>)}
        </ol>
      </nav>
      {reports.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
    </section>}
    {publications.length > 0 && <section className="page-section"><div className="section-heading"><h2>Publications</h2></div>{publications.map(pub => <PublicationCard key={pub.id} publication={pub} />)}</section>}
  </>;
}
