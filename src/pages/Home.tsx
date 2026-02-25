import React, { useState } from 'react';
import profileData from '../data/profile.json';
import publicationsData from '../data/publications.json';
import awardsData from '../data/awards.json';
import SocialLinks from '../components/SocialLinks';
import PublicationCard from '../components/PublicationCard';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Trophy, 
  Brain, 
  Award, 
  Calendar,
  ChevronDown, 
  ChevronUp,
  Cpu,
  Code,
  Wrench,
  Camera,
  BookOpen,
  PenTool,
  Mail,
  MessageSquare,
  MapPin
} from 'lucide-react';

const Home: React.FC = () => {
  const recentPublications = publicationsData.slice(0, 3);
  const [showChinese, setShowChinese] = useState(false);
  
  // Calculate national awards count
  const nationalAwardsCount = awardsData.filter(award => award.description.includes('国家级') || award.description.includes('National')).length;

  const interests = [
    "Embodied AI",
    "Robot Manipulation",
    "Model-based RL",
    "Generative Models"
  ];

  const hobbies = [
    { name: "Calligraphy", icon: <PenTool size={14} /> },
    { name: "Reading", icon: <BookOpen size={14} /> },
    { name: "Soccer", icon: "⚽" },
    { name: "Poetry", icon: "📜" },
    { name: "Photography", icon: <Camera size={14} /> },
    { name: "Ball Games", icon: "🏓" }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto px-4 md:px-8">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
          <img 
            src={profileData.avatar} 
            alt={profileData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center md:text-left space-y-5 flex-1">
          <div>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{profileData.name}</h1>
              <SocialLinks links={profileData.social} className="pt-1" />
            </div>
            <p className="text-xl text-primary font-medium mt-2">{profileData.title}</p>
            <p className="text-gray-500 font-medium">{profileData.institution}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Users size={14} className="text-primary" />
              Class Monitor for 13 Years
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Trophy size={14} className="text-amber-500" />
              6 National Awards
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Brain size={14} className="text-blue-500" />
              Rank 1st in Major
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed max-w-2xl text-lg">
            Undergraduate student at <strong className="text-gray-900">Beijing Institute of Technology</strong>, 
            Xu Teli College (Li Zexiang Innovation Class). 
            Passionate about building intelligent robots that can perceive and interact with the world.
          </p>
        </div>
      </section>

      {/* Biography Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-primary/20 pb-1 inline-block mb-6">
          Biography
        </h2>
        
        <div className="prose prose-lg prose-slate max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            Hi! I am <strong className="text-primary font-serif font-extrabold text-lg">Ding Wang (Chinese name: 王玎).</strong> I am currently an undergraduate student (Class of 2028) majoring in <strong className="text-primary font-serif font-extrabold">Robotics Engineering</strong> at the prestigious <strong className="text-primary font-serif font-extrabold">Li Zexiang Innovation and Entrepreneurship Class</strong>, Teli College, Beijing Institute of Technology. I serve as the monitor of Class 2453.
          </p>
          <p>
            My academic journey is driven by a passion for innovation and excellence. I have maintained the <strong className="text-primary font-serif font-extrabold">top ranking (1st)</strong> in my major comprehensive evaluation. I have been honored as a University-level Excellent Student and College-level Excellent League Member, and have received both First-class and Second-class University Scholarships.
          </p>
          <p>
            In research, I actively lead cutting-edge projects. I serve as the team captain for two National Innovation Projects: <em>"Physics-Informed Reinforcement Learning Algorithms"</em> and <em>"Quantum-Classical Hybrid Algorithms"</em>. My team has achieved significant recognition, winning <strong className="text-amber-600 font-serif font-extrabold">six national-level awards</strong>.
          </p>
          <p>
            Beyond research, I am the leader of the <strong className="text-primary font-serif font-extrabold">Robocon</strong> National University Robotics Competition (Volleyball Track). I possess strong skills in programming, hardware engineering, and project management. I am deeply enthusiastic about Robotics, Embodied AI, and contributing to the open-source community.
          </p>
          
          <div className="mt-6 mb-2">
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">Research Interests</h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((item) => (
                <span key={item} className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100 hover:bg-blue-100 transition-colors cursor-default shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chinese Version (Collapsible) */}
        <div className="mt-2 border-t border-gray-100 pt-4">
          <button 
            onClick={() => setShowChinese(!showChinese)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full"
          >
            <span className="flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-[10px] font-bold text-gray-600">CN</span>
            Chinese Version (中文简介)
            {showChinese ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {showChinese && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg prose prose-sm prose-slate max-w-none text-gray-600">
              <p className="mt-0">
                北京理工大学特立书院机器人工程（李泽湘双创班）专业 24 级在读本科生，现任 2453 班班长。善于沟通协调，组织开展诸 多班级活动，曾获评校级优秀学生、院级优秀团员，校级一、二等奖学金等荣誉。综合成绩专业第一。
              </p>
              <p>
                作为队长主持 <strong className="text-primary font-serif font-extrabold">“基于物理信息引导的强化学习算法”</strong> 与 <strong className="text-primary font-serif font-extrabold">“量子-经典混合算法探究”</strong> 两项大创项目，共获得第十九届“挑战杯”全国大学生课外学术科技作品竞赛“人工智能+”挑战赛国家级二等奖、全国大学生数学建模大赛国家级二等奖、CIC “悟空杯” 量子计算大赛(量子创新赛道)国家级一等奖等<strong className="text-amber-600 font-serif font-extrabold">六项国家级奖项</strong>。
              </p>
              <p className="mb-0">
                目前作为 <strong className="text-primary font-serif font-extrabold">Robocon</strong> 全国大学生机器人大赛排球赛道的负责人，具有较强的编程能力、硬件能力、以及工程项目管理能力。我热衷于机器人技术、具身人工智能以及为开源社区做贡献。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Grid Section */}
      <section className="grid md:grid-cols-3 gap-6 -mt-10 pt-4 px-2">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif flex items-center gap-2">
            <Mail size={18} className="text-primary" />
            Contact Info
          </h2>
          <div className="space-y-4">
            <div className="group">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">EMAIL</p>
              <a href={`mailto:${profileData.email}`} className="text-gray-700 hover:text-primary hover:underline font-medium break-all transition-colors flex items-center gap-2">
                {profileData.email}
              </a>
            </div>
            
            <div className="group">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">WECHAT</p>
              <p className="text-gray-700 font-medium">WANGD0206</p>
            </div>

            <div className="group">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">OFFICE</p>
              <p className="text-gray-700 font-medium">Interdisciplinary Building, 1F</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif flex items-center gap-2">
            <Code size={18} className="text-primary" />
            Skills
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Programming</span>
              <Code size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Hardware</span>
              <Cpu size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Project Mgmt</span>
              <Users size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Robotics</span>
              <Wrench size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Hobbies */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif flex items-center gap-2">
            <Camera size={18} className="text-primary" />
            Hobbies
          </h2>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby) => (
              <span key={hobby.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 text-xs font-medium hover:bg-white hover:shadow-sm hover:border-primary/20 hover:text-primary transition-all cursor-default">
                <span className="scale-90 opacity-70">{typeof hobby.icon === 'string' ? hobby.icon : hobby.icon}</span>
                {hobby.name}
              </span>
            ))}
          </div>
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
                      <span className="font-bold text-amber-600">
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