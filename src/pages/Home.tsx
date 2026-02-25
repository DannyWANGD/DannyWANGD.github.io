import React from 'react';
import profileData from '../data/profile.json';
import publicationsData from '../data/publications.json';
import awardsData from '../data/awards.json';
import SocialLinks from '../components/SocialLinks';
import PublicationCard from '../components/PublicationCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Award, Calendar } from 'lucide-react';

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

      {/* Awards Section */}
      {awardsData.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-primary/20 pb-1 inline-block">
              Honors & Awards
            </h2>
            <span className="px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full">
              共 {awardsData.length} 项
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awardsData.map((award) => (
              <div 
                key={award.id} 
                className="group relative overflow-hidden p-5 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                {/* Decorative background icon */}
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                  <Trophy size={80} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Award size={20} />
                    </div>
                    <div className="flex items-center text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                      <Calendar size={12} className="mr-1" />
                      {award.date}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {award.title}
                  </h3>
                  
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {award.issuer}
                  </p>
                  
                  {award.description && (
                    <p className="text-sm text-gray-400 mt-auto line-clamp-2">
                      {award.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Publications */}
      {recentPublications.length > 0 && (
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
      )}
      
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