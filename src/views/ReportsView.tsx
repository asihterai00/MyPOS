import React from 'react';
import { 
  BarChart3, 
  History, 
  Package, 
  Users, 
  Truck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { ShortcutConfig, ViewState } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface ReportsViewProps {
  setView: (v: ViewState) => void;
  shortcuts: Record<string, ShortcutConfig>;
}

export const ReportsView = ({ setView, shortcuts }: ReportsViewProps) => {
  const reportItems = [
    { id: 'sales', title: 'Sales Performance', icon: History, view: 'sales_history' as ViewState, color: 'border-amber-500', desc: 'Detailed log of all completed sales and payments.' },
    { id: 'inventory', title: 'Inventory Analysis', icon: Package, view: 'products' as ViewState, color: 'border-emerald-500', desc: 'Track stock movements, valuation and low stock alerts.' },
    { id: 'customers', title: 'Customer Insights', icon: Users, view: 'customers' as ViewState, color: 'border-purple-500', desc: 'Analyze demographics, points balance and top customers.' },
    { id: 'vendors', title: 'Vendor Efficiency', icon: Truck, view: 'vendors' as ViewState, color: 'border-yellow-500', desc: 'Monitor supply chain performance and purchase logs.' },
    { id: 'audit', title: 'System Audit Log', icon: FileText, view: 'users' as ViewState, color: 'border-red-500', desc: 'Track administrative changes and user activity logs.' },
    { id: 'visual', title: 'Visual Analytics', icon: BarChart3, view: 'reports' as ViewState, color: 'border-indigo-500', desc: 'Charts and graphical representations of POS performance.' },
  ];

  return (
    <MasterDataLayout title="INFRA_ANALYTICS" icon={BarChart3} setView={setView} shortcuts={shortcuts}>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-3 border border-slate-900 relative group">
            <div className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em] mb-1">DATA_GROWTH</div>
            <div className="text-xl font-black text-emerald-800 font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">+12.5%</div>
            <div className="h-0.5 mt-2 bg-slate-900 overflow-hidden">
              <div className="h-full bg-emerald-800 w-[72%]"></div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 border border-slate-900 relative group">
            <div className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em] mb-1">CLIENT_BASE</div>
            <div className="text-xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">1,024</div>
            <div className="h-0.5 mt-2 bg-slate-900 overflow-hidden">
              <div className="h-full bg-orange-900 w-[45%]"></div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 border border-slate-900 relative group">
            <div className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em] mb-1">RESOURCE_UTIL</div>
            <div className="text-xl font-black text-blue-800 font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">98%</div>
            <div className="h-0.5 mt-2 bg-slate-900 overflow-hidden">
              <div className="h-full bg-blue-800 w-[98%]"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {reportItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.view)}
              className={`text-left p-3 bg-slate-950 border border-slate-900 group hover:border-blue-900/50 transition-all relative overflow-hidden`}
            >
              <div className="w-8 h-8 bg-black flex items-center justify-center text-slate-800 group-hover:text-blue-600 transition-all border border-slate-900 mb-2">
                <item.icon size={14} />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1 group-hover:text-blue-500 transition-colors">{item.title}</h3>
              <p className="text-[7px] font-bold text-slate-700 uppercase leading-tight italic">{item.desc}</p>
            </button>
          ))}
        </div>

        <div className="p-3 bg-blue-950/20 border border-blue-900/30 flex gap-4 items-center group">
          <div className="w-8 h-8 bg-blue-950 flex items-center justify-center text-blue-900 shrink-0">
            <AlertCircle size={14} />
          </div>
          <div>
            <h4 className="text-[9px] font-black text-white uppercase mb-0.5">CAPABILITY_BOUND</h4>
            <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest italic">REALTIME CLUSTER_SYNC: &lt; 50MS</p>
          </div>
        </div>
      </div>
    </MasterDataLayout>
  );
};
