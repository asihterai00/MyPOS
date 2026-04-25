import { useState } from 'react';
import { Product, Customer, Vendor, Category, User, PurchaseOrder, Sale, ViewState } from '../types';
import { 
  MOCK_PRODUCTS, 
  MOCK_CUSTOMERS, 
  MOCK_VENDORS, 
  MOCK_CATEGORIES, 
  MOCK_USERS, 
  MOCK_PURCHASES, 
  MOCK_SALES 
} from '../constants/mockData';

export const useMasterData = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(MOCK_PURCHASES);
  const [salesHistory, setSalesHistory] = useState<Sale[]>(MOCK_SALES);
  
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [view, setView] = useState<ViewState>('menu');
  
  // Master List Shared States
  const [selectedMasterIndex, setSelectedMasterIndex] = useState(-1);
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');
  const [masterSearch, setMasterSearch] = useState('');
  const [masterSort, setMasterSort] = useState<'asc' | 'desc'>('asc');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [productFilters, setProductFilters] = useState({
    categories: [] as string[],
    minPrice: 0,
    maxPrice: 1000000,
    minStock: 0,
    maxStock: 5000
  });

  const handleDelete = (id: string) => {
    switch(view) {
      case 'products': setProducts(prev => prev.filter(p => p.id !== id)); break;
      case 'customers': setCustomers(prev => prev.filter(c => c.id !== id)); break;
      case 'vendors': setVendors(prev => prev.filter(v => v.id !== id)); break;
      case 'categories': setCategories(prev => prev.filter(c => c.id !== id)); break;
      case 'users': setUsers(prev => prev.filter(u => u.id !== id)); break;
    }
  };

  return {
    products, setProducts,
    customers, setCustomers,
    vendors, setVendors,
    categories, setCategories,
    users, setUsers,
    purchases, setPurchases,
    salesHistory, setSalesHistory,
    currentUser, setCurrentUser,
    view, setView,
    selectedMasterIndex, setSelectedMasterIndex,
    displayMode, setDisplayMode,
    masterSearch, setMasterSearch,
    masterSort, setMasterSort,
    isFilterPanelOpen, setIsFilterPanelOpen,
    productFilters, setProductFilters,
    handleDelete
  };
};
