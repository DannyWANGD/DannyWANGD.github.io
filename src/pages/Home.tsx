import React from 'react';
import profileData from '../data/profile.json';
import publicationsData from '../data/publications.json';
import SocialLinks from '../components/SocialLinks';
import PublicationCard from '../components/PublicationCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const recentPublications = publicationsData.slice(0, 3);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 h-48 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img 
            src={profileData.avatar} 
            alt={profileData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center md:text-left space-y-4 flex-1">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{profileData.name}</h1>
            <p className="text-xl text-gray-600 mt-2">{profileData.title}</p>
            <p className="text-gray-500">{profileData.institution}</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed max-w-2xl">
            {profileData.bio}
          </p>
          
          <SocialLinks links={profileData.social} className="justify-center md:justify-start pt-2" />
        </div>
      </section>

      {/* Selected Publications */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-primary/20 pb-1 inline-block">
            Selected Publications
          </h2>
          <Link to="/publications" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid gap-6">
          {recentPublications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      </section>
      
      {/* Education */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-primary/20 pb-1 inline-block mb-6">
          Education
        </h2>
        <div className="space-y-6">
          {profileData.education.map((edu, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <div>
                <h3 className="font-bold text-gray-900">{edu.school}</h3>
                <p className="text-gray-600">{edu.degree}</p>
                <p className="text-sm text-gray-500">{edu.field}</p>
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap">
                {edu.year}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;