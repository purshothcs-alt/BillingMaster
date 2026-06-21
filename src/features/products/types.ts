export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  reorderLevel: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type ProductFormValues = Omit<Product, 'id' | 'createdAt'>;

export const PRODUCT_UNITS = ['pcs', 'kg', 'litre', 'box', 'pack', 'dozen'] as const;
