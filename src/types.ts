export interface ProductVariant {
  id: string;
  name: string; // e.g. "Small", "Blue"
  sku: string;
  price: number;
  stock: number;
}

export interface ProductUnit {
  unit: string;
  price: number;
  cost: number;
  stock: number;
  safety: number;
  redPercent: number;
  yellowPercent: number;
  greenPercent: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  description?: string;
  alias1?: string;
  alias2?: string;
  isActive?: boolean;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  units?: ProductUnit[];
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  vendor: string;
  total: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  items: PurchaseOrderItem[];
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
}

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Cashier' | 'Manager';
  lastSeen: string;
  allowedModules: string[]; // List of module IDs they can access
}

export interface CartItem extends Product {
  quantity: number;
  discount: number;
  variantId?: string;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discountTotal?: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
}

export interface ShortcutConfig {
  key: string;
  action: string;
  label: string;
}

export type ViewState = 'menu' | 'pos' | 'products' | 'purchase' | 'categories' | 'customers' | 'vendors' | 'users' | 'history' | 'reports';
