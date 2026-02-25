import React from 'react';
import profileData from '../data/profile.json';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
       <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Me</h1>
        <div className="prose prose-lg prose-slate text-gray-700">
            <p className="text-xl leading-relaxed">
                {profileData.bio}
            </p>
            <p>
                I am currently pursuing my Ph.D. at the University of Hong Kong. My research interests lie at the intersection of Robotics, Computer Vision, and Machine Learning.
            </p>
        </div>
       </div>

       <div className="grid md:grid-cols-2 gap-8">
           <div>
               <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Contact</h2>
               <ul className="space-y-2 text-gray-600">
                   <li>
                       <span className="font-semibold text-gray-900">Email:</span> {profileData.email}
                   </li>
                   <li>
                       <span className="font-semibold text-gray-900">Office:</span> Room 123, Chow Yei Ching Building, HKU
                   </li>
               </ul>
           </div>
           
           <div>
               <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Research Interests</h2>
               <ul className="list-disc list-inside space-y-1 text-gray-600">
                   <li>Embodied AI</li>
                   <li>Robot Manipulation</li>
                   <li>Sim2Real Transfer</li>
                   <li>Generative Models</li>
               </ul>
           </div>
       </div>
    </div>
  );
};

export default About;