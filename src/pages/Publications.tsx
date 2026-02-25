import React from 'react';
import publicationsData from '../data/publications.json';
import projectsData from '../data/projects.json';
import PublicationCard from '../components/PublicationCard';
import { Github } from 'lucide-react';

const Publications: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto px-4 md:px-8">
      {/* Publications Section */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Publications</h1>
          <p className="text-gray-600 max-w-2xl">
            A bright future awaits you, stay tuned!
          </p>
        </div>

        <div className="grid gap-6">
          {publicationsData.length > 0 ? (
            publicationsData.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">Coming soon... Stay tuned for updates!</p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-primary/20 pb-1 inline-block mb-4">
            Projects
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Open source projects and tools I have developed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projectsData.map((project) => (
            <div key={project.id} className="p-6 rounded-lg border border-gray-100 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                  <Github size={20} />
                </a>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-50 text-gray-500 rounded border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications;