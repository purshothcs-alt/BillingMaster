export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  warehouse: string;
  updatedAt: string;
}

export type StockMovementType = 'in' | 'out' | 'adjustment';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export interface StockAdjustmentInput {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
}
