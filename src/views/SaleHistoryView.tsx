import React from 'react';
import { History, ShoppingBag, CreditCard, Banknote, HelpCircle } from 'lucide-react';
import { Sale, ShortcutConfig, ViewState } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface SaleHistoryViewProps {
  data: Sale[];
  setView: (v: ViewState) => void;
  shortcuts: Record<string, ShortcutConfig>;
}

export const SaleHistoryView = ({ data, setView, shortcuts }: SaleHistoryViewProps) => (
  <MasterDataLayout title="TX_LOG" icon={History} setView={setView} shortcuts={shortcuts}>
    <table className="w-full text-left border-collapse bg-black">
      <thead className="bg-slate-950 sticky top-0 z-10 border-b border-slate-900">
        <tr className="text-[8px] font-black text-slate-700 uppercase tracking-widest">
          <th className="px-4 py-2">REF_ID</th>
          <th className="px-4 py-2">STAMP_DATE</th>
          <th className="px-4 py-2">CLIENT</th>
          <th className="px-4 py-2 text-center">MODE</th>
          <th className="px-4 py-2 text-right">GROSS</th>
        </tr>
      </thead>
      <tbody>
        {data.map(sale => (
          <tr key={sale.id} className="hover:bg-blue-600/[0.03] transition-all group cursor-pointer border-b border-slate-900/50">
            <td className="px-4 py-1.5 font-mono text-[9px] font-black text-blue-800">{sale.id}</td>
            <td className="px-4 py-1.5 text-[8px] font-bold text-slate-600 uppercase tabular-nums">{sale.date}</td>
            <td className="px-4 py-1.5">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-blue-500 transition-colors">{sale.customerName}</span>
                  <span className="text-[7px] font-bold text-slate-800 uppercase tabular-nums">{sale.items.length} LI</span>
               </div>
            </td>
            <td className="px-4 py-1.5">
               <div className="flex justify-center">
                  <div className="flex items-center gap-1.5">
                     {sale.paymentMethod === 'CASH' ? <Banknote size={10} className="text-emerald-800" /> : sale.paymentMethod === 'CARD' ? <CreditCard size={10} className="text-blue-800" /> : <HelpCircle size={10} className="text-slate-800" />}
                     <span className="text-[8px] font-black text-slate-500 uppercase">{sale.paymentMethod}</span>
                  </div>
               </div>
            </td>
            <td className="px-4 py-1.5 text-right font-mono text-[10px] font-black text-white tabular-nums">
               <span className="text-[7px] text-slate-800 mr-1 uppercase">Rp</span>
               {sale.total.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </MasterDataLayout>
);
