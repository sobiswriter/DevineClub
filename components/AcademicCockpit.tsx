
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  GraduationCap, 
  Plus, 
  Sparkles,
  TrendingUp,
  BarChart3,
  Layers,
  Users,
  AlertTriangle,
  ChevronRight,
  Flame,
  Brain,
  Award,
  BookMarked,
  Target,
  BarChart,
  RefreshCw,
  Zap,
  MoreVertical,
  Activity,
  History,
  X,
  Trash2,
  Upload,
  PieChart,
  Trophy,
  ShieldCheck,
  Layout,
  LineChart,
  Lightbulb
} from 'lucide-react';
import { generateStudyPlan, generateFlashcards, predictTopicDifficulty } from '../geminiService';
import { TimetableEntry, Assignment, Material, UserProfile } from '../types';

interface AcademicCockpitProps {
  profile: UserProfile;
  timetable: TimetableEntry[];
  setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const AcademicCockpit: React.FC<AcademicCockpitProps> = ({ 
  profile,
  timetable, setTimetable, 
  assignments, setAssignments, 
  materials, setMaterials 
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'lms' | 'intelligence'>('intelligence');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // AI Tools State
  const [examSubject, setExamSubject] = useState('');
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [difficultyData, setDifficultyData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);

  // Modals
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // Form Refs & States
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

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

  const getSortedTimetable = () => {
    return [...timetable].sort((a, b) => {
      const aLive = isLive(a.startTime, a.endTime);
      const bLive = isLive(b.startTime, b.endTime);
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;
      return parseTime(a.startTime).getTime() - parseTime(b.startTime).getTime();
    });
  };

  const addTimetableEntry = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEntry = {
      id: Date.now(),
      startTime: formData.get('start') as string,
      endTime: formData.get('end') as string,
      subject: formData.get('subject') as string,
      room: formData.get('room') as string,
      occupancy: Math.floor(Math.random() * 100),
      prof: formData.get('prof') as string,
      officeHours: 'TBA',
      type: formData.get('type') as string
    };
    setTimetable([...timetable, newEntry]);
    setIsTimetableModalOpen(false);
  };

  const removeTimetableEntry = (id: number) => {
    setTimetable(timetable.filter(t => t.id !== id));
  };

  const addAssignment = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEntry = {
      id: Date.now(),
      title: formData.get('title') as string,
      course: formData.get('course') as string,
      status: 'Pending',
      points: formData.get('points') ? Number(formData.get('points')) : null,
      color: 'indigo'
    };
    setAssignments([...assignments, newEntry]);
    setIsAssignmentModalOpen(false);
  };

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > 5) {
        alert("File too large! Keep it under 5MB for campus sync.");
        return;
      }
      const newMaterial = {
        id: Date.now(),
        name: file.name,
        size: `${sizeMB.toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
      };
      setMaterials([...materials, newMaterial]);
    }
  };

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleGeneratePlan = async () => {
    if (!examSubject.trim()) return;
    setIsGenerating(true);
    setStudyPlan(null);
    setDifficultyData(null);
    try {
      const plan = await generateStudyPlan(examSubject, "7 days");
      const difficulty = await predictTopicDifficulty(examSubject);
      setStudyPlan(plan);
      setDifficultyData(difficulty);
    } catch (error) {
      console.error("AI Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!flashcardTopic.trim()) return;
    setIsGeneratingFlashcards(true);
    setFlashcards([]);
    try {
      const result = await generateFlashcards(flashcardTopic);
      setFlashcards(result);
    } catch (error) {
      console.error("Flashcard generation error:", error);
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-sans animate-in fade-in duration-700">
      
      {/* View Switcher */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          {[
            { id: 'overview', label: 'Dashboard', icon: <Activity size={16} /> },
            { id: 'lms', label: 'LMS Lite', icon: <Layers size={16} /> },
            { id: 'intelligence', label: 'Intel Hub', icon: <Brain size={16} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-black transition-all ${
                activeView === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Live Command Timetable</h3>
                  <p className="text-sm text-slate-500 font-bold">Priority View: Live Sessions pinned to top</p>
                </div>
                <button onClick={() => setIsTimetableModalOpen(true)} className="flex items-center space-x-2 text-indigo-600 font-black text-sm bg-indigo-50 px-4 py-2 rounded-2xl hover:bg-indigo-100 transition-all">
                  <Plus size={18} />
                  <span>Add Slot</span>
                </button>
              </div>

              <div className="space-y-6">
                {getSortedTimetable().map((item) => {
                  const active = isLive(item.startTime, item.endTime);
                  return (
                    <div key={item.id} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col md:flex-row md:items-center gap-8 group relative ${
                      active ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-[1.02]' : 'bg-slate-50 border-transparent'
                    }`}>
                      {active && (
                        <div className="absolute -top-3 left-8 bg-white text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center z-10">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-ping"></span>
                          Live Now
                        </div>
                      )}
                      
                      <div className="flex items-center gap-6 shrink-0">
                         <div className={`w-16 h-16 rounded-3xl flex flex-col items-center justify-center font-black ${active ? 'bg-white/20 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                           <Clock size={20} className="mb-1" />
                           <span className="text-[10px]">{item.startTime.split(' ')[0]}</span>
                         </div>
                         <div>
                            <p className={`text-xl font-black ${active ? 'text-white' : 'text-slate-800'}`}>{item.subject}</p>
                            <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-indigo-100' : 'text-slate-400'}`}>{item.type} · {item.prof}</p>
                         </div>
                      </div>

                      <div className="flex-1 flex flex-wrap gap-4 items-center">
                         <div className={`px-4 py-2 rounded-2xl flex items-center space-x-2 ${active ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                            <Calendar size={14} />
                            <span className="text-[10px] font-black uppercase tracking-tight">Room: {item.room}</span>
                         </div>
                      </div>

                      <button onClick={() => removeTimetableEntry(item.id)} className={`p-4 rounded-2xl transition-all ${active ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'}`}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'lms' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-slate-800">Assignment Command</h3>
                      <button onClick={() => setIsAssignmentModalOpen(true)} className="flex items-center space-x-2 text-indigo-600 font-black text-sm bg-indigo-50 px-4 py-2 rounded-2xl hover:bg-indigo-100 transition-all">
                         <span>Log Grade</span>
                         <Plus size={18} />
                      </button>
                   </div>
                   
                   <div className="space-y-4">
                      {assignments.map((item) => (
                        <div key={item.id} className="p-6 bg-slate-50 rounded-[2rem] flex items-center justify-between hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all group">
                           <div>
                              <p className="text-lg font-black text-slate-800">{item.title}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.course} · {item.status}</p>
                           </div>
                           <div className="flex items-center space-x-6">
                              {item.points !== null && (
                                <div className="text-right">
                                   <p className="text-xl font-black text-slate-800">{item.points}<span className="text-xs text-slate-400">/100</span></p>
                                </div>
                              )}
                              <button onClick={() => removeAssignment(item.id)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
                                 <Trash2 size={20} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-black text-slate-800 flex items-center">
                        <BookMarked size={22} className="text-indigo-600 mr-3" />
                        Material Repo
                      </h4>
                      <button onClick={() => fileInputRef.current?.click()} className="p-2 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                        <Upload size={18} />
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                   </div>
                   <div className="space-y-4">
                      {materials.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-indigo-50 transition-all">
                           <div>
                              <p className="text-sm font-bold text-slate-800">{file.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</p>
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); removeMaterial(file.id); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                            <X size={14} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeView === 'intelligence' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           {/* Row 1: Analytics & Achievements */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-2xl font-black text-slate-800">Performance Metrics</h3>
                       <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Live Credit & Grade Sync</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-black text-xl flex items-center">
                       <TrendingUp size={20} className="mr-2" />
                       {profile.gpa} GPA
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between items-end mb-3">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Degree Progress</p>
                             <p className="text-sm font-black text-slate-800">{profile.credits} / 120 Credits</p>
                          </div>
                          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-100" style={{ width: `${(profile.credits / 120) * 100}%` }}></div>
                          </div>
                       </div>
                       
                       <div className="space-y-4 pt-4">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Grade Distribution (Recent)</p>
                          <div className="flex items-end gap-3 h-32 pt-4">
                             {assignments.filter(a => a.points !== null).slice(0, 5).map((a, i) => (
                               <div key={i} className="flex-1 flex flex-col items-center group">
                                  <div className="w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-t-xl transition-all relative overflow-hidden" style={{ height: `${a.points}%` }}>
                                     <div className="absolute top-2 left-0 right-0 text-[10px] font-black text-center text-indigo-800 group-hover:text-white">{a.points}</div>
                                  </div>
                                  <div className="text-[8px] font-black text-slate-400 mt-2 rotate-45 origin-left whitespace-nowrap">{a.course}</div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-center">
                       <div className="text-center space-y-2 mb-6">
                          <p className="text-4xl font-black text-indigo-600">88%</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Consistency</p>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                          <div className="flex items-center space-x-3">
                             <ShieldCheck className="text-emerald-500" size={20} />
                             <span className="text-xs font-bold text-slate-600">Verification Rate</span>
                          </div>
                          <span className="text-sm font-black text-emerald-600">99.2%</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden group">
                 <h4 className="text-xl font-black mb-8 flex items-center">
                    <Award size={24} className="text-amber-400 mr-3" />
                    Nexus Credentials
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Zap size={20} />, label: 'Fast Learner', color: 'bg-indigo-600' },
                      { icon: <ShieldCheck size={20} />, label: 'Attendance Hero', color: 'bg-emerald-600' },
                      { icon: <Target size={20} />, label: 'High Flyer', color: 'bg-amber-600' },
                      { icon: <Trophy size={20} />, label: 'Dean\'s List', color: 'bg-rose-600' },
                    ].map((badge, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-3 hover:bg-white/10 transition-all cursor-pointer">
                         <div className={`w-12 h-12 ${badge.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            {badge.icon}
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{badge.label}</p>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                    View Full Transcript
                 </button>
              </div>
           </div>

           {/* Row 2: AI Planning & Flashcards */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Study Plan Generator */}
              <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-2xl font-black text-slate-800 flex items-center">
                       <Calendar size={26} className="text-indigo-600 mr-3" />
                       Study Plan Oracle
                    </h4>
                    <Sparkles className="text-amber-400" size={20} />
                 </div>
                 
                 <div className="flex gap-4 mb-8">
                    <input 
                       type="text" 
                       value={examSubject}
                       onChange={(e) => setExamSubject(e.target.value)}
                       placeholder="Enter Subject (e.g. Distributed Systems)"
                       className="flex-1 bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl font-bold outline-none focus:border-indigo-600 transition-all"
                    />
                    <button 
                       onClick={handleGeneratePlan}
                       disabled={isGenerating || !examSubject.trim()}
                       className="bg-indigo-600 text-white px-8 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
                    >
                       {isGenerating ? <RefreshCw className="animate-spin" /> : "Build Strategy"}
                    </button>
                 </div>

                 <div className="flex-1 max-h-[400px] overflow-y-auto no-scrollbar space-y-4">
                    {isGenerating ? (
                       <div className="space-y-4 p-4">
                          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>)}
                       </div>
                    ) : studyPlan ? (
                       <div className="space-y-6">
                          {difficultyData && (
                             <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between">
                                <div>
                                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Subject Complexity</p>
                                   <div className="flex gap-1">
                                      {[...Array(10)].map((_, i) => (
                                         <div key={i} className={`h-2 w-4 rounded-full ${i < (difficultyData.difficulty || 5) ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                                      ))}
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Risk Level</p>
                                   <p className="font-black text-rose-400">Moderate High</p>
                                </div>
                             </div>
                          )}
                          <div className="space-y-4">
                             {studyPlan.milestones?.map((m: any, i: number) => (
                                <div key={i} className="p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 flex items-center space-x-6">
                                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-slate-100">
                                      {m.day.split(' ')[1] || (i+1)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-800">{m.topic}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration: {m.duration}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10">
                          <Layout size={60} className="mb-4" />
                          <p className="font-bold text-slate-400">Choose a subject to generate a customized 7-day high-performance study schedule.</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Flashcard Lab */}
              <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-2xl font-black text-slate-800 flex items-center">
                       <Zap size={26} className="text-amber-500 mr-3" />
                       Flashcard Lab
                    </h4>
                    <Lightbulb className="text-indigo-600" size={20} />
                 </div>

                 <div className="flex gap-4 mb-8">
                    <input 
                       type="text" 
                       value={flashcardTopic}
                       onChange={(e) => setFlashcardTopic(e.target.value)}
                       placeholder="What's the topic? (e.g. DNS)"
                       className="flex-1 bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl font-bold outline-none focus:border-indigo-600 transition-all"
                    />
                    <button 
                       onClick={handleGenerateFlashcards}
                       disabled={isGeneratingFlashcards || !flashcardTopic.trim()}
                       className="bg-amber-500 text-white px-8 rounded-2xl font-black text-sm shadow-xl hover:bg-amber-600 disabled:opacity-50 transition-all"
                    >
                       {isGeneratingFlashcards ? <RefreshCw className="animate-spin" /> : "Synthesize"}
                    </button>
                 </div>

                 <div className="flex-1 max-h-[400px] overflow-y-auto no-scrollbar space-y-4">
                    {isGeneratingFlashcards ? (
                       <div className="space-y-4 p-4">
                          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>)}
                       </div>
                    ) : flashcards.length > 0 ? (
                       <div className="space-y-4">
                          {flashcards.map((card, i) => (
                             <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-all group">
                                <div className="space-y-3">
                                   <div className="flex items-start justify-between">
                                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Q: {i+1}</span>
                                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-slate-300">
                                         <Plus size={12} />
                                      </div>
                                   </div>
                                   <p className="text-sm font-black text-slate-800">{card.front}</p>
                                   <div className="pt-4 border-t border-slate-200/50">
                                      <p className="text-xs font-bold text-slate-500">{card.back}</p>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10">
                          <Layers size={60} className="mb-4" />
                          <p className="font-bold text-slate-400">Enter a topic to generate AI-curated high-yield study flashcards for quick revision.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modals */}
      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsTimetableModalOpen(false)}></div>
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative p-10 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-slate-800 mb-6">Add Schedule Block</h3>
              <form onSubmit={addTimetableEntry} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <input name="start" type="text" placeholder="Start (e.g. 09:00 AM)" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                    <input name="end" type="text" placeholder="End (e.g. 10:00 AM)" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                 </div>
                 <input name="subject" type="text" placeholder="Subject Name" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                 <input name="room" type="text" placeholder="Room (LHC-301)" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                 <input name="prof" type="text" placeholder="Professor" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                 <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl">Register Slot</button>
              </form>
           </div>
        </div>
      )}

      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAssignmentModalOpen(false)}></div>
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative p-10 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-slate-800 mb-6">Log Assignment/Grade</h3>
              <form onSubmit={addAssignment} className="space-y-6">
                 <input name="title" type="text" placeholder="Assignment Title" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                 <input name="course" type="text" placeholder="Course Code" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" required />
                 <input name="points" type="number" placeholder="Grade (0-100)" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold" />
                 <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl">Log Data</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCockpit;
