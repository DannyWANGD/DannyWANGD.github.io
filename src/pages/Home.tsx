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
  
  // Calculate national awards count
  const nationalAwardsCount = awardsData.filter(award => award.description.includes('国家级') || award.description.includes('National')).length;

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
              国家级奖项 {nationalAwardsCount} 项
            </span>
          </div>
          
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-2">
            {awardsData.map((award, index) => (
              <div key={award.id} className="relative pl-8 group">
                {/* Timeline dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 ${index === 0 ? 'bg-yellow-500 ring-4 ring-yellow-100' : 'bg-gray-300 group-hover:bg-primary group-hover:ring-4 group-hover:ring-primary/20'}`}></div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {award.title}
                  </h3>
                  <span className="text-sm font-mono text-gray-400 whitespace-nowrap shrink-0">
                    {award.date}
                  </span>
                </div>
                
                <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-500">{award.issuer}</span>
                  {award.description && (
                    <>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className={`font-semibold ${award.description.includes('一等奖') || award.description.includes('Winner') ? 'text-amber-600' : 'text-primary'}`}>
                        {award.description}
                      </span>
                    </>
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