import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  Activity, 
  ShieldCheck, 
  Database,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  DollarSign,
  Clock
} from 'lucide-react';
import { User } from '../../types';

interface MainMenuProps {
  onSelectModule: (v: any) => void;
  user: User;
  onLogout?: () => void;
}

export const MainMenu = ({ onSelectModule, user }: MainMenuProps) => {
  const stats = [
    { label: 'Today\'s Sales', value: 'Rp 14,250,500', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'blue' },
    { label: 'Total Transactions', value: '142', trend: '+8', isUp: true, icon: ShoppingCart, color: 'emerald' },
    { label: 'Active Customers', value: '1,280', trend: '-2', isUp: false, icon: Users, color: 'purple' },
    { label: 'Low Stock Items', value: '12', trend: 'Critical', isUp: false, icon: Package, color: 'orange' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-black font-sans overflow-hidden p-10">
      <div className="max-w-7xl mx-auto w-full space-y-10">
        {/* WELCOME SECTION */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Dashboard Summary</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node // {user.username}_TERMINAL</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
          <div className="flex bg-slate-900 ring-1 ring-white/5 p-4 rounded-2xl items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Last_Sync</span>
                <span className="text-sm font-black text-white font-mono leading-none">0.2ms ago</span>
             </div>
             <div className="h-8 w-px bg-white/5"></div>
             <button onClick={() => onSelectModule('pos')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-blue-600/30">
                <ShoppingCart size={16} /> Launch Terminal
             </button>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] group hover:bg-slate-900/60 transition-all cursor-default">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-${stat.color}-500 shadow-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} />
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-black ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'} bg-black/40 px-3 py-1.5 rounded-full border border-white/5`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <p className="text-2xl font-black text-white font-mono tracking-tighter leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY & SYSTEM STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Real_Time_Log_Stream</h3>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
              </div>
            </div>
            <div className="p-8 space-y-6">
               {[1,2,3,4].map(idx => (
                 <div key={idx} className="flex items-center gap-6 group">
                   <div className="w-10 h-10 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-slate-600 font-mono text-[10px] font-black group-hover:text-blue-500 transition-colors">
                      {idx.toString().padStart(2, '0')}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black text-white uppercase tracking-tight">TRANSACTION_PROCESSED_V{idx}</p>
                      <p className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-widest">Client_Auth: WALK_IN_REG_00{idx} // Rp 450.000</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-slate-700 font-mono uppercase tracking-tighter">{idx}2:3{idx} PM</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
             <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-blue-600/30">
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck size={24} className="opacity-80" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">System_Security</span>
                   </div>
                   <p className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">Node_Active & Fully_Synchronized</p>
                   <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-full animate-pulse"></div>
                   </div>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                   <Hexagon size={200} />
                </div>
             </div>

             <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-slate-950 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                      <Activity size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Latency</p>
                      <p className="text-2xl font-black text-white font-mono tracking-tighter leading-none">0.02ms</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-slate-950 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                      <Database size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Storage</p>
                      <p className="text-2xl font-black text-white font-mono tracking-tighter leading-none">42.8 GB / 1TB</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-slate-950 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">
                      <Clock size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Uptime</p>
                      <p className="text-2xl font-black text-white font-mono tracking-tighter leading-none">148:12:05</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hexagon = ({ size, ...props }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);
