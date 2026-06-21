import { baseApi } from '@/services/api/baseApi';
import type { CategorySales, LowStockAlert, RecentSale, RevenuePoint, SalesSummary } from '../types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesSummary: builder.query<SalesSummary, void>({
      query: () => '/dashboard/sales-summary',
      providesTags: ['Dashboard'],
    }),
    getRevenueChart: builder.query<RevenuePoint[], { range: '7d' | '30d' | '12m' }>({
      query: ({ range }) => `/dashboard/revenue?range=${range}`,
      providesTags: ['Dashboard'],
    }),
    getCategorySales: builder.query<CategorySales[], void>({
      query: () => '/dashboard/category-sales',
      providesTags: ['Dashboard'],
    }),
    getLowStockAlerts: builder.query<LowStockAlert[], void>({
      query: () => '/dashboard/low-stock-alerts',
      providesTags: ['Dashboard'],
    }),
    getRecentSales: builder.query<RecentSale[], void>({
      query: () => '/dashboard/recent-sales',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetSalesSummaryQuery,
  useGetRevenueChartQuery,
  useGetCategorySalesQuery,
  useGetLowStockAlertsQuery,
  useGetRecentSalesQuery,
} = dashboardApi;
