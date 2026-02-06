
import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Bot, User, Sparkles, RefreshCw, Layers, Trash2 } from 'lucide-react';
import { askNexusAI } from '../geminiService';
import { UserProfile, TimetableEntry, Assignment, MarketplaceItem, ChatMessage } from '../types';

interface NexusAIProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  profile: UserProfile;
  timetable: TimetableEntry[];
  assignments: Assignment[];
  marketplaceItems: MarketplaceItem[];
}

const NexusAI: React.FC<NexusAIProps> = ({ 
  chatHistory, setChatHistory, 
  profile, timetable, assignments, marketplaceItems 
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // Build rich context for the AI
    const liveContext = `
      USER PROFILE:
      - Name: ${profile.name}
      - Major/Year: ${profile.major}, ${profile.year}
      - Credits: ${profile.credits} / 120
      
      TODAY'S TIMETABLE:
      ${timetable.length > 0 ? timetable.map(t => `- ${t.startTime}: ${t.subject} in ${t.room} (${t.type})`).join('\n') : "No classes added yet."}
      
      PENDING ASSIGNMENTS:
      ${assignments.filter(a => a.status !== 'Graded').map(a => `- ${a.title} for ${a.course}`).join('\n') || "None."}
      
      MARKETPLACE STATUS:
      - User has ${marketplaceItems.length} active listings.
    `;

    try {
      const response = await askNexusAI(userMsg, liveContext);
      setChatHistory(prev => [...prev, { role: 'bot', content: response || "I'm having trouble processing that right now." }]);
    } catch (error) {
      console.error("Nexus AI Error:", error);
      setChatHistory(prev => [...prev, { role: 'bot', content: "Connection to Nexus Hub interrupted. Check your network or API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Clear all AI memory and chat history?")) {
      setChatHistory([
        { role: 'bot', content: `Hello ${profile.name.split(' ')[0]}! Memory cleared. How can I help you navigate your day?` }
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-slate-800">Nexus AI Assistant</h3>
            <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-indigo-600 mt-0.5">
               <Layers size={10} className="mr-1" /> Campus Data Synced
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="text-slate-400 hover:text-rose-500 p-2.5 bg-white border border-slate-100 rounded-xl transition-all shadow-sm">
          <Trash2 size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border-2 shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-100 text-slate-600 uppercase font-black text-[10px]'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : "N"}
              </div>
              <div className={`p-4 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 font-black text-[10px]">
                N
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] rounded-bl-none flex space-x-2 shadow-sm border border-slate-100">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-200">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything... 'What is my GPA?' or 'When is my next class?'"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-4 text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
          <Sparkles size={10} className="inline mr-1 text-amber-500" />
          Gemini 3 Pro Context-Aware Engine · Live Memory Active
        </p>
      </div>
    </div>
  );
};

export default NexusAI;
