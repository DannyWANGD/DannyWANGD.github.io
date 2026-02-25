import React, { useState } from 'react';
import profileData from '../data/profile.json';
import { 
  Mail, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Trophy, 
  Users, 
  Brain, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Code,
  Wrench,
  Camera,
  BookOpen,
  PenTool
} from 'lucide-react';

const About: React.FC = () => {
  const [showChinese, setShowChinese] = useState(false);

  const interests = [
    "Embodied AI",
    "Robot Manipulation",
    "Model-based RL",
    "Generative Models"
  ];

  const hobbies = [
    { name: "Calligraphy", icon: <PenTool size={16} /> },
    { name: "Reading", icon: <BookOpen size={16} /> },
    { name: "Soccer", icon: "⚽" },
    { name: "Poetry", icon: "📜" },
    { name: "Photography", icon: <Camera size={16} /> },
    { name: "Ball Games", icon: "🏓" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 py-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start border-b border-gray-100 pb-12">
        <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
          <img 
            src={profileData.avatar} 
            alt={profileData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center md:text-left flex-1 space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{profileData.name}</h1>
            <p className="text-xl text-primary font-medium mt-2">{profileData.title}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Users size={14} className="text-primary" />
              Class Monitor
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

          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0 text-lg">
            Undergraduate student at <strong className="text-gray-900">Beijing Institute of Technology</strong>, 
            Teli College (Li Zexiang Innovation Class). 
            Passionate about building intelligent robots that can perceive and interact with the world.
          </p>
        </div>
      </div>

      {/* Main Biography (English) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1 h-8 bg-primary rounded-full"></span>
          Biography
        </h2>
        <div className="prose prose-lg prose-slate max-w-none text-gray-600">
          <p>
            I am currently an undergraduate student (Class of 2028) majoring in <strong>Robotics Engineering</strong> at the prestigious <strong>Li Zexiang Innovation and Entrepreneurship Class</strong>, Teli College, Beijing Institute of Technology. I serve as the monitor of Class 2453.
          </p>
          <p>
            My academic journey is driven by a passion for innovation and excellence. I have maintained the <strong>top ranking (1st)</strong> in my major comprehensive evaluation. I have been honored as a University-level Excellent Student and College-level Excellent League Member, and have received both First-class and Second-class University Scholarships.
          </p>
          <p>
            In research, I actively lead cutting-edge projects. I serve as the team captain for two National Innovation Projects: <em>"Physics-Informed Reinforcement Learning Algorithms"</em> and <em>"Quantum-Classical Hybrid Algorithms"</em>. My team has achieved significant recognition, winning <strong>six national-level awards</strong>, including:
          </p>
          <ul className="grid md:grid-cols-2 gap-2 text-base">
            <li>🏆 <strong>National First Prize</strong> - CIC "Wukong Cup" Quantum Computing Competition</li>
            <li>🥈 <strong>National Second Prize</strong> - "Challenge Cup" AI Track</li>
            <li>🥈 <strong>National Second Prize</strong> - CUMCM (Math Modeling)</li>
          </ul>
          <p>
            Beyond research, I am the leader of the <strong>Robocon</strong> National University Robotics Competition (Volleyball Track). I possess strong skills in programming, hardware engineering, and project management. I am deeply enthusiastic about Robotics, Embodied AI, and contributing to the open-source community.
          </p>
        </div>
      </div>

      {/* Chinese Version (Collapsible) */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button 
          onClick={() => setShowChinese(!showChinese)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <span className="font-semibold text-gray-900 flex items-center gap-2">
            🇨🇳 Chinese Version (中文简介)
          </span>
          {showChinese ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </button>
        
        {showChinese && (
          <div className="p-6 bg-white prose prose-slate max-w-none border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mt-0">个人简介</h3>
            <p>
              北京理工大学特立书院机器人工程（李泽湘双创班）专业 24 级在读本科生，现任 2453 班班长。善于沟通协调，组织开展诸 多班级活动，曾获评校级优秀学生、院级优秀团员，校级一、二等奖学金等荣誉。综合成绩专业第一。
            </p>
            <p>
              作为队长主持 “基于物理信息引导的强化学习算法……” 与 “量子-经典混合算法探究……” 两项大创项目，共获得第十九届“挑战杯”全国大学生课外学术科技作品竞赛“人工智能+”挑战赛国家级二等奖、全国大学生数学建模大赛国家级二等奖、CIC “悟空杯” 量子计算大赛(量子创新赛道)国家级一等奖等六项国家级奖项。
            </p>
            <p>
              目前作为 Robocon 全国大学生机器人大赛排球赛道的负责人，具有较强的编程能力、硬件能力、以及工程项目管理能力。我热衷于机器人技术、具身人工智能以及为开源社区做贡献。
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-12 pt-4">
        {/* Interests & Skills */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Research Interests</h2>
          <div className="flex flex-wrap gap-3">
            {interests.map((item) => (
              <span key={item} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100 hover:bg-blue-100 transition-colors cursor-default">
                {item}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 pt-4">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Code size={18} className="text-primary" />
              <span>Programming</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Cpu size={18} className="text-primary" />
              <span>Hardware</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={18} className="text-primary" />
              <span>Project Management</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Wrench size={18} className="text-primary" />
              <span>Robotics</span>
            </div>
          </div>
        </div>

        {/* Contact & Hobbies */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Contact Info</h2>
          <div className="space-y-4">
            <a href={`mailto:${profileData.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                <p className="text-gray-900 font-medium group-hover:text-primary underline decoration-primary/30 underline-offset-4">{profileData.email}</p>
              </div>
            </a>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">WeChat</p>
                <p className="text-gray-900 font-medium">WANGD0206</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Office</p>
                <p className="text-gray-900 font-medium">Interdisciplinary Building, 1F</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 pt-4">Hobbies</h2>
          <div className="flex flex-wrap gap-3">
            {hobbies.map((hobby) => (
              <span key={hobby.name} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md border border-gray-200 text-sm hover:bg-white hover:shadow-sm transition-all">
                <span>{typeof hobby.icon === 'string' ? hobby.icon : hobby.icon}</span>
                {hobby.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;