import { Product, PurchaseOrder, Category, Customer, Vendor, User, Sale } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', sku: '1001', name: 'Indomie Goreng', price: 3500, category: 'Snacks', stock: 1200, isActive: true,
    units: [
      { unit: 'Piece', price: 3500, cost: 2800, stock: 1200, safety: 100, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
      { unit: 'Pack', price: 42000, cost: 33000, stock: 100, safety: 10, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
      { unit: 'Karton', price: 160000, cost: 125000, stock: 25, safety: 5, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
    ]
  },
  { 
    id: '2', sku: '1002', name: 'Aqua 600ml', price: 4000, category: 'Beverages', stock: 800, isActive: true,
    units: [
      { unit: 'Botol', price: 4000, cost: 2500, stock: 800, safety: 80, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
      { unit: 'Pack', price: 45000, cost: 28000, stock: 80, safety: 8, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
      { unit: 'Dus', price: 170000, cost: 110000, stock: 20, safety: 2, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
    ]
  },
  { 
    id: '3', sku: '1003', name: 'Coca Cola 1.5L', price: 18000, category: 'Beverages', stock: 300, isActive: true,
    units: [
      { unit: 'Botol', price: 18000, cost: 12000, stock: 300, safety: 30, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
      { unit: 'Pack', price: 100000, cost: 68000, stock: 40, safety: 4, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
    ]
  },
  { 
    id: '4', sku: '1004', name: 'Beras Rojolele 5kg', price: 18000, category: 'Groceries', stock: 500, isActive: true,
    units: [
      { unit: 'Kg', price: 18000, cost: 14000, stock: 500, safety: 50, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
      { unit: 'Sak', price: 850000, cost: 680000, stock: 15, safety: 2, redPercent: 0, yellowPercent: 25, greenPercent: 50 },
    ]
  }
];

export const MOCK_PURCHASES: PurchaseOrder[] = [
  { id: 'PO/2026/01/01', date: '2026-01-06', vendor: 'PT. Sumber Makmur', total: 2485000, status: 'Received', items: [] },
  { id: 'PO/2026/01/02', date: '2026-01-07', vendor: 'CV. Aneka Minuman', total: 1096600, status: 'Received', items: [] },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Beverages', itemCount: 10 },
  { id: '2', name: 'Snacks', itemCount: 15 },
  { id: '3', name: 'Groceries', itemCount: 25 },
  { id: '4', name: 'Dairy', itemCount: 12 },
  { id: '5', name: 'Bakery', itemCount: 8 },
  { id: '6', name: 'Household', itemCount: 20 },
  { id: '7', name: 'Electronics', itemCount: 5 },
  { id: '8', name: 'Apparel', itemCount: 18 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Budi Santoso', phone: '08123', points: 120 },
  { id: '2', name: 'Siti Aminah', phone: '08198', points: 85 },
  { id: '3', name: 'Toko Maju', phone: '02155', points: 450 },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: '1', name: 'PT. Sumber Makmur', contact: '021-5551234', category: 'General' },
  { id: '2', name: 'CV. Aneka Minuman', contact: '0812-3333', category: 'Beverages' },
];

export const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', role: 'Admin', lastSeen: '2026-04-25 19:20', allowedModules: ['pos', 'purchase', 'products', 'categories', 'customers', 'vendors', 'users', 'history', 'reports'] },
  { id: '2', username: 'cashier', role: 'Cashier', lastSeen: '2026-02-02 22:55', allowedModules: ['pos'] },
  { id: '3', username: 'spv', role: 'Manager', lastSeen: '2026-01-11 00:08', allowedModules: ['pos', 'purchase', 'products', 'categories', 'customers', 'vendors', 'history', 'reports'] },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'INV/20260106/8343',
    date: '2026-01-06 23:08',
    items: [
      { id: '4', sku: '1004', name: 'Beras Rojolele 5kg', price: 18000, category: 'Electronics', stock: 500, quantity: 2, discount: 0 },
    ],
    subtotal: 214500,
    discountTotal: 0,
    total: 218100,
    paymentMethod: 'CASH',
    customerName: 'Toko Maju'
  }
];
