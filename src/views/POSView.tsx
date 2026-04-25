import React, { FormEvent, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingCart, 
  ChevronRight, 
  Users, 
  Edit3, 
  CheckCircle2, 
  X, 
  Banknote, 
  CreditCard, 
  Trash2,
  Bell
} from 'lucide-react';
import { Product, ProductVariant, Customer, ShortcutConfig, CartItem } from '../types';

interface POSViewProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleSearch: (e: FormEvent) => void;
  activeInput: 'search' | 'qty' | 'disc';
  setActiveInput: (v: 'search' | 'qty' | 'disc') => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  shortcuts: Record<string, ShortcutConfig>;
  productSearchResults: Array<{ product: Product; variant?: ProductVariant }>;
  handleVariantSelect: (p: Product, v: ProductVariant) => void;
  addItem: (p: Product) => void;
  cart: CartItem[];
  selectedItemIndex: number;
  setSelectedItemIndex: (i: number) => void;
  posCustomer: Customer | null;
  setPosCustomer: (c: Customer | null) => void;
  isCustomerModalOpen: boolean;
  setIsCustomerModalOpen: (o: boolean) => void;
  customers: Customer[];
  subtotal: number;
  grandTotal: number;
  handlePayment: (method: string) => void;
  handleVoid: () => void;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export const POSView = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  activeInput,
  setActiveInput,
  searchInputRef,
  shortcuts,
  productSearchResults,
  handleVariantSelect,
  addItem,
  cart,
  selectedItemIndex,
  setSelectedItemIndex,
  posCustomer,
  setPosCustomer,
  isCustomerModalOpen,
  setIsCustomerModalOpen,
  customers,
  subtotal,
  grandTotal,
  handlePayment,
  handleVoid
}: POSViewProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const notificationIdRef = useRef(0);

  const addNotification = (message: string) => {
    const id = ++notificationIdRef.current;
    setNotifications(prev => [...prev.slice(-2), { id, message, type: 'success' }]);
    setIsCartBouncing(true);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
    setTimeout(() => setIsCartBouncing(false), 300);
  };

  const onAddItem = (p: Product) => {
    addItem(p);
    addNotification(`Added ${p.name}`);
  };

  const onHandleVariantSelect = (p: Product, v: ProductVariant) => {
    handleVariantSelect(p, v);
    addNotification(`Added ${p.name} (${v.name})`);
  };

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden font-sans relative">
      {/* FLOATING NOTIFICATIONS */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] pointer-events-none flex flex-col items-center gap-3">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              className="bg-blue-600 border border-blue-400 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">Signal_Processed</p>
                <p className="text-sm font-black uppercase tracking-tight">{n.message}</p>
              </div>
              <div className="ml-4 w-1 bg-white/20 h-8 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: '100%' }}
                  animate={{ height: '0%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="bg-white w-full"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* LEFT: TRANSACTION GRID */}
        <section className="flex-1 flex flex-col glass border border-white/5 overflow-hidden bg-slate-900/20 rounded-[2.5rem]">
          {/* ACTIVE ITEM INPUT */}
          <div className="p-8 bg-black/40 border-b border-white/5 shrink-0 backdrop-blur-xl">
            <div className="flex gap-6">
              <form onSubmit={handleSearch} className="flex-1 flex gap-4">
                <div className={`flex-1 bg-slate-950 border transition-all flex items-center px-6 py-4 rounded-2xl relative ${activeInput === 'search' ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-2xl shadow-blue-500/20' : 'border-white/5'}`}>
                  <Search className="text-slate-600 mr-4" size={20} />
                  <input 
                    id="search-input"
                    ref={searchInputRef}
                    type="text" 
                    className="bg-transparent border-none text-white text-xl font-black w-full focus:outline-none placeholder:text-slate-800 uppercase tracking-tight" 
                    placeholder="SCAN_ENTRY_SIGNAL [SKU/PLU]..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setActiveInput('search')}
                    autoFocus
                  />
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-blue-500 font-mono text-[10px] font-black bg-blue-600/10 border border-blue-500/20 px-2 py-1 rounded-lg uppercase">{shortcuts.search.key}</span>
                  </div>
                  
                  {/* RESULTS DROPDOWN */}
                  <AnimatePresence>
                    {productSearchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 top-[calc(100%+12px)] w-full bg-slate-900/95 backdrop-blur-2xl border border-blue-500/30 z-[100] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
                      >
                        {productSearchResults.map((res, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => res.variant ? onHandleVariantSelect(res.product, res.variant) : onAddItem(res.product)}
                            className="w-full text-left p-5 border-b border-white/5 hover:bg-blue-600/10 flex justify-between items-center group transition-all"
                          >
                            <div className="flex flex-col">
                              <span className="text-lg font-black text-white uppercase group-hover:text-blue-400">
                                {res.product.name} {res.variant && <span className="text-blue-500 text-sm ml-2">[{res.variant.name}]</span>}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono tracking-[0.2em] mt-1">ID_TRANS: {res.variant?.sku || res.product.sku}</span>
                            </div>
                            <div className="flex items-center gap-6">
                               <span className="text-xl font-mono font-black text-emerald-400 tabular-nums">{(res.variant?.price || res.product.price).toLocaleString()}</span>
                               <ChevronRight size={20} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
              
              <div className="w-64 grid grid-cols-2 gap-4">
                 <div className="bg-slate-950/50 border border-white/5 p-4 flex flex-col justify-center text-center rounded-2xl">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">QTY_MOD [{shortcuts.qty.key}]</p>
                    <p className="text-2xl font-black text-white leading-none font-mono">1.00</p>
                 </div>
                 <div className="bg-slate-950/50 border border-white/5 p-4 flex flex-col justify-center text-center rounded-2xl">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">DISC_ADJ [{shortcuts.disc.key}]</p>
                    <p className="text-2xl font-black text-blue-500 leading-none font-mono">0%</p>
                 </div>
              </div>
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-black/40 backdrop-blur-2xl sticky top-0 font-bold z-10 border-b border-white/5">
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <th className="px-8 py-5 w-20 text-center">#_ID</th>
                  <th className="px-8 py-5">NOMENCLATURE_DATA</th>
                  <th className="px-8 py-5 w-32 text-right">UNIT_VAL</th>
                  <th className="px-8 py-5 w-24 text-center">FREQ</th>
                  <th className="px-8 py-5 w-40 text-right">NET_TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-40 text-center">
                       <div className="flex flex-col items-center gap-6">
                          <motion.div 
                             animate={isCartBouncing ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                             className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-800 animate-pulse"
                          >
                             <ShoppingCart size={40} />
                          </motion.div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-[1em]">System_Idle: Waiting_Input_Signal</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  cart.map((item, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`transition-all group cursor-pointer border-l-4 ${selectedItemIndex === idx ? 'bg-blue-600/10 border-blue-500 shadow-inner' : 'hover:bg-white/[0.02] border-transparent'}`}
                    >
                      <td className="px-8 py-6 text-center font-mono text-xs font-black text-slate-600">
                        {(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className={`text-xl font-black uppercase truncate tracking-tight transition-colors ${selectedItemIndex === idx ? 'text-white' : 'text-slate-300'}`}>{item.name}</span>
                          <span className="text-[10px] text-slate-600 font-mono tracking-widest mt-1 uppercase">IDCODE: {item.sku}_XREC</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-mono text-sm font-bold text-slate-500">{(item.price).toLocaleString()}</td>
                      <td className="px-8 py-6 text-center font-mono text-lg font-black text-white">
                         {item.quantity.toFixed(1)}
                      </td>
                      <td className={`px-8 py-6 text-right font-mono font-black text-2xl tracking-tighter ${selectedItemIndex === idx ? 'text-blue-400' : 'text-white'}`}>
                        {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT: TOTALS AND SUMMARY */}
        <section className="w-[400px] flex flex-col gap-4 overflow-hidden z-20">
          {/* CUSTOMER INFO */}
          <div className="p-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shrink-0">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Client_Link_Authorization</h3>
                <button onClick={() => setIsCustomerModalOpen(true)} className="w-10 h-10 bg-slate-950 border border-white/10 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                   <Edit3 size={18} />
                </button>
             </div>
             
             <div className="bg-black/60 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group/cust">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-950 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner group-hover/cust:border-blue-500/50 transition-colors">
                      <Users size={28} />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-xl font-black text-white uppercase truncate tracking-tight">{posCustomer?.name || 'WALK_IN_REGISTRY'}</p>
                      <p className="text-[10px] font-mono text-slate-600 tracking-widest mt-1">ID: {posCustomer?.id || 'ANONYMOUS_VOID_V1'}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Loyalty_Credits</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">{posCustomer?.points || 0}</span>
                       <span className="text-[10px] font-black text-emerald-900 uppercase">PTS</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 rounded-full"></div>
             </div>
          </div>

          {/* TRANSACTION SUMMARY */}
          <div className="flex-1 p-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] flex flex-col justify-end gap-8 relative overflow-hidden">
             <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-slate-500">
                   <span className="text-[10px] font-black uppercase tracking-widest">GROSS_SUBTOTAL</span>
                   <span className="text-sm font-mono font-bold tracking-tight">{(subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                   <span className="text-[10px] font-black uppercase tracking-widest">TAX_VAR_LOCK</span>
                   <span className="text-sm font-mono font-bold tracking-tight">0.00</span>
                </div>
                <div className="h-px bg-white/5 my-6"></div>
                <div className="py-2 flex flex-col items-center">
                   <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4 opacity-50">FINAL_NET_VALUATION_STREAM</span>
                   <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-700 uppercase italic font-sans pr-2">Rp</span>
                      <span className="text-6xl font-black text-white tracking-[-0.05em] font-mono tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{(grandTotal).toLocaleString()}</span>
                   </div>
                </div>
             </div>

             {/* ACTION BUTTONS */}
             <div className="flex flex-col gap-4 relative z-10">
                <button onClick={() => handlePayment('cash')} className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-[0_20px_40px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_50px_-5px_rgba(59,130,246,0.5)] group">
                   <div className="flex items-center gap-3">
                      <Banknote size={24} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-lg font-black uppercase tracking-[0.2em]">CASH_SETTLE [F10]</span>
                   </div>
                </button>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => handlePayment('card')} className="h-14 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 rounded-2xl flex items-center justify-center gap-3 transition-all hover:text-white">
                      <CreditCard size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">CARD [F11]</span>
                   </button>
                   <button onClick={handleVoid} className="h-14 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all">
                      <Trash2 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">VOID [F12]</span>
                   </button>
                </div>
             </div>

             <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-10">
                <motion.div
                  animate={isCartBouncing ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                    opacity: [0.1, 0.3, 0.1]
                  } : {}}
                >
                  <ShoppingCart size={200} className="-mb-20 text-slate-400" />
                </motion.div>
             </div>
          </div>
        </section>
      </div>

      {/* CUSTOMER SELECTION MODAL LAYER */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[200] flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] h-[600px]"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tight">Client_Matrix_Access</h3>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Select valid customer entity for linkage</p>
                </div>
                <button onClick={() => setIsCustomerModalOpen(false)} className="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
                   <X size={24}/>
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-2 gap-4">
                {customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setPosCustomer(c); setIsCustomerModalOpen(false); }}
                    className={`p-6 border text-left flex flex-col justify-between transition-all rounded-[2rem] group/card ${posCustomer?.id === c.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-slate-950 border-white/5 hover:border-white/20 hover:bg-slate-800/50'}`}
                  >
                    <div>
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">UID: {c.id}</span>
                          {posCustomer?.id === c.id && <CheckCircle2 size={16} className="text-blue-500" />}
                       </div>
                       <p className="text-xl font-black text-white uppercase tracking-tight group-hover/card:text-blue-400 transition-colors">{c.name}</p>
                       <p className="text-sm font-mono text-slate-600 mt-1 italic">{c.phone}</p>
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Points_Balance</span>
                       <span className="text-lg font-black text-emerald-500 font-mono tracking-tighter">{c.points} PTS</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
