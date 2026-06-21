export interface DateRangeFilter {
  from: string;
  to: string;
}

export interface SalesReportRow {
  date: string;
  invoiceCount: number;
  grossSales: number;
  discounts: number;
  netSales: number;
}

export interface InventoryReportRow {
  productName: string;
  sku: string;
  currentStock: number;
  unitCost: number;
  stockValue: number;
}

export interface PurchaseReportRow {
  poNumber: string;
  supplierName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}
