
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Compass, 
  BookOpen, 
  MessageSquare, 
  Menu, 
  X, 
  Bell, 
  Search,
  Zap,
  User,
  LogOut,
  ChevronRight,
  Settings,
  ShieldCheck,
  Award
} from 'lucide-react';
import DailyPulse from './components/DailyPulse';
import StudentExchange from './components/StudentExchange';
import ExplorersGuide from './components/ExplorersGuide';
import AcademicCockpit from './components/AcademicCockpit';
import NexusAI from './components/NexusAI';
import Login from './components/Login';
import { UserProfile, TimetableEntry, Assignment, MarketplaceItem, LostFoundItem, Material, ChatMessage } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('pulse');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Persistence State with Rich Dummy Data Fallbacks
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexus_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Aryan Sharma',
      major: 'B.Tech Computer Science',
      year: 'Year 3',
      gpa: 3.82,
      credits: 104
    };
  });

  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('nexus_timetable');
    return saved ? JSON.parse(saved) : [
      { id: 1, startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Advanced Algorithms', room: 'LHC-201', occupancy: 42, prof: 'Dr. S. Sharma', officeHours: 'Mon 15:00', type: 'Lecture' },
      { id: 2, startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Database Systems', room: 'LHC-102', occupancy: 65, prof: 'Prof. R. Mehta', officeHours: 'Tue 14:00', type: 'Lecture' },
      { id: 3, startTime: '11:00 AM', endTime: '12:30 PM', subject: 'Machine Learning Lab', room: 'CS-Lab 3', occupancy: 15, prof: 'Prof. J. Kaur', officeHours: 'Wed 11:00', type: 'Lab' },
      { id: 4, startTime: '02:00 PM', endTime: '03:00 PM', subject: 'Cloud Computing', room: 'LHC-104', occupancy: 88, prof: 'Dr. V. Gupta', officeHours: 'Fri 14:00', type: 'Tutorial' },
      { id: 5, startTime: '03:00 PM', endTime: '04:30 PM', subject: 'Software Engineering', room: 'LHC-202', occupancy: 30, prof: 'Dr. Amit K.', officeHours: 'Thu 10:00', type: 'Lecture' },
      { id: 6, startTime: '05:00 PM', endTime: '06:00 PM', subject: 'Professional Ethics', room: 'LHC-101', occupancy: 95, prof: 'Prof. S. Das', officeHours: 'Fri 16:00', type: 'Lecture' }
    ];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('nexus_assignments');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Distributed Systems Project', course: 'CS-402', status: 'Pending', points: 100, color: 'indigo' },
      { id: 2, title: 'Lab Record 4', course: 'ML-Lab', status: 'Graded', points: 45, color: 'emerald' },
      { id: 3, title: 'Mid-Term Reflection Paper', course: 'HUM-Ethics', status: 'Submitted', points: null, color: 'amber' },
      { id: 4, title: 'Algorithm Problem Set 3', course: 'CS-301', status: 'Pending', points: 50, color: 'indigo' },
      { id: 5, title: 'Database Schema Design', course: 'CS-202', status: 'Graded', points: 92, color: 'emerald' },
      { id: 6, title: 'Cloud Infrastructure Setup', course: 'CS-405', status: 'Submitted', points: null, color: 'amber' }
    ];
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('nexus_marketplace');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Calculus Made Easy', price: 1800, seller: 'Alice R.', image: 'https://picsum.photos/400/300?random=1', category: 'Books', description: 'Great for midterm prep.' },
      { id: 2, title: 'Mechanical Keyboard RGB', price: 2450, seller: 'Bob M.', image: 'https://picsum.photos/400/300?random=2', category: 'Electronics', description: 'Blue switches, very clicky.' }
    ];
  });

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(() => {
    const saved = localStorage.getItem('nexus_lostfound');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'found', title: 'Keys with Keychain', location: 'Canteen Area', date: 'Oct 23', category: 'Keys', description: 'Small rubber duck keychain.', image: 'https://picsum.photos/400/300?random=11', reporter: 'Security' }
    ];
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('nexus_materials');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Lecture_Notes_Algorithms_V2.pdf', size: '2.4 MB', type: 'PDF' },
      { id: 2, name: 'ML_Dataset_Final.zip', size: '3.1 MB', type: 'DATA' },
      { id: 3, name: 'Exam_Pattern_2025.docx', size: '0.4 MB', type: 'DOC' },
      { id: 4, name: 'Cloud_Computing_Labs.pdf', size: '1.8 MB', type: 'PDF' }
    ];
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('nexus_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'bot', content: `Hello Aryan! I'm Nexus AI. I've analyzed your ${timetable.length} classes for today and your ${assignments.filter(a => a.status === 'Pending').length} pending assignments. How can I help you navigate your day?` }
    ];
  });

  // Load Auth
  useEffect(() => {
    const auth = localStorage.getItem('nexus_auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexus_profile', JSON.stringify(profile));
    localStorage.setItem('nexus_timetable', JSON.stringify(timetable));
    localStorage.setItem('nexus_assignments', JSON.stringify(assignments));
    localStorage.setItem('nexus_marketplace', JSON.stringify(marketplaceItems));
    localStorage.setItem('nexus_lostfound', JSON.stringify(lostFoundItems));
    localStorage.setItem('nexus_materials', JSON.stringify(materials));
    localStorage.setItem('nexus_chat_history', JSON.stringify(chatHistory));
  }, [profile, timetable, assignments, marketplaceItems, lostFoundItems, materials, chatHistory]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('nexus_auth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('nexus_auth');
  };

  const tabs = [
    { id: 'pulse', label: 'Daily Pulse', icon: <Home size={22} /> },
    { id: 'exchange', label: 'Student Exchange', icon: <ShoppingBag size={22} /> },
    { id: 'guide', label: 'Explorer\'s Guide', icon: <Compass size={22} /> },
    { id: 'cockpit', label: 'Academic Cockpit', icon: <BookOpen size={22} /> },
    { id: 'nexus-ai', label: 'Nexus AI', icon: <Zap size={22} className="text-orange-500" /> },
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'pulse': return <DailyPulse profile={profile} timetable={timetable} />;
      case 'exchange': return (
        <StudentExchange 
          marketplaceItems={marketplaceItems} 
          setMarketplaceItems={setMarketplaceItems}
          lostFoundItems={lostFoundItems}
          setLostFoundItems={setLostFoundItems}
        />
      );
      case 'guide': return <ExplorersGuide />;
      case 'cockpit': return (
        <AcademicCockpit 
          profile={profile}
          timetable={timetable} 
          setTimetable={setTimetable}
          assignments={assignments}
          setAssignments={setAssignments}
          materials={materials}
          setMaterials={setMaterials}
        />
      );
      case 'nexus-ai': return (
        <NexusAI 
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          profile={profile} 
          timetable={timetable} 
          assignments={assignments} 
          marketplaceItems={marketplaceItems} 
        />
      );
      default: return <DailyPulse profile={profile} timetable={timetable} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-72 bg-white border-r border-slate-200`}>
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">PROJECT NEXUS</h1>
            <p className="text-xs text-slate-500 font-medium">Campus Super-App</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="font-semibold text-sm">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="flex flex-col space-y-2 p-3 bg-slate-50 rounded-2xl relative group">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
            >
              <Settings size={14} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm shrink-0 uppercase">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 overflow-hidden pr-4">
                <p className="text-sm font-bold text-slate-800 truncate">{profile.name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase truncate">{profile.major} · {profile.year}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 p-1.5"><LogOut size={16} /></button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200">
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600"><Menu size={24} /></button>
            <span className="ml-3 font-bold text-slate-800">Nexus</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Global search campus hub..." className="w-full bg-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 bg-slate-100 text-slate-600 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-6 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] p-4 animate-in zoom-in-95 duration-200">
                <h3 className="font-bold text-slate-800 mb-4">Pulse Notifications</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50 rounded-xl text-xs font-medium text-indigo-700">Class starts in 15 mins!</div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden flex h-20 bg-white border-t border-slate-200">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`}>
              {tab.icon}
              <span className="text-[10px] font-bold mt-1">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsProfileModalOpen(false)}></div>
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative p-10 animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
                <User className="mr-3 text-indigo-600" />
                Identity Config
              </h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl font-bold focus:border-indigo-600 outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Academic Major</label>
                    <input 
                      type="text" 
                      value={profile.major}
                      onChange={(e) => setProfile({...profile, major: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl font-bold focus:border-indigo-600 outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Current Year</label>
                    <select 
                      value={profile.year}
                      onChange={(e) => setProfile({...profile, year: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl font-bold focus:border-indigo-600 outline-none transition-all appearance-none"
                    >
                      <option>Year 1</option>
                      <option>Year 2</option>
                      <option>Year 3</option>
                      <option>Year 4</option>
                      <option>M.Tech / PhD</option>
                    </select>
                 </div>
                 <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   Update Records
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
