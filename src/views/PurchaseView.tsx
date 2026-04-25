import React from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { PurchaseOrder, ShortcutConfig } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface PurchaseViewProps {
  data: PurchaseOrder[];
  onAdd: () => void;
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (id: string) => void;
  setView: (v: any) => void;
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  displayMode: 'list' | 'grid';
  onToggleMode: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  shortcuts: Record<string, ShortcutConfig>;
}

export const PurchaseView = ({ 
  data, onAdd, onEdit, setView, shortcuts, onDelete, selectedIndex, setSelectedIndex, displayMode, onToggleMode, searchQuery, onSearchChange 
}: PurchaseViewProps) => (
  <MasterDataLayout title="Procurement Hub" icon={ShoppingCart} setView={setView} onAdd={onAdd} shortcuts={shortcuts} onSearchChange={onSearchChange} searchQuery={searchQuery} displayMode={displayMode} onToggleMode={onToggleMode}>
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/50 rounded-3xl border border-white/5">
      <div className="grid grid-cols-[150px_150px_1fr_180px_150px] gap-6 px-10 py-6 bg-black/60 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 z-20 backdrop-blur-xl">
        <div>OR_REFERENCE</div>
        <div>STAMP_DATE</div>
        <div>VENDOR NOMENCLATURE</div>
        <div className="text-right">TOTAL_VALUATION</div>
        <div className="text-center">STATUS_LVL</div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {data.map((po, idx) => (
          <div 
            key={po.id} 
            onClick={() => { setSelectedIndex(idx); onEdit(po); }}
            className={`grid grid-cols-[150px_150px_1fr_180px_150px] gap-6 px-10 py-8 items-center transition-all group cursor-pointer border-b border-white/5 ${selectedIndex === idx ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}`}
          >
            <div className="font-mono text-lg font-black text-blue-400 group-hover:scale-105 transition-transform origin-left tracking-tighter">{po.id}</div>
            <div className="font-sans text-xs font-bold text-slate-500 uppercase tracking-widest">{po.date}</div>
            <div className="text-2xl font-black text-white uppercase truncate tracking-tight group-hover:text-blue-400 transition-colors">{po.vendor}</div>
            <div className="text-right font-sans text-xl text-emerald-400 font-bold tracking-tighter">
               <span className="text-[10px] text-slate-700 mr-2 uppercase italic font-black">Rp</span>
               {po.total.toLocaleString()}
            </div>
            <div className="flex justify-center">
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${po.status === 'Received' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                {po.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Table Footer */}
      <div className="px-10 py-5 bg-black/80 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] backdrop-blur-xl">
          <div className="flex gap-8">
            <span>Procurement_Archive: <span className="text-blue-400">{data.length} Records</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-700">Registry Page 01 of 01</span>
            <div className="flex bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
              <button className="p-3 hover:bg-slate-800 border-r border-white/10 transition-colors text-slate-500 hover:text-white"><ChevronLeft size={18}/></button>
              <button className="p-3 hover:bg-slate-800 transition-colors text-slate-500 hover:text-white"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>
    </div>
  </MasterDataLayout>
);
