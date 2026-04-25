import React from 'react';
import { Product, Category, Customer, Vendor, User, PurchaseOrder } from '../../types';
import { PurchaseOrderForm } from './PurchaseOrderForm';

interface MasterDataFormProps {
  type: string;
  item: any;
  setItem: (item: any) => void;
  categories?: Category[];
  vendors?: Vendor[];
  products?: Product[];
}

export const MasterDataForm = ({ type, item, setItem, categories = [], vendors = [], products = [] }: MasterDataFormProps) => {
  if (type === 'purchase') {
    return <PurchaseOrderForm item={item} setItem={setItem} vendors={vendors} products={products} />;
  }

  // Simple generic form for other types - can be expanded as needed
  const fields = getFieldsForType(type, item);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
       <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-800 bg-slate-950/50">
             <h2 className="text-3xl font-black text-white uppercase tracking-tight">Modify {type.slice(0, -1)} Registry</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Entity Update Sequence Initiated</p>
          </div>
          <div className="p-10 space-y-8">
             {fields.map(f => (
                <div key={f.key} className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{f.label}</label>
                   {f.type === 'select' ? (
                      <select 
                        className="w-full bg-slate-950 border-2 border-slate-800 p-4 text-xl font-bold text-white outline-none focus:border-blue-500 rounded-2xl transition-all appearance-none cursor-pointer"
                        value={item[f.key]}
                        onChange={e => setItem({ ...item, [f.key]: e.target.value })}
                      >
                         {f.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                   ) : (
                      <input 
                        type={f.type || 'text'}
                        className="w-full bg-slate-950 border-2 border-slate-800 p-4 text-xl font-bold text-white outline-none focus:border-blue-500 rounded-2xl transition-all"
                        value={item[f.key]}
                        onChange={e => setItem({ ...item, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                        placeholder={`ENTER ${f.label}...`}
                      />
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const getFieldsForType = (type: string, item: any) => {
  switch(type) {
    case 'products':
      return [
        { key: 'sku', label: 'SKU_IDENTIFIER' },
        { key: 'name', label: 'PRODUCT_NOMENCLATURE' },
        { key: 'price', label: 'UNIT_RETAIL_VALUATION', type: 'number' },
        { key: 'stock', label: 'INVENTORY_QUANTUM', type: 'number' },
        { key: 'category', label: 'SYSTEM_CLASSIFICATION' }
      ];
    case 'categories':
      return [{ key: 'name', label: 'CATEGORY_SPECIFICATION' }];
    case 'customers':
      return [
        { key: 'name', label: 'CLIENT_IDENTITY' },
        { key: 'phone', label: 'COMMUNICATION_LINK' },
        { key: 'points', label: 'LOYALTY_MATRIX_VALUE', type: 'number' }
      ];
    case 'vendors':
      return [
        { key: 'name', label: 'SUPPLIER_IDENTITY' },
        { key: 'contact', label: 'COMMUNICATION_LINK' }
      ];
    case 'users':
      return [
        { key: 'username', label: 'ACCESS_IDENTITY' },
        { key: 'role', label: 'PRIVILEGE_LEVEL', type: 'select', options: ['Admin', 'Cashier', 'Manager'] }
      ];
    default:
      return [];
  }
};
