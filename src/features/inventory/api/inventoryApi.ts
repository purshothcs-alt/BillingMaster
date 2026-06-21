import { baseApi } from '@/services/api/baseApi';
import type { InventoryItem, StockAdjustmentInput, StockMovement } from '../types';

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryItem[], void>({
      query: () => '/inventory',
      providesTags: ['Inventory'],
    }),
    getStockMovements: builder.query<StockMovement[], { productId?: string } | void>({
      query: (params) => ({ url: '/inventory/movements', params: params ?? undefined }),
      providesTags: ['StockMovement'],
    }),
    adjustStock: builder.mutation<InventoryItem, StockAdjustmentInput>({
      query: (body) => ({ url: '/inventory/adjust', method: 'POST', body }),
      invalidatesTags: ['Inventory', 'StockMovement', 'Dashboard'],
    }),
  }),
});

export const { useGetInventoryQuery, useGetStockMovementsQuery, useAdjustStockMutation } = inventoryApi;
