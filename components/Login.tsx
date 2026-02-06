
import React, { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, Github, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a brief network delay for polish
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-[450px] px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/20 mb-6 group transition-all hover:scale-110">
            <Zap size={40} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">PROJECT NEXUS</h1>
          <p className="text-slate-400 font-medium">The Intelligent Campus Ecosystem</p>
        </div>

        <div className="glass-effect bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Student Email / ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@university.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-tighter">Forgot Secret?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 group active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Neural Access</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center justify-center space-x-4">
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <Github size={20} />
              </button>
              <button className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center space-x-2">
                <ShieldCheck size={16} />
                <span>OneAuth Secure Login</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          Designated for Educational Use · Project Nexus v2.1
        </p>
      </div>
    </div>
  );
};

export default Login;
