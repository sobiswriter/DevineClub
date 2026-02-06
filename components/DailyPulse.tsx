
import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Sun, 
  Moon, 
  Utensils, 
  Mail, 
  AlertTriangle, 
  Clock as ClockIcon, 
  Wind,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  Wifi,
  Zap,
  Droplets,
  Star,
  Info,
  Calendar,
  Flame,
  ShieldCheck,
  TrendingDown,
  X,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { summarizeEmail } from '../geminiService';
import { MailSummary, UserProfile, TimetableEntry } from '../types';

interface DailyPulseProps {
  profile: UserProfile;
  timetable: TimetableEntry[];
}

const DailyPulse: React.FC<DailyPulseProps> = ({ profile, timetable }) => {
  const [emailText, setEmailText] = useState('');
  const [summarizedEmail, setSummarizedEmail] = useState<MailSummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const d = new Date(currentTime);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const isLive = (start: string, end: string) => {
    const startTime = parseTime(start);
    const endTime = parseTime(end);
    return currentTime >= startTime && currentTime <= endTime;
  };

  const getTimeRemaining = (endTimeStr: string) => {
    const endTime = parseTime(endTimeStr);
    const diff = endTime.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Ending...';
    
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s left`;
  };

  const currentClass = timetable.find(t => isLive(t.startTime, t.endTime));

  const messMenu = [
    { 
      type: 'Breakfast', icon: <Coffee size={18} />, start: '07:30 AM', end: '09:30 AM', time: '07:30 - 09:30', 
      menu: 'Aloo Paratha, Curd, Poha, Tea, Milk', crowd: 'Empty', crowdPrediction: 'Steady stream',
      color: 'bg-orange-50 text-orange-600', calories: 450, protein: '12g', allergens: ['Dairy', 'Gluten'],
      tags: ['Veg', 'Popular'], rating: 4.2, reviews: 156
    },
    { 
      type: 'Lunch', icon: <Sun size={18} />, start: '12:30 PM', end: '02:30 PM', time: '12:30 - 14:30', 
      menu: 'Chole Bhature, Paneer Makhani, Rice, Salad', crowd: 'Peak', crowdPrediction: 'Wait time: 8 mins',
      color: 'bg-yellow-50 text-yellow-600', calories: 820, protein: '24g', allergens: ['Nuts', 'Dairy'],
      tags: ['Special Thali', 'Healthy Option'], rating: 4.6, reviews: 412
    },
    { 
      type: 'Snacks', icon: <Utensils size={18} />, start: '05:00 PM', end: '06:15 PM', time: '17:00 - 18:15', 
      menu: 'Bread Pakoda, Masala Chai, Biscuits', crowd: 'Busy', crowdPrediction: 'Clearing in 12 mins',
      color: 'bg-emerald-50 text-emerald-600', calories: 310, protein: '6g', allergens: ['Gluten'],
      tags: ['Quick Bite'], rating: 4.0, reviews: 94
    },
    { 
      type: 'Dinner', icon: <Moon size={18} />, start: '07:45 PM', end: '09:30 PM', time: '19:45 - 21:30', 
      menu: 'Mix Veg, Dal Tadka, Jeera Rice, Gulab Jamun', crowd: 'Busy', crowdPrediction: 'Steady flow',
      color: 'bg-indigo-50 text-indigo-600', calories: 650, protein: '18g', allergens: ['Dairy'],
      tags: ['Sweet Included'], rating: 4.4, reviews: 287
    },
  ];

  const handleSummarize = async () => {
    if (!emailText.trim()) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeEmail(emailText);
      setSummarizedEmail(result);
    } catch (error) {
      console.error("Failed to summarize:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const weeklySchedule = [
    { day: 'Monday', lunch: 'Butter Paneer', dinner: 'Dal Tadka' },
    { day: 'Tuesday', lunch: 'Rajma Rice', dinner: 'Mix Veg' },
    { day: 'Wednesday', lunch: 'Chole Bhature', dinner: 'Aloo Gobhi' },
    { day: 'Thursday', lunch: 'Kadhi Pakoda', dinner: 'Paneer Do Pyaza' },
    { day: 'Friday', lunch: 'Veg Pulao', dinner: 'Soya Chap' },
    { day: 'Saturday', lunch: 'Poori Bhaji', dinner: 'Special Thali' },
    { day: 'Sunday', lunch: 'Veg Biryani', dinner: 'Paneer Lababdar' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Dynamic Class Highlight */}
      {currentClass && (
        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                    <BookOpen size={32} />
                 </div>
                 <div>
                    <div className="flex items-center space-x-2 mb-1">
                       <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Current Session</span>
                    </div>
                    <h3 className="text-2xl font-black">{currentClass.subject}</h3>
                    <p className="text-sm font-medium text-indigo-100 opacity-80">{currentClass.room} · {currentClass.prof}</p>
                 </div>
              </div>
              <div className="bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-md border border-white/20">
                 <p className="text-[10px] font-black uppercase text-indigo-200 mb-1">Time Remaining</p>
                 <div className="text-xl font-black flex items-center min-w-[140px]">
                    <ClockIcon size={18} className="mr-2" />
                    {getTimeRemaining(currentClass.endTime)}
                 </div>
              </div>
           </div>
           <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest">{profile.major} · {profile.year}</span>
                  <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center">
                    <ShieldCheck size={12} className="mr-1" /> Campus ID Verified
                  </span>
                </div>
                <h2 className="text-4xl font-black mb-2 tracking-tight">Welcome back, {profile.name.split(' ')[0]}. ⚡</h2>
                <p className="text-indigo-100/80 max-w-lg font-medium italic">Your GPA Standing is {profile.gpa} • {profile.credits} Credits Earned</p>
              </div>

              <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-right min-w-[180px]">
                <div className="flex items-center justify-end space-x-2 text-indigo-200 mb-1">
                  <ClockIcon size={14} />
                  <span className="text-xs font-black uppercase tracking-widest">System Time</span>
                </div>
                <p className="text-3xl font-black tracking-tighter tabular-nums">{formatTime(currentTime)}</p>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">{formatDate(currentTime)}</p>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Weather</p>
                <p className="font-bold flex items-center">26°C <Wind size={14} className="ml-1 text-sky-300" /></p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Campus WiFi</p>
                <p className="font-bold flex items-center text-emerald-400">Stable <Wifi size={14} className="ml-1" /></p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Power Status</p>
                <p className="font-bold flex items-center text-amber-400">Normal <Zap size={14} className="ml-1" /></p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Today's Load</p>
                <p className="font-bold flex items-center">{timetable.length} Classes</p>
              </div>
            </div>
          </div>
          <Sparkles className="absolute -right-12 -top-12 w-64 h-64 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Nexus Bulletins</h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                 <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Flame size={16} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-800">Festival Alert</p>
                    <p className="text-[10px] text-slate-500">Zeitgeist 2025 registrations are now open!</p>
                 </div>
              </div>
              <div className="flex items-start space-x-3">
                 <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Droplets size={16} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-800">Campus Flow</p>
                    <p className="text-[10px] text-slate-500">Library gate entry speed is normal.</p>
                 </div>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-slate-50 rounded-2xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all">
            View All Alerts
          </button>
        </div>
      </section>

      {/* Mess Menu Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800 flex items-center">
              <Utensils size={26} className="text-indigo-600 mr-3" />
              Main Mess Dashboard
            </h3>
            <p className="text-sm text-slate-500 mt-1">Real-time occupancy and nutrition metrics.</p>
          </div>
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => setShowWeeklyMenu(true)}
               className="hidden md:flex flex-col items-end group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all"
             >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center group-hover:text-indigo-500 transition-colors">
                  Current Mess <ChevronDown size={12} className="ml-1" />
                </span>
                <span className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">Dining Block A</span>
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {messMenu.map((item, idx) => {
            const live = isLive(item.start, item.end);
            return (
              <div key={idx} className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all shadow-sm group flex flex-col h-full relative ${
                live ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.03] z-10' : 'border-slate-100 opacity-70'
              }`}>
                {live && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-ping"></span>
                    Serving Now
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1 text-amber-500 mb-1">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{item.rating}</span>
                        <span className="text-[10px] text-slate-400">({item.reviews})</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.crowd === 'Empty' ? 'bg-emerald-100 text-emerald-700' :
                      item.crowd === 'Busy' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.crowd}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-800 mb-1">{item.type}</h4>
                  <p className={`text-[10px] font-bold uppercase mb-4 flex items-center ${live ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <ClockIcon size={12} className="mr-1" /> {item.time}
                  </p>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-4">
                    {item.menu}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 mt-auto space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="flex items-center"><Flame size={10} className="mr-1 text-orange-500" /> {item.calories} kcal</span>
                      <span>Protein: {item.protein}</span>
                  </div>
                  <div className={`p-2 rounded-xl flex items-center justify-center ${live ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                      <TrendingDown size={14} className="mr-2" />
                      <span className="text-[10px] font-bold">{item.crowdPrediction}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Menu Modal */}
      {showWeeklyMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setShowWeeklyMenu(false)}></div>
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Full Week Planner</h3>
                  <p className="text-sm text-indigo-100 font-medium">Campus Mess Cycle • Spring 2025</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWeeklyMenu(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weeklySchedule.map((item, i) => (
                  <div key={i} className={`p-6 rounded-3xl border-2 transition-all ${
                    currentTime.toLocaleDateString([], { weekday: 'long' }) === item.day 
                      ? 'bg-indigo-50 border-indigo-200' 
                      : 'bg-slate-50 border-transparent hover:border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-black uppercase tracking-widest ${
                        currentTime.toLocaleDateString([], { weekday: 'long' }) === item.day ? 'text-indigo-600' : 'text-slate-400'
                      }`}>
                        {item.day} {currentTime.toLocaleDateString([], { weekday: 'long' }) === item.day && '• Today'}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                          <Sun size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lunch</p>
                          <p className="text-sm font-bold text-slate-800">{item.lunch}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Moon size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dinner</p>
                          <p className="text-sm font-bold text-slate-800">{item.dinner}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced AI Mail Summarizer */}
      <section className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Mail size={120} />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Mail Intelligence</h3>
                <p className="text-sm text-slate-500 font-medium italic">Gemini Pro · NLP Priority & Sentiment</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea 
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste long college-wide emails or announcement newsletters..."
              className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-base font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none resize-none shadow-inner"
            />
            <button 
              onClick={handleSummarize}
              disabled={isSummarizing || !emailText.trim()}
              className="absolute bottom-6 right-6 bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl disabled:opacity-50 flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95"
            >
              {isSummarizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-amber-400" />
                  <span>Synthesize Brief</span>
                </>
              )}
            </button>
          </div>

          {summarizedEmail && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    summarizedEmail.priority === 'high' ? 'bg-red-500 text-white' : 
                    summarizedEmail.priority === 'medium' ? 'bg-amber-500 text-white' :
                    'bg-slate-600 text-white'
                  }`}>
                    {summarizedEmail.priority} Priority
                  </span>
                  <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-600 uppercase flex items-center">
                    <Star size={12} className="mr-1.5 text-indigo-500" /> Sentiment: {summarizedEmail.sentiment}
                  </span>
                  {summarizedEmail.deadline !== 'none' && (
                    <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center shadow-lg shadow-indigo-100">
                      <Calendar size={12} className="mr-1.5" /> Due: {summarizedEmail.deadline}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-2xl font-black text-slate-800 leading-tight">
                    "{summarizedEmail.summary}"
                  </p>
                  <p className="text-sm font-semibold text-indigo-600 flex items-center">
                    <Info size={16} className="mr-2" /> Context: {summarizedEmail.relevanceReason}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200/50">
                  <div className="flex items-center space-x-4">
                    <button className="text-indigo-600 text-sm font-black flex items-center hover:translate-x-1 transition-transform">
                      Sync to Calendar
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default DailyPulse;
