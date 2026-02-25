import React from 'react';
import { Github, Linkedin, Mail, Twitter, GraduationCap } from 'lucide-react';

interface SocialLinksProps {
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
    googleScholar?: string;
  };
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links, className = '' }) => {
  return (
    <div className={`flex gap-4 ${className}`}>
      {links.github && (
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" title="GitHub">
          <Github size={24} />
        </a>
      )}
      {links.googleScholar && (
        <a href={links.googleScholar} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" title="Google Scholar">
          <GraduationCap size={24} />
        </a>
      )}
      {links.twitter && (
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" title="Twitter">
          <Twitter size={24} />
        </a>
      )}
      {links.linkedin && (
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" title="LinkedIn">
          <Linkedin size={24} />
        </a>
      )}
      {links.email && (
        <a href={`mailto:${links.email}`} className="text-gray-600 hover:text-primary transition-colors" title="Email">
          <Mail size={24} />
        </a>
      )}
    </div>
  );
};

export default SocialLinks;