export interface SalesSummary {
  todaySales: number;
  todaySalesTrend: number;
  totalOrders: number;
  totalOrdersTrend: number;
  averageOrderValue: number;
  averageOrderValueTrend: number;
  totalCustomers: number;
  totalCustomersTrend: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  expenses: number;
}

export interface CategorySales {
  category: string;
  value: number;
}

export interface LowStockAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
}

export interface RecentSale {
  id: string;
  invoiceNo: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}
