import React from 'react';

export interface Publication {
  id: number;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  keywords: string[];
  links: {
    pdf?: string;
    code?: string;
    project?: string;
  };
  highlight?: boolean;
}

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  return (
    <div className={`p-6 rounded-lg border transition-shadow hover:shadow-md ${publication.highlight ? 'border-primary/20 bg-blue-50/30' : 'border-gray-100 bg-white'}`}>
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {publication.title}
        </h3>
        <span className="text-sm text-gray-500 whitespace-nowrap">{publication.year}</span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        {publication.authors.map((author, index) => (
          <span key={index} className={author.includes("Wang Ding") ? "font-bold text-gray-900" : ""}>
            {author}{index < publication.authors.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      
      <p className="text-sm font-medium text-primary mt-1">{publication.venue}</p>
      
      <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
        {publication.abstract}
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {publication.keywords.map((keyword) => (
          <span key={keyword} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
            {keyword}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex gap-3">
        {publication.links.pdf && (
          <a href={publication.links.pdf} className="text-xs font-medium text-primary hover:underline">
            [PDF]
          </a>
        )}
        {publication.links.code && (
          <a href={publication.links.code} className="text-xs font-medium text-primary hover:underline">
            [Code]
          </a>
        )}
        {publication.links.project && (
          <a href={publication.links.project} className="text-xs font-medium text-primary hover:underline">
            [Project]
          </a>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;