import React from 'react';
import { Tags, Edit3, Trash2 } from 'lucide-react';
import { Category, ShortcutConfig } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface MasterDataProps<T> {
  data: T[];
  onEdit: (item: T) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  setView: (v: any) => void;
}

interface CategoriesViewProps extends MasterDataProps<Category> {
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  displayMode: 'list' | 'grid';
  onToggleMode: () => void;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  shortcuts: Record<string, ShortcutConfig>;
}

export const CategoriesView = ({ 
  data, onEdit, onAdd, onDelete, setView, selectedIndex, setSelectedIndex, displayMode, onToggleMode,
  searchQuery, onSearchChange, shortcuts
}: CategoriesViewProps) => (
  <MasterDataLayout 
    title="Taxonomy Matrix" 
    icon={Tags} 
    setView={setView} 
    onAdd={onAdd} 
    displayMode={displayMode} 
    onToggleMode={onToggleMode}
    shortcuts={shortcuts}
    searchQuery={searchQuery}
    onSearchChange={onSearchChange}
  >
    <div className="flex-1 flex flex-col overflow-hidden">
      {displayMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
          {data.map((c, idx) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedIndex(idx)}
              className={`bg-slate-900/40 backdrop-blur-sm border p-6 transition-all group relative cursor-pointer flex flex-col justify-between rounded-[2rem] h-64 ${selectedIndex === idx ? 'border-blue-500 bg-blue-500/[0.08] ring-4 ring-blue-500/10 shadow-2xl shadow-blue-500/20' : 'border-white/5 hover:border-white/10 hover:bg-slate-800/40'}`}
            >
               <div className="flex justify-between items-start">
                  <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
                     0x{c.id}
                  </div>
                  <div className={`flex gap-2 ${selectedIndex === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(c); }} className="w-10 h-10 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                       <Edit3 size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="w-10 h-10 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-lg">
                       <Trash2 size={18} />
                    </button>
                  </div>
               </div>
               <div>
                  <div className="text-3xl font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-blue-400 transition-colors mb-3">{c.name}</div>
                  <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                       LOAD_FACTOR: <span className="text-emerald-400">{c.itemCount} UNITS</span>
                    </span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden h-full bg-slate-950/50 rounded-3xl border border-white/5">
          <div className="grid grid-cols-[100px_1fr_200px_150px] px-10 py-6 bg-black/60 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 z-20 backdrop-blur-xl">
            <div className="text-center">IDENTIFIER</div>
            <div>NOMENCLATURE / DESCRIPTION</div>
            <div className="text-right">RESOURCE_LOAD</div>
            <div className="text-center">OPERATIONS</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {data.map((c, idx) => (
              <div 
                key={c.id}
                onClick={() => setSelectedIndex(idx)}
                className={`grid grid-cols-[100px_1fr_200px_150px] px-10 py-8 text-sm items-center group transition-all border-b border-white/5 cursor-pointer ${selectedIndex === idx ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}`}
              >
                 <div className="text-center font-mono text-xs font-black text-slate-600 tracking-tighter">REF_0{c.id}</div>
                 <div className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{c.name}</div>
                 <div className="text-right">
                    <span className="text-2xl font-black text-emerald-500 font-mono tracking-tighter">{c.itemCount}</span>
                    <span className="text-[10px] text-slate-700 uppercase ml-2 font-black tracking-widest">ENTRIES</span>
                 </div>
                 <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(c); }} className="w-11 h-11 bg-slate-900 border border-white/10 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all shadow-xl">
                       <Edit3 size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="w-11 h-11 bg-slate-900 border border-white/10 text-red-400 hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center transition-all shadow-xl">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </MasterDataLayout>
);
