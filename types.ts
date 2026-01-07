
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  description: string;
  lastUpdated: string;
}

export type MovementType = 'in' | 'out';

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  date: string;
  reason: string;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  topCategory: string;
}

// Added AIInsight interface to fix the module error in geminiService.ts
export interface AIInsight {
  title: string;
  description: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}
