import React from 'react';
import { Users, Edit3, Trash2, Phone } from 'lucide-react';
import { Customer, ShortcutConfig } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface MasterDataProps<T> {
  data: T[];
  onEdit: (item: T) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  setView: (v: any) => void;
}

interface CustomersViewProps extends MasterDataProps<Customer> {
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  displayMode: 'list' | 'grid';
  onToggleMode: () => void;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  shortcuts: Record<string, ShortcutConfig>;
}

export const CustomersView = ({ 
  data, onEdit, onAdd, onDelete, setView, selectedIndex, setSelectedIndex, displayMode, onToggleMode,
  searchQuery, onSearchChange, shortcuts
}: CustomersViewProps) => (
  <MasterDataLayout 
    title="Client Relations Portfolio" 
    icon={Users} 
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
          {data.map((c, idx) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedIndex(idx)}
              className={`bg-slate-900/40 backdrop-blur-sm border p-6 transition-all group relative cursor-pointer flex flex-col justify-between rounded-[2rem] h-72 ${selectedIndex === idx ? 'border-blue-500 bg-blue-500/[0.08] ring-4 ring-blue-500/10 shadow-2xl shadow-blue-500/20' : 'border-white/5 hover:border-white/10 hover:bg-slate-800/40'}`}
            >
               <div className="flex justify-between items-start">
                  <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
                     CLT_{c.id}
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
                  <div className="text-3xl font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-blue-400 transition-colors mb-2">{c.name}</div>
                  <div className="flex items-center gap-2 mt-4 text-slate-400 font-mono text-sm uppercase font-bold tracking-widest">
                     <Phone size={14} className="text-blue-500" />
                     {c.phone}
                  </div>
               </div>
               <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/10 mt-6 group-hover:border-blue-500/30 transition-colors">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Engagement_Index</span>
                     <span className="text-xs font-bold text-slate-400 opacity-60">Status: Active_Tier</span>
                  </div>
                  <div className="text-right">
                     <div className="text-3xl font-black text-emerald-400 font-mono tracking-tighter tabular-nums leading-none">
                        {c.points.toLocaleString()}
                     </div>
                     <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mt-1 block">ACC_PTS</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden h-full bg-slate-950/50 rounded-3xl border border-white/5">
          <div className="grid grid-cols-[120px_1fr_200px_180px_150px] px-10 py-6 bg-black/60 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 z-20 backdrop-blur-xl">
            <div className="text-center">UID</div>
            <div>NOMENCLATURE / IDENTITY</div>
            <div>CONTACT_VECTOR</div>
            <div className="text-right">ACC_POINTS</div>
            <div className="text-center">OPERATIONS</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {data.map((c, idx) => (
              <div 
                key={c.id}
                onClick={() => setSelectedIndex(idx)}
                className={`grid grid-cols-[120px_1fr_200px_180px_150px] px-10 py-8 text-sm items-center group transition-all border-b border-white/5 cursor-pointer ${selectedIndex === idx ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}`}
              >
                 <div className="text-center font-mono text-xs font-black text-slate-600">CLT_0{c.id}</div>
                 <div className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{c.name}</div>
                 <div className="font-mono text-sm text-slate-400 font-bold tracking-widest">{c.phone}</div>
                 <div className="text-right font-mono text-2xl font-black text-emerald-400 tracking-tighter tabular-nums">
                    {c.points.toLocaleString()} <span className="text-[10px] text-slate-700 uppercase ml-2 font-black tracking-widest">PTS</span>
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
