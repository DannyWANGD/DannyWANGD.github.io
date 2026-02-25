import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, MapPin, Calendar } from 'lucide-react';
import lifeData from '../data/life.json';

const LifePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = lifeData.find(p => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p className="text-gray-500 mb-6">The photo you are looking for doesn't exist or has been removed.</p>
        <Link to="/life" className="text-primary hover:underline font-medium">
          Back to Life Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto px-4 md:px-8 py-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium">Back</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Image Section - Left (or Top) */}
        <div className="md:w-3/5 bg-gray-100">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-contain max-h-[80vh] md:max-h-[800px]"
          />
        </div>

        {/* Content Section - Right (or Bottom) */}
        <div className="md:w-2/5 flex flex-col h-full min-h-[400px] md:min-h-[600px]">
          {/* Header */}
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://github.com/DannyWANGD.png" 
                alt="Wang Ding" 
                className="w-10 h-10 rounded-full border border-gray-100"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Wang Ding</h3>
                <p className="text-xs text-gray-500">Robotics Engineer</p>
              </div>
              <button className="ml-auto text-primary text-sm font-semibold hover:bg-primary/10 px-3 py-1 rounded-full transition-colors">
                Follow
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
              {post.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.description.match(/#\w+/g)?.map((tag, i) => (
                <span key={i} className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-400 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              {post.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{post.location}</span>
                </div>
              )}
            </div>

            {/* Simulated Comments */}
            <div className="border-t border-gray-50 pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Comments (2)</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                    A
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-semibold text-gray-900">Alice</span> <span className="text-gray-600">This looks amazing! Where exactly is this?</span></p>
                    <p className="text-xs text-gray-400 mt-1">2h ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs shrink-0">
                    B
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-semibold text-gray-900">Bob</span> <span className="text-gray-600">Great shot! The lighting is perfect. 📸</span></p>
                    <p className="text-xs text-gray-400 mt-1">5h ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-6">
                <button className="flex items-center gap-1.5 group">
                  <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                    <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-red-500">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 group">
                  <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                    <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-500">2</span>
                </button>
                <button className="flex items-center gap-1.5 group">
                  <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                    <Share2 className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
                  </div>
                </button>
              </div>
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                {/* Save/Bookmark icon could go here */}
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full bg-gray-50 border-none rounded-full py-2.5 px-4 text-sm focus:ring-1 focus:ring-primary placeholder:text-gray-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-semibold text-sm px-2 hover:bg-primary/10 rounded-md transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifePost;
