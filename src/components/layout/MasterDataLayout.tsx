import React from 'react';
import { ChevronLeft, Search, List, LayoutDashboard, Plus, LogOut } from 'lucide-react';
import { ShortcutConfig } from '../../types';

interface MasterDataLayoutProps {
  title: string;
  icon: any;
  setView: (v: any) => void;
  onAdd?: () => void;
  displayMode?: 'list' | 'grid';
  onToggleMode?: () => void;
  children: React.ReactNode;
  shortcuts: Record<string, ShortcutConfig>;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  controls?: React.ReactNode;
}

export const MasterDataLayout = ({ 
  title, 
  icon: Icon, 
  setView, 
  onAdd, 
  displayMode, 
  onToggleMode, 
  children, 
  shortcuts, 
  searchQuery, 
  onSearchChange, 
  controls 
}: MasterDataLayoutProps) => (
  <div className="flex-1 flex flex-col bg-black overflow-hidden relative font-sans selection:bg-blue-600/30">
    <div className="px-8 py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 flex justify-between items-center shrink-0 z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] ring-1 ring-white/10">
            <Icon size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{title}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
               <span className="w-6 h-[1.5px] bg-blue-600"></span> RESOURCE_SYSTEM // NODE_ACTIVE
            </p>
          </div>
        </div>
      </div>
      
      {onSearchChange !== undefined && (
        <div className="flex-1 max-w-2xl mx-12">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-all duration-300" size={18} />
            <input 
              type="text"
              placeholder="SEARCH SYSTEM REGISTRY..."
              className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-mono text-white focus:bg-slate-900/60 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 outline-none uppercase placeholder:text-slate-800 transition-all"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {controls}
        {onToggleMode && (
          <button onClick={onToggleMode} className="w-12 h-12 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm text-slate-500 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-all shadow-lg active:scale-95">
            {displayMode === 'grid' ? <List size={22}/> : <LayoutDashboard size={22}/>}
          </button>
        )}
        {onAdd && (
          <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 rounded-2xl flex items-center gap-4 transition-all active:scale-95 shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={20} className="stroke-[3] group-hover:rotate-90 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">New_Entry</span>
          </button>
        )}
      </div>
    </div>
    <div className="flex-1 overflow-auto custom-scrollbar z-10 p-10">
      <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          {children}
      </div>
    </div>
  </div>
);
