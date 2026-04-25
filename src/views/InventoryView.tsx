import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Filter, 
  Trash2, 
  Plus, 
  ChevronDown, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import { Product, Category, ShortcutConfig } from '../types';
import { MasterDataLayout } from '../components/layout/MasterDataLayout';

interface MasterDataProps<T> {
  data: T[];
  onEdit: (item: T) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  setView: (v: any) => void;
}

interface InventoryViewProps extends MasterDataProps<Product> {
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  displayMode: 'list' | 'grid';
  onToggleMode: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (v: 'asc' | 'desc') => void;
  shortcuts: Record<string, ShortcutConfig>;
  filters: any;
  setFilters: (f: any) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (o: boolean) => void;
  categories: Category[];
}

export const InventoryView = ({ 
  data, onEdit, onAdd, onDelete, setView, selectedIndex, setSelectedIndex, displayMode, onToggleMode,
  searchQuery, onSearchChange, sortOrder, setSortOrder, shortcuts,
  filters, setFilters, isFilterOpen, setIsFilterOpen, categories
}: InventoryViewProps) => {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedProducts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedProducts(next);
  };

  return (
    <MasterDataLayout
      title="Inventory Portfolio"
      icon={Package}
      setView={setView}
      onAdd={onAdd}
      displayMode={displayMode}
      onToggleMode={onToggleMode}
      shortcuts={shortcuts}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      controls={
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-6 py-2 border rounded-xl transition-all text-xs font-black uppercase tracking-widest ${isFilterOpen ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-900 border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-white'}`}
        >
          <Filter size={16} /> <span>Filter_Matrix</span>
        </button>
      }
    >
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/60 backdrop-blur-xl border-b border-white/5 p-8 overflow-hidden z-20 mb-6 rounded-[2rem]"
          >
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Category Filter */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">DEPT_CLASSIFICATION</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {categories.map(c => {
                    const isSelected = filters.categories.includes(c.name);
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          const next = isSelected 
                            ? filters.categories.filter((cat: string) => cat !== c.name)
                            : [...filters.categories, c.name];
                          setFilters({ ...filters, categories: next });
                        }}
                        className={`flex items-center justify-between p-3 px-4 text-[10px] font-black uppercase border rounded-xl transition-all ${
                          isSelected 
                            ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                            : 'bg-slate-900/50 border-white/5 text-slate-600 hover:border-white/10'
                        }`}
                      >
                        <span>{c.name}</span>
                        {isSelected && <CheckCircle2 size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VAL_RANGE_MAX</label>
                   <span className="text-xl font-mono font-black text-white bg-blue-600/10 px-3 py-1 rounded-lg border border-blue-600/30">Rp {filters.maxPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="1000000" step="10000"
                  value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-900 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-700"><span>0</span><span>1.000.000+</span></div>
              </div>

              {/* Stock Range */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">STOCK_MIN_REQ</label>
                   <span className="text-xl font-mono font-black text-emerald-400 bg-emerald-600/10 px-3 py-1 rounded-lg border border-emerald-600/30">{filters.minStock} UNITS</span>
                </div>
                <input 
                  type="range" min="0" max="5000" step="100"
                  value={filters.minStock}
                  onChange={e => setFilters({ ...filters, minStock: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 h-2 bg-slate-900 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-700"><span>0</span><span>5.000+</span></div>
              </div>

              {/* Quick Reset */}
              <div className="flex flex-col justify-end gap-3">
                <button 
                   onClick={() => setFilters({ categories: [], minPrice: 0, maxPrice: 1000000, minStock: 0, maxStock: 5000 })}
                   className="w-full py-3 bg-slate-900 border border-white/5 rounded-xl text-slate-400 text-[10px] font-black uppercase hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                   <Trash2 size={14} /> Reset_Matrix_Parameters
                </button>
                <button 
                   onClick={() => setIsFilterOpen(false)}
                   className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                   Apply_Current_Config
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/50 rounded-[2rem] border border-white/5 shadow-inner">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-[80px_1fr_150px_150px_180px_180px_150px] gap-6 px-10 py-6 bg-black/60 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 z-20 backdrop-blur-xl">
          <div className="text-center">CTRL</div>
          <div>PRODUCT_NOMENCLATURE</div>
          <div className="text-center">UOM</div>
          <div className="text-right">RES_LOAD</div>
          <div className="text-right">PROCURE_P.</div>
          <div className="text-right">RETAIL_VAL</div>
          <div className="text-right">OPT_MARGIN</div>
        </div>

        {/* TABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {data.map((product, idx) => {
            const isExpanded = expandedProducts.has(product.id);
            const units = product.units || [];
            const primaryUnit = units[0] || { unit: 'PCS', price: product.price, cost: product.price * 0.8, stock: product.stock, safety: 10 };
            const margin = primaryUnit.price - (primaryUnit.cost || 0);
            const marginPct = primaryUnit.cost ? (margin / primaryUnit.cost) * 100 : 0;

            return (
              <React.Fragment key={product.id}>
                <div 
                  className={`grid grid-cols-[80px_1fr_150px_150px_180px_180px_150px] gap-6 px-10 py-8 items-center cursor-pointer transition-all border-b border-white/5 group ${selectedIndex === idx ? 'bg-blue-500/10 border-blue-500/20' : 'hover:bg-white/[0.02]'}`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <div className="flex justify-center">
                    {units.length > 1 || product.hasVariants ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleExpand(product.id); }}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-lg ${isExpanded ? 'bg-blue-600 text-white border-blue-500 rotate-180' : 'bg-slate-900 border-white/10 text-slate-500 hover:border-blue-500/50 hover:text-white'}`}
                      >
                        <ChevronDown size={18} />
                      </button>
                    ) : (
                      <div className="w-10 h-10 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center text-slate-700 shadow-inner">
                        <Package size={18} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col min-w-0 pr-6">
                    <span className={`text-2xl font-black uppercase truncate tracking-tight transition-colors ${selectedIndex === idx ? 'text-white' : 'text-slate-200 group-hover:text-blue-400'}`}>{product.name}</span>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/30 text-[10px] font-black text-blue-400 uppercase rounded-lg tracking-widest">{product.category}</span>
                       <span className="text-[10px] font-mono text-slate-600 font-bold tracking-tighter">SKU: {product.sku || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="text-center font-mono text-sm font-black text-slate-500 uppercase">
                    {primaryUnit.unit}
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-black font-mono tracking-tighter tabular-nums ${primaryUnit.stock <= primaryUnit.safety ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                      {primaryUnit.stock.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Qty_Active</span>
                  </div>

                  <div className="text-right">
                     <div className="text-lg font-mono text-slate-500 italic font-bold">
                        {primaryUnit.cost.toLocaleString()}
                     </div>
                  </div>

                  <div className="text-right">
                     <div className="text-2xl font-black text-white font-mono tracking-tighter flex items-baseline justify-end gap-1">
                        <span className="text-[10px] text-slate-700 italic">Rp</span>
                        {primaryUnit.price.toLocaleString()}
                     </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-black font-mono px-3 py-1 rounded-xl inline-block ${marginPct > 20 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                      {marginPct.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="bg-black/40 border-b border-white/5 overflow-hidden"
                    >
                      <div className="pl-32 pr-20 py-8 space-y-3">
                        {/* VARIANTS */}
                        {product.hasVariants && product.variants && product.variants.map((v, vIdx) => (
                          <div key={`v-${vIdx}`} className="grid grid-cols-[1fr_150px_150px_180px_180px_150px] gap-6 px-10 py-6 items-center bg-slate-900/30 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group/var">
                            <span className="text-base font-black text-slate-400 uppercase tracking-tight group-hover/var:text-white transition-colors">{v.name}</span>
                            <span className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">VARIANT_U</span>
                            <span className="text-right font-mono text-xl font-black text-emerald-500 pb-1 border-b border-emerald-500/20">{v.stock.toLocaleString()}</span>
                            <span className="text-right text-[10px] text-slate-700 font-black uppercase tracking-widest">Fixed_COST</span>
                            <span className="text-right font-mono text-xl font-black text-blue-400">{v.price.toLocaleString()}</span>
                            <span className="text-right text-[10px] text-slate-800 uppercase font-black">---</span>
                          </div>
                        ))}
                        {/* SUB ROW ACTIONS */}
                        <div className="flex justify-end gap-4 pt-6">
                           <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="flex items-center gap-3 px-8 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs font-black text-slate-400 uppercase hover:text-white hover:border-blue-500/50 transition-all shadow-xl group">
                              <Edit3 size={16} className="text-blue-500 group-hover:rotate-12 transition-transform" /> Modify_Registry_Entry
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="flex items-center gap-3 px-8 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs font-black text-red-500/50 uppercase hover:bg-red-500 hover:text-white transition-all shadow-xl">
                              <Trash2 size={16} /> Delete_Permanent
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </div>

        {/* TABLE FOOTER */}
        <div className="px-10 py-6 bg-black border-t border-white/5 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] backdrop-blur-xl">
          <div className="flex gap-10">
            <span>Portfolio_Registry: <span className="text-blue-400">{data.length} Load Units</span></span>
            <span className="flex items-center gap-2">System_Status: <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> <span className="text-emerald-500">OPERATIONAL</span></span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-700">Page Registry Index: 01 // 01</span>
            <div className="flex bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
              <button className="p-3 hover:bg-slate-800 border-r border-white/10 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
              <button className="p-3 hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"><ChevronRight size={20}/></button>
            </div>
          </div>
        </div>
      </div>
    </MasterDataLayout>
  );
};
