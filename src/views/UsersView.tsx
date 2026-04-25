import React from 'react';
import { UserCog, Shield, Settings, Trash2, Lock } from 'lucide-react';
import { User, ShortcutConfig } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface MasterDataProps<T> {
  data: T[];
  onEdit: (item: T) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  setView: (v: any) => void;
}

interface UsersViewProps extends MasterDataProps<User> {
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  displayMode: 'list' | 'grid';
  onToggleMode: () => void;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  shortcuts: Record<string, ShortcutConfig>;
  currentUser: User;
  setCurrentUser: (u: User) => void;
}

export const UsersView = ({ 
  data, onEdit, onAdd, onDelete, setView, selectedIndex, setSelectedIndex, displayMode, onToggleMode,
  searchQuery, onSearchChange, shortcuts, currentUser, setCurrentUser
}: UsersViewProps) => (
  <MasterDataLayout 
    title="Privileged Access Matrix" 
    icon={UserCog} 
    setView={setView} 
    onAdd={onAdd} 
    displayMode={displayMode} 
    onToggleMode={onToggleMode}
    shortcuts={shortcuts}
    searchQuery={searchQuery}
    onSearchChange={onSearchChange}
  >
    <div className="flex-1 flex flex-col overflow-hidden bg-black px-2 lg:px-4">
      {displayMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 overflow-y-auto custom-scrollbar">
          {data.map((u, idx) => {
            const isActive = currentUser.id === u.id;
            return (
              <div 
                key={u.id} 
                onClick={() => setSelectedIndex(idx)}
                className={`bg-slate-950 border p-3 flex flex-col gap-3 group relative cursor-pointer transition-all ${selectedIndex === idx ? 'border-blue-600 bg-blue-600/[0.03]' : 'border-slate-900 hover:border-slate-800'}`}
              >
                <div className={`absolute top-2 right-2 flex gap-2 ${selectedIndex === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                  {!isActive && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentUser(u); }} 
                      className="px-2 py-0.5 border border-blue-900 text-[7px] font-black text-blue-500 uppercase hover:bg-blue-600 hover:text-white transition-all"
                    >
                      ASSUME_ID
                    </button>
                  )}
                  <button 
                     onClick={(e) => { e.stopPropagation(); onEdit(u); }} 
                     className="text-slate-700 hover:text-blue-500 transition-all"
                  >
                     <Settings size={12}/>
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center border ${isActive ? 'bg-blue-600/10 border-blue-600' : 'bg-black border-slate-900'}`}>
                    <UserCog size={18} className={isActive ? 'text-blue-500' : 'text-slate-800'} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-tight truncate leading-none ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                      {u.username}
                    </span>
                    <span className={`text-[7px] font-black uppercase mt-1 px-1.5 py-0.5 border inline-block w-fit ${u.role === 'Admin' ? 'border-red-900/40 text-red-800' : 'border-blue-900/40 text-blue-800'}`}>{u.role}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col">
                     <span className="text-[7px] font-mono text-slate-800 font-bold uppercase truncate">LAST_SYNC: {u.lastSeen}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-900">
                    <div className="flex flex-wrap gap-1">
                      {u.allowedModules.map(m => (
                        <span key={m} className="text-[6px] font-black uppercase px-1 py-0.5 border border-slate-900 text-slate-800">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden h-full">
          <div className="grid grid-cols-[60px_1fr_120px_1fr_100px] px-4 py-2 bg-slate-950 border-b border-slate-900 text-[8px] font-black text-slate-700 uppercase tracking-widest sticky top-0 z-20">
             <div className="text-center">STS</div>
             <div>IDENTITY</div>
             <div className="text-center">LEVEL</div>
             <div>PERMISSIONS</div>
             <div className="text-center">OPS</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {data.map((u, idx) => {
              const isActive = currentUser.id === u.id;
              return (
                <div 
                  key={u.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`grid grid-cols-[60px_1fr_120px_1fr_100px] px-4 py-1.5 text-[9px] items-center group transition-all border-b border-slate-900/50 cursor-pointer ${selectedIndex === idx ? 'bg-blue-600/[0.03]' : 'hover:bg-slate-900/20'}`}
                >
                   <div className="flex justify-center">
                      <div className={`w-2 h-2 ${isActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-900'}`} />
                   </div>
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase truncate leading-none ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>{u.username}</span>
                      <span className="text-[7px] font-mono text-slate-800 uppercase mt-1 italic">SYNC: {u.lastSeen}</span>
                   </div>
                   <div className="flex justify-center">
                      <span className={`px-2 py-0.5 text-[7px] font-black uppercase border ${u.role === 'Admin' ? 'border-red-900/40 text-red-800' : 'border-blue-900/40 text-blue-800'}`}>{u.role}</span>
                   </div>
                   <div className="flex flex-wrap gap-1 pr-6">
                      {u.allowedModules.map(m => (
                         <span key={m} className="px-1 py-0.5 border border-slate-900 text-[7px] font-black text-slate-800 uppercase">{m}</span>
                      ))}
                   </div>
                   <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={(e) => { e.stopPropagation(); onEdit(u); }} className="text-blue-800 hover:text-blue-500 transition-all">
                         <Settings size={12} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(u.id); }} className="text-red-900 hover:text-red-500 transition-all">
                         <Trash2 size={12} />
                      </button>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </MasterDataLayout>
);
