import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Product, ProductVariant, CartItem, Sale, Customer, ShortcutConfig } from '../types';

export const usePOSMachine = (
  products: Product[],
  customers: Customer[],
  shortcuts: Record<string, ShortcutConfig>,
  setSalesHistory: React.Dispatch<React.SetStateAction<Sale[]>>
) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInput, setActiveInput] = useState<'search' | 'qty' | 'disc'>('search');
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [posCustomer, setPosCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const grandTotal = subtotal; // Simplified, add tax/discount logic here if needed

  const productSearchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const lowerQuery = searchQuery.toLowerCase();
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
  }, [searchQuery, products]);

  const addItem = useCallback((p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id && !item.variantId);
      if (existing) {
        return prev.map(item => item.id === p.id && !item.variantId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...p, quantity: 1, discount: 0 }];
    });
    setSearchQuery('');
    setSelectedItemIndex(cart.length);
  }, [cart.length]);

  const handleVariantSelect = useCallback((p: Product, v: ProductVariant) => {
    const variantId = `${p.id}-${v.id}`;
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        ...p, 
        id: variantId, 
        variantId: variantId, 
        sku: v.sku, 
        name: `${p.name} (${v.name})`, 
        price: v.price, 
        stock: v.stock, 
        quantity: 1, 
        discount: 0 
      }];
    });
    setSearchQuery('');
    setSelectedItemIndex(cart.length);
  }, [cart.length]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (productSearchResults.length === 1) {
      const res = productSearchResults[0];
      if (res.variant) handleVariantSelect(res.product, res.variant);
      else addItem(res.product);
    }
  }, [productSearchResults, handleVariantSelect, addItem]);

  const handlePayment = useCallback((method: string) => {
    if (cart.length === 0) return;
    
    const newSale: Sale = {
      id: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      items: [...cart],
      subtotal,
      total: grandTotal,
      paymentMethod: method.toUpperCase(),
      customerName: posCustomer?.name || 'Walk-in Customer'
    };

    setSalesHistory(prev => [newSale, ...prev]);
    setCart([]);
    setPosCustomer(null);
    setSelectedItemIndex(-1);
  }, [cart, subtotal, grandTotal, posCustomer, setSalesHistory]);

  const handleVoid = useCallback(() => {
    // Usually would show confirm modal, handled in App.tsx for now or here
    setCart([]);
    setSelectedItemIndex(-1);
  }, []);

  return {
    cart,
    setCart,
    searchQuery,
    setSearchQuery,
    activeInput,
    setActiveInput,
    selectedItemIndex,
    setSelectedItemIndex,
    posCustomer,
    setPosCustomer,
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    searchInputRef,
    subtotal,
    grandTotal,
    productSearchResults,
    addItem,
    handleVariantSelect,
    handleSearch,
    handlePayment,
    handleVoid
  };
};
