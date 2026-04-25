import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Keyboard, Trash2, AlertTriangle } from 'lucide-react';
import { ShortcutConfig } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Record<string, ShortcutConfig>;
  onShortcutUpdate: (key: string, newKey: string) => void;
}

export const SettingsModal = ({ isOpen, onClose, shortcuts, onShortcutUpdate }: SettingsModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-10 backdrop-blur-2xl bg-slate-950/80"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-4xl bg-slate-900 border-2 border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-10 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
                <Settings size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">System Configuration</h2>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Operational Environment Parameters</p>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-8">
                   <Keyboard className="text-blue-500" size={20} />
                   <h3 className="text-lg font-black text-white uppercase tracking-widest">Interface Hotkeys</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(shortcuts).map(([key, config]) => (
                    <div key={key} className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl hover:border-blue-600/30 transition-all flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{config.label}</span>
                        <span className="text-sm font-bold text-white uppercase">{key.toUpperCase()} OPERATION</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-black text-blue-500 bg-blue-600/10 px-4 py-2 rounded-lg border border-blue-600/20">{config.key}</span>
                         <button 
                           className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-blue-600 rounded-lg flex items-center justify-center transition-all"
                           onClick={() => {
                             const newKey = prompt(`Enter new key for ${config.label}`, config.key);
                             if (newKey) onShortcutUpdate(key, newKey);
                           }}
                         >
                           <Edit3Icon size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-slate-950/50 border-t border-slate-800 flex justify-end">
             <button onClick={onClose} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-900/40">Apply and Exit</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Edit3Icon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning';
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm Action', type = 'danger' }: ConfirmationModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] flex items-center justify-center p-10 backdrop-blur-xl bg-slate-950/60"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-10 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${type === 'danger' ? 'bg-red-600/10 text-red-500 border-2 border-red-600/20' : 'bg-amber-600/10 text-amber-500 border-2 border-amber-600/20'}`}>
              {type === 'danger' ? <Trash2 size={40} /> : <AlertTriangle size={40} />}
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">{title}</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest leading-relaxed">
              {message}
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-12">
               <button onClick={onClose} className="py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all">Cancel</button>
               <button 
                 onClick={() => { onConfirm(); onClose(); }} 
                 className={`py-4 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl ${type === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20'}`}
               >
                 {confirmText}
               </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
