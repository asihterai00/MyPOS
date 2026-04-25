import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  History, 
  Settings, 
  UserCircle2, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Box,
  Layers,
  FileText
} from 'lucide-react';
import { ViewState, User } from '../../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar = ({ currentView, setView, user, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'menu' as ViewState, label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'pos' as ViewState, label: 'POS Terminal', icon: ShoppingCart, color: 'text-emerald-400' },
    { id: 'products' as ViewState, label: 'Inventory', icon: Box, color: 'text-indigo-400' },
    { id: 'categories' as ViewState, label: 'Categories', icon: Layers, color: 'text-amber-400' },
    { id: 'customers' as ViewState, label: 'Customers', icon: Users, color: 'text-purple-400' },
    { id: 'vendors' as ViewState, label: 'Suppliers', icon: Truck, color: 'text-orange-400' },
    { id: 'purchase' as ViewState, label: 'Procurement', icon: FileText, color: 'text-pink-400' },
    { id: 'history' as ViewState, label: 'Sale History', icon: History, color: 'text-slate-400' },
    { id: 'reports' as ViewState, label: 'Analytics', icon: BarChart3, color: 'text-orange-300' },
    { id: 'users' as ViewState, label: 'Operators', icon: UserCircle2, color: 'text-red-400' },
  ];

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 }
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      className="h-full bg-slate-950 border-r border-white/5 flex flex-col relative z-50 transition-colors duration-300"
    >
      {/* HEADER / LOGO */}
      <div className="h-20 flex items-center px-6 relative overflow-hidden shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <LayoutDashboard size={24} className="text-white" />
           </div>
           <AnimatePresence>
             {!isCollapsed && (
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 className="flex flex-col whitespace-nowrap"
               >
                 <span className="text-lg font-black text-white leading-none tracking-tighter">PRISM</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Matrix OS</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full group flex items-center transition-all relative h-12 rounded-xl ${
                isActive 
                  ? 'bg-blue-600/10 text-white shadow-inner' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${isActive ? item.color : 'group-hover:' + item.color}`}>
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 text-left font-black text-xs uppercase tracking-widest whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER / COLLAPSE TOGGLE */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-3 px-2">
            <ChevronLeft size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Collapse Menu</span>
          </div>}
        </button>

        <div className={`flex items-center gap-4 p-2 rounded-2xl bg-black/40 border border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
           <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 font-black text-xs uppercase shrink-0">
              {user.username.slice(0, 1)}
           </div>
           {!isCollapsed && (
             <div className="flex-1 min-w-0 pr-2">
                <p className="text-[10px] font-black text-white uppercase truncate">{user.username}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate">{user.role}</p>
             </div>
           )}
        </div>
      </div>
    </motion.aside>
  );
};
