import { ShortcutConfig } from "../types";

export const DEFAULT_SHORTCUTS: Record<string, ShortcutConfig> = {
  search: { key: 'F1', action: 'search', label: 'Item Search' },
  qty: { key: 'F2', action: 'qty', label: 'Modify Quantity' },
  disc: { key: 'F3', action: 'disc', label: 'Line Discount' },
  customer: { key: 'F4', action: 'customer', label: 'Select Client' },
  total: { key: 'F9', action: 'total', label: 'Execute Total' },
  cash: { key: 'F10', action: 'cash', label: 'Cash Payment' },
  card: { key: 'F11', action: 'card', label: 'Card Payment' },
  void: { key: 'F12', action: 'void', label: 'Void Transaction' },
  menu: { key: 'ESCAPE', action: 'menu', label: 'Return to Menu' }
};
