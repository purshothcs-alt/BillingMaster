import { baseApi } from '@/services/api/baseApi';
import type { DateRangeFilter, InventoryReportRow, PurchaseReportRow, SalesReportRow } from '../types';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<SalesReportRow[], DateRangeFilter>({
      query: ({ from, to }) => ({ url: '/reports/sales', params: { from, to } }),
      providesTags: ['Report'],
    }),
    getInventoryReport: builder.query<InventoryReportRow[], void>({
      query: () => '/reports/inventory',
      providesTags: ['Report'],
    }),
    getPurchaseReport: builder.query<PurchaseReportRow[], DateRangeFilter>({
      query: ({ from, to }) => ({ url: '/reports/purchases', params: { from, to } }),
      providesTags: ['Report'],
    }),
  }),
});

export const { useGetSalesReportQuery, useGetInventoryReportQuery, useGetPurchaseReportQuery } = reportsApi;
