import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Plus } from 'lucide-react';
import lifeData from '../data/life.json';

const Life: React.FC = () => {
  const handleUploadClick = () => {
    alert("To upload new photos, please add them to the 'src/data/life.json' file in the repository and push your changes. Since this is a static site hosted on GitHub Pages, content is managed via code.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Life</h1>
          <p className="text-gray-500 mt-1">Capturing moments, sharing memories.</p>
        </div>
        <button 
          onClick={handleUploadClick}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Upload
        </button>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {lifeData.map((post) => (
          <Link 
            to={`/life/${post.id}`} 
            key={post.id}
            className="block break-inside-avoid mb-4 group"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-auto object-cover group-hover:brightness-95 transition-all"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={12} className="fill-white" />
                  {post.likes}
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 leading-tight">
                  {post.title}
                </h3>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <img 
                      src="https://github.com/DannyWANGD.png" 
                      alt="User" 
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="scale-90">Wang Ding</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={12} />
                    {post.likes}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Life;
