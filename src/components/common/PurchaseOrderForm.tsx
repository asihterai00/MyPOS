import React, { useState } from 'react';
import { Search, ChevronRight, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { PurchaseOrder, Vendor, Product, PurchaseOrderItem, ProductVariant } from '../../types';

interface PurchaseOrderFormProps {
  item: PurchaseOrder;
  setItem: (item: PurchaseOrder) => void;
  vendors: Vendor[];
  products: Product[];
}

export const PurchaseOrderForm = ({ 
  item, 
  setItem, 
  vendors, 
  products 
}: PurchaseOrderFormProps) => {
  const [vendorSearch, setVendorSearch] = useState('');
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState<Record<number, string>>({});
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);

  const addItem = () => {
    setItem({
      ...item,
      items: [
        ...item.items,
        { productId: '', productName: '', quantity: 1, unitPrice: 0 }
      ]
    });
  };

  const removeItem = (index: number) => {
    const newItems = item.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    setItem({ ...item, items: newItems, total: newTotal });
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...item.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unitPrice = product.price;
      }
    }

    const newTotal = newItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    setItem({ ...item, items: newItems, total: newTotal });
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const getFilteredItems = (search: string) => {
    if (!search) return [];
    const lowerQuery = search.toLowerCase();
    const results: Array<{ product: Product; variant?: ProductVariant }> = [];
    products.forEach(p => {
      const matchProduct = p.name.toLowerCase().includes(lowerQuery) || p.sku.toLowerCase().includes(lowerQuery);
      if (matchProduct) {
        if (p.hasVariants && p.variants && p.variants.length > 0) {
          p.variants.forEach(v => results.push({ product: p, variant: v }));
        } else {
          results.push({ product: p });
        }
      } else if (p.hasVariants && p.variants) {
        p.variants.forEach(v => {
          if (v.name.toLowerCase().includes(lowerQuery) || v.sku.toLowerCase().includes(lowerQuery)) {
            results.push({ product: p, variant: v });
          }
        });
      }
    });
    return results.slice(0, 10);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-40 py-10 px-6">
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">PO REFERENCE IDENTIFIER</label>
          <input 
            className="w-full bg-slate-900 border-2 border-slate-800 p-4 text-xl font-bold text-blue-500 outline-none focus:border-blue-500 rounded-xl transition-all uppercase"
            value={item.id}
            onChange={e => setItem({ ...item, id: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">TRANSACTION TIMESTAMP</label>
          <input 
            type="date"
            className="w-full bg-slate-900 border-2 border-slate-800 p-4 text-xl font-bold text-white outline-none focus:border-blue-500 rounded-xl transition-all"
            value={item.date}
            onChange={e => setItem({ ...item, date: e.target.value })}
          />
        </div>
        
        <div className="space-y-4 relative">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">SUPPLIER / VENDOR SELECTION</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Search className="text-slate-600" size={20} />
            </div>
            <input 
              className="w-full bg-slate-900 border-2 border-slate-800 p-4 pl-12 text-xl font-bold text-white outline-none focus:border-blue-500 rounded-xl transition-all uppercase placeholder:text-slate-700"
              placeholder={item.vendor || "SEARCH SYSTEM VENDORS..."}
              value={vendorSearch}
              onFocus={() => setIsVendorOpen(true)}
              onChange={e => {
                setVendorSearch(e.target.value);
                setIsVendorOpen(true);
              }}
            />
            {isVendorOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border-2 border-blue-600/30 z-[100] max-h-72 overflow-y-auto custom-scrollbar shadow-2xl rounded-2xl overflow-hidden p-2">
                {filteredVendors.map(v => (
                    <button
                    key={v.id}
                    type="button"
                    className="w-full text-left p-4 hover:bg-blue-600/10 text-white rounded-xl border-b border-slate-800 last:border-none flex justify-between items-center group transition-all"
                    onClick={() => {
                      setItem({ ...item, vendor: v.name });
                      setVendorSearch('');
                      setIsVendorOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                       <span className="text-lg font-black uppercase tracking-tight group-hover:text-blue-400">{v.name}</span>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">V_ID: {v.id}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-800 group-hover:text-blue-500" />
                  </button>
                ))}
                {filteredVendors.length === 0 && <div className="p-10 text-center text-xs font-black text-slate-600 uppercase tracking-widest italic">No match in vendor registry</div>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">ORDER PRIORITY STATUS</label>
          <select 
            className="w-full bg-slate-900 border-2 border-slate-800 p-4 text-xl font-bold text-white outline-none focus:border-blue-500 rounded-xl transition-all uppercase appearance-none cursor-pointer"
            value={item.status}
            onChange={e => setItem({ ...item, status: e.target.value as any })}
          >
            <option value="Pending">Pending Validation</option>
            <option value="Received">Procurement Finalized</option>
            <option value="Cancelled">Voided Transaction</option>
          </select>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-800/50">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-xl font-black text-white uppercase tracking-tight">Line Item Procurement</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Detailed inventory requirement mapping</p>
          </div>
          <button 
            type="button"
            onClick={addItem}
            className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all rounded-xl shadow-lg shadow-blue-900/40"
          >
            <Plus size={18} /> Add New Entry
          </button>
        </div>

        <div className="bg-slate-900/50 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="p-6">NOMENCLATURE / SPECIFICATION</th>
                <th className="p-6 w-40 text-center">QUANTITY</th>
                <th className="p-6 w-48 text-right">UNIT_RETAIL_P</th>
                <th className="p-6 w-48 text-right">TOTAL_VALUATION</th>
                <th className="p-6 w-24 text-center">OP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {item.items.map((it, idx) => (
                <tr key={idx} className="bg-slate-950/20 group hover:bg-blue-600/[0.02] transition-all">
                  <td className="p-4 relative">
                    <input 
                      className="w-full bg-slate-950 border-2 border-slate-800 p-4 text-lg font-black text-white outline-none focus:border-blue-500 rounded-xl transition-all uppercase placeholder:text-slate-800"
                      placeholder={it.productName || "SCAN OR SEARCH ITEM..."}
                      value={itemSearch[idx] || ''}
                      onFocus={() => setActiveItemIdx(idx)}
                      onChange={e => {
                        setItemSearch({ ...itemSearch, [idx]: e.target.value });
                        setActiveItemIdx(idx);
                      }}
                    />
                    {activeItemIdx === idx && (
                      <div className="absolute top-full left-4 right-4 mt-2 bg-slate-900 border-2 border-blue-600/30 z-[120] max-h-72 overflow-y-auto custom-scrollbar shadow-2xl rounded-2xl p-2">
                        {getFilteredItems(itemSearch[idx] || '').map((res, sIdx) => (
                          <button
                            key={`${res.product.id}-${res.variant?.id || sIdx}`}
                            type="button"
                            className="w-full text-left p-4 hover:bg-blue-600/10 text-white rounded-xl border-b border-slate-800 last:border-none flex justify-between items-center group transition-all"
                            onClick={() => {
                              const name = res.variant ? `${res.product.name} (${res.variant.name})` : res.product.name;
                              const price = res.variant ? res.variant.price : res.product.price;
                              
                              const finalItems = [...item.items];
                              finalItems[idx] = {
                                ...finalItems[idx],
                                productId: res.product.id,
                                productName: name,
                                unitPrice: price
                              };
                              const finalTotal = finalItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
                              setItem({ ...item, items: finalItems, total: finalTotal });

                              setItemSearch({ ...itemSearch, [idx]: '' });
                              setActiveItemIdx(null);
                            }}
                          >
                            <div className="flex flex-col">
                               <span className="text-lg font-black uppercase tracking-tight group-hover:text-blue-400">{res.product.name} {res.variant && <span className="text-blue-500">({res.variant.name})</span>}</span>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 font-mono italic">SKU_REF: {res.variant?.sku || res.product.sku}</span>
                            </div>
                            <div className="text-right">
                               <span className="text-lg font-black text-emerald-500">Rp {(res.variant?.price || res.product.price).toLocaleString()}</span>
                            </div>
                          </button>
                        ))}
                        {getFilteredItems(itemSearch[idx] || '').length === 0 && <div className="p-10 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Item not identified in registry</div>}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <input 
                      type="number"
                      className="w-full bg-slate-950 border-2 border-slate-800 p-4 text-xl font-black text-white outline-none text-center focus:border-blue-500 rounded-xl"
                      value={it.quantity}
                      onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      type="number"
                      className="w-full bg-slate-950 border-2 border-slate-800 p-4 text-xl font-bold text-emerald-500 outline-none text-right focus:border-blue-500 rounded-xl"
                      value={it.unitPrice}
                      onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-6 text-right font-sans text-xl font-black text-slate-400 tracking-tight">
                    <span className="text-xs mr-2 opacity-30">Rp</span>
                    {(it.quantity * it.unitPrice).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="w-12 h-12 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-900/20 flex items-center justify-center shadow-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {item.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                       <ShoppingCart size={64} className="text-slate-600" />
                       <p className="text-xl font-black text-slate-500 uppercase tracking-[0.2em]">Transaction Registry Empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-950/80 backdrop-blur-xl border-t-2 border-slate-800">
              <tr>
                <td colSpan={3} className="p-10 text-right">
                   <span className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Cumulative Order Valuation</span>
                </td>
                <td className="p-10 text-right">
                  <div className="flex flex-col items-end">
                     <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 leading-none">Final Gross Total</span>
                     <span className="text-5xl font-black text-white tracking-tighter">
                        <span className="text-sm mr-4 text-slate-700 italic">RP</span>
                        {item.total.toLocaleString()}
                     </span>
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Dropdown Backdrop */}
      {(isVendorOpen || activeItemIdx !== null) && (
        <div 
          className="fixed inset-0 z-40 bg-black/20" 
          onClick={() => {
            setIsVendorOpen(false);
            setActiveItemIdx(null);
          }}
        />
      )}
    </div>
  );
};
