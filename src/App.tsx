import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Save, 
  ChevronLeft,
  Settings
} from 'lucide-react';

// Types & Config
import { 
  Product, 
  Customer, 
  Vendor, 
  Category, 
  User, 
  PurchaseOrder, 
  ViewState,
  ShortcutConfig
} from './types';
import { DEFAULT_SHORTCUTS } from './constants/shortcuts';

// Hooks
import { useMasterData } from './hooks/useMasterData';
import { usePOSMachine } from './hooks/usePOSMachine';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { MainMenu } from './components/layout/MainMenu';
import { InventoryView } from './views/InventoryView';
import { PurchaseView } from './views/PurchaseView';
import { CategoriesView } from './views/CategoriesView';
import { CustomersView } from './views/CustomersView';
import { VendorsView } from './views/VendorsView';
import { UsersView } from './views/UsersView';
import { SaleHistoryView } from './views/SaleHistoryView';
import { ReportsView } from './views/ReportsView';
import { POSView } from './views/POSView';
import { MasterDataForm } from './components/common/MasterDataForm';
import { SettingsModal, ConfirmationModal } from './components/common/Modals';

export default function App() {
  const masterData = useMasterData();
  const posMachine = usePOSMachine(
    masterData.products, 
    masterData.customers, 
    DEFAULT_SHORTCUTS, 
    masterData.setSalesHistory
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: string, item: any } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ type: string, id: string | number, name: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastKeyPressed, setLastKeyPressed] = useState<{ key: string, label: string } | null>(null);

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Shortcut feedback effect
  useEffect(() => {
    if (lastKeyPressed) {
      const timer = setTimeout(() => setLastKeyPressed(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastKeyPressed]);

  // Context-aware shortcuts display
  const contextShortcuts = useMemo(() => {
    const shortcutValues = Object.values(DEFAULT_SHORTCUTS);
    if (masterData.view === 'pos') {
      return shortcutValues.filter(s => ['search', 'qty', 'disc', 'void', 'cash', 'debit', 'credit', 'settings'].includes(s.action));
    }
    if (masterData.view === 'menu') {
      return [
        { key: 'ARR/1-8', label: 'MOVE/SELECT' },
        { key: DEFAULT_SHORTCUTS.settings?.key || 'F12', label: 'CONFIG' },
        { key: 'ESC', label: 'EXIT SYS' },
      ];
    }
    const isMaster = ['products', 'categories', 'customers', 'vendors', 'users'].includes(masterData.view);
    if (isMaster) {
      return [
        { key: 'ADD', label: 'INSERT' },
        { key: 'ENT', label: 'MODIFY' },
        { key: 'DEL', label: 'REMOVE' },
        { key: 'TAB', label: 'LAYOUT' },
        { key: 'ESC', label: 'BACK' },
      ];
    }
    return [];
  }, [masterData.view]);

  // Universal Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Logic for shortcuts
      if (e.key === 'Escape') {
        if (pendingDelete) { setPendingDelete(null); return; }
        if (isSettingsOpen) { setIsSettingsOpen(false); return; }
        if (editingItem) { setEditingItem(null); return; }
        if (masterData.view !== 'menu') { masterData.setView('menu'); return; }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [masterData.view, pendingDelete, isSettingsOpen, editingItem]);

  // Event Handlers
  const handleAddNew = (type: string) => {
    let newItem: any = {};
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    switch(type) {
      case 'products': newItem = { id, sku: '', name: '', price: 0, category: '', stock: 0 }; break;
      case 'categories': newItem = { id, name: '', itemCount: 0 }; break;
      case 'customers': newItem = { id, name: '', phone: '', points: 0 }; break;
      case 'vendors': newItem = { id, name: '', contact: '', category: '' }; break;
      case 'users': newItem = { id, username: '', role: 'Cashier', lastSeen: '-', allowedModules: ['pos'] }; break;
      case 'purchase': newItem = { id: `PO/${new Date().getFullYear()}/${id}`, date: new Date().toISOString().split('T')[0], vendor: '', total: 0, status: 'Pending', items: [] }; break;
    }
    setEditingItem({ type, item: newItem });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const { type, item } = editingItem;
    switch(type) {
      case 'products': 
        masterData.setProducts(prev => {
          const exists = prev.find(p => p.id === item.id);
          return exists ? prev.map(p => p.id === item.id ? item : p) : [...prev, item];
        });
        break;
      case 'customers':
        masterData.setCustomers(prev => {
          const exists = prev.find(c => c.id === item.id);
          return exists ? prev.map(c => c.id === item.id ? item : c) : [...prev, item];
        });
        break;
      case 'vendors':
        masterData.setVendors(prev => {
          const exists = prev.find(v => v.id === item.id);
          return exists ? prev.map(v => v.id === item.id ? item : v) : [...prev, item];
        });
        break;
      case 'categories':
        masterData.setCategories(prev => {
          const exists = prev.find(c => c.id === item.id);
          return exists ? prev.map(c => c.id === item.id ? item : c) : [...prev, item];
        });
        break;
      case 'users':
        masterData.setUsers(prev => {
          const exists = prev.find(u => u.id === item.id);
          return exists ? prev.map(u => u.id === item.id ? item : u) : [...prev, item];
        });
        break;
      case 'purchase':
        masterData.setPurchases(prev => {
          const exists = prev.find(p => p.id === item.id);
          return exists ? prev.map(p => p.id === item.id ? item : p) : [...prev, item];
        });
        break;
    }
    setEditingItem(null);
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      masterData.handleDelete(pendingDelete.id.toString());
      setPendingDelete(null);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-slate-300 font-sans flex overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar 
        currentView={masterData.view} 
        setView={masterData.setView} 
        user={masterData.currentUser}
        onLogout={() => console.log('logout')}
      />

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* TOP STATUS BAR */}
        <header className="h-14 bg-slate-950/50 backdrop-blur-md border-b border-white/5 shrink-0 flex items-center px-8 justify-between relative">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               <span className="text-xs font-black text-white uppercase tracking-[0.2em]">System_Online</span>
            </div>
            <div className="h-4 w-px bg-white/5"></div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Terminal_Time</p>
               <p className="text-xl font-black text-white font-mono tracking-tighter tabular-nums leading-none">{currentTime.toLocaleTimeString([], { hour12: false })}</p>
            </div>
          </div>
        </header>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {editingItem ? (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col bg-slate-950 overflow-hidden"
            >
              <div className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-10 shadow-xl shrink-0">
                <button onClick={() => setEditingItem(null)} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-slate-600 transition-all">
                      <ChevronLeft size={20} />
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest">Discard and exit</span>
                </button>
                <button onClick={handleSaveEdit} className="flex items-center gap-4 px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-900/40">
                   <Save size={18} /> Commit changes
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MasterDataForm 
                  type={editingItem.type} 
                  item={editingItem.item} 
                  setItem={(i) => setEditingItem({ ...editingItem, item: i })} 
                  categories={masterData.categories}
                  vendors={masterData.vendors}
                  products={masterData.products}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={masterData.view}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {masterData.view === 'menu' && (
                <MainMenu 
                  user={masterData.currentUser} 
                  onSelectModule={masterData.setView} 
                  onLogout={() => console.log('logout')}
                />
              )}
              
              {masterData.view === 'pos' && (
                <POSView 
                  {...posMachine} 
                  customers={masterData.customers} 
                  shortcuts={DEFAULT_SHORTCUTS}
                />
              )}

              {masterData.view === 'products' && (
                <InventoryView 
                  data={masterData.products} 
                  onEdit={(p) => setEditingItem({ type: 'products', item: p })}
                  onAdd={() => handleAddNew('products')}
                  onDelete={(id) => setPendingDelete({ type: 'products', id, name: masterData.products.find(p => p.id === id)?.name || id })}
                  setView={masterData.setView}
                  selectedIndex={masterData.selectedMasterIndex}
                  setSelectedIndex={masterData.setSelectedMasterIndex}
                  displayMode={masterData.displayMode}
                  onToggleMode={() => masterData.setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
                  searchQuery={masterData.masterSearch}
                  onSearchChange={masterData.setMasterSearch}
                  sortOrder={masterData.masterSort}
                  setSortOrder={masterData.setMasterSort}
                  shortcuts={DEFAULT_SHORTCUTS}
                  filters={masterData.productFilters}
                  setFilters={masterData.setProductFilters}
                  isFilterOpen={masterData.isFilterPanelOpen}
                  setIsFilterOpen={masterData.setIsFilterPanelOpen}
                  categories={masterData.categories}
                />
              )}

              {masterData.view === 'purchase' && (
                <PurchaseView 
                  data={masterData.purchases}
                  onEdit={(po) => setEditingItem({ type: 'purchase', item: po })}
                  onAdd={() => handleAddNew('purchase')}
                  onDelete={(id) => setPendingDelete({ type: 'purchase', id, name: id })}
                  setView={masterData.setView}
                  selectedIndex={masterData.selectedMasterIndex}
                  setSelectedIndex={masterData.setSelectedMasterIndex}
                  displayMode={masterData.displayMode}
                  onToggleMode={() => masterData.setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
                  searchQuery={masterData.masterSearch}
                  onSearchChange={masterData.setMasterSearch}
                  shortcuts={DEFAULT_SHORTCUTS}
                />
              )}

              {masterData.view === 'categories' && (
                <CategoriesView 
                  data={masterData.categories}
                  onEdit={(c) => setEditingItem({ type: 'categories', item: c })}
                  onAdd={() => handleAddNew('categories')}
                  onDelete={(id) => setPendingDelete({ type: 'categories', id, name: masterData.categories.find(c => c.id === id)?.name || id })}
                  setView={masterData.setView}
                  selectedIndex={masterData.selectedMasterIndex}
                  setSelectedIndex={masterData.setSelectedMasterIndex}
                  displayMode={masterData.displayMode}
                  onToggleMode={() => masterData.setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
                  searchQuery={masterData.masterSearch}
                  onSearchChange={masterData.setMasterSearch}
                  shortcuts={DEFAULT_SHORTCUTS}
                />
              )}

              {masterData.view === 'customers' && (
                <CustomersView 
                   data={masterData.customers}
                   onEdit={(c) => setEditingItem({ type: 'customers', item: c })}
                   onAdd={() => handleAddNew('customers')}
                   onDelete={(id) => setPendingDelete({ type: 'customers', id, name: masterData.customers.find(c => c.id === id)?.name || id })}
                   setView={masterData.setView}
                   selectedIndex={masterData.selectedMasterIndex}
                   setSelectedIndex={masterData.setSelectedMasterIndex}
                   displayMode={masterData.displayMode}
                   onToggleMode={() => masterData.setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
                   searchQuery={masterData.masterSearch}
                   onSearchChange={masterData.setMasterSearch}
                   shortcuts={DEFAULT_SHORTCUTS}
                />
              )}

              {masterData.view === 'vendors' && (
                <VendorsView 
                   data={masterData.vendors}
                   onEdit={(v) => setEditingItem({ type: 'vendors', item: v })}
                   onAdd={() => handleAddNew('vendors')}
                   onDelete={(id) => setPendingDelete({ type: 'vendors', id, name: masterData.vendors.find(v => v.id === id)?.name || id })}
                   setView={masterData.setView}
                   selectedIndex={masterData.selectedMasterIndex}
                   setSelectedIndex={masterData.setSelectedMasterIndex}
                   displayMode={masterData.displayMode}
                   onToggleMode={() => masterData.setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
                   searchQuery={masterData.masterSearch}
                   onSearchChange={masterData.setMasterSearch}
                   shortcuts={DEFAULT_SHORTCUTS}
                />
              )}

              {masterData.view === 'users' && (
                <UsersView 
                   data={masterData.users}
                   onEdit={(u) => setEditingItem({ type: 'users', item: u })}
                   onAdd={() => handleAddNew('users')}
                   onDelete={(id) => setPendingDelete({ type: 'users', id, name: masterData.users.find(u => u.id === id)?.username || id })}
                   setView={masterData.setView}
                   selectedIndex={masterData.selectedMasterIndex}
                   setSelectedIndex={masterData.setSelectedMasterIndex}
                   displayMode={masterData.displayMode}
                   onToggleMode={() => masterData.setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
                   searchQuery={masterData.masterSearch}
                   onSearchChange={masterData.setMasterSearch}
                   shortcuts={DEFAULT_SHORTCUTS}
                   currentUser={masterData.currentUser}
                   setCurrentUser={masterData.setCurrentUser}
                />
              )}

              {masterData.view === 'history' && (
                <SaleHistoryView 
                  data={masterData.salesHistory} 
                  setView={masterData.setView} 
                  shortcuts={DEFAULT_SHORTCUTS}
                />
              )}

              {masterData.view === 'reports' && (
                <ReportsView 
                  setView={masterData.setView} 
                  shortcuts={DEFAULT_SHORTCUTS}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-10 bg-slate-950/80 backdrop-blur-md border-t border-white/5 shrink-0 flex items-center px-6 gap-6 z-[100] relative mt-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SHRT_CUTS</span>
          </div>
          <div className="flex items-center gap-6">
            {contextShortcuts.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 bg-slate-900 border border-white/10 rounded text-white text-[10px] font-mono shadow-inner">{s.key}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{s.label}</span>
              </div>
            ))}
          </div>
          
          <div className="ml-auto flex items-center gap-6">
             {lastKeyPressed && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="px-4 py-1 bg-blue-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-600/30"
                >
                   <span>LOG_SIGNAL: {lastKeyPressed?.key}</span>
                </motion.div>
             )}
             <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
               <Settings size={14} className="group-hover:rotate-90 transition-transform" />
               MATRIX_CFG [F12]
             </button>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        shortcuts={DEFAULT_SHORTCUTS}
        onShortcutUpdate={(k, v) => console.log('shortcut update', k, v)}
      />
      
      <ConfirmationModal 
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Critical Erasure Sequence"
        message={`Warning: You are about to permanently delete "${pendingDelete?.name}" from the persistent registry. This operation cannot be reversed.`}
        confirmText="Confirm Erasure"
      />
    </div>
  );
}
