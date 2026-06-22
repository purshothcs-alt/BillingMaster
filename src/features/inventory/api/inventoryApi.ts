import { baseApi } from '@/services/api/baseApi';
import type { BulkImportResult } from '@/shared/types/bulkImport';
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
    bulkImportInventoryAdjustments: builder.mutation<BulkImportResult<InventoryItem>, FormData>({
      query: (formData) => ({ url: '/inventory/import', method: 'POST', body: formData }),
      invalidatesTags: ['Inventory', 'StockMovement', 'Dashboard'],
    }),
    downloadInventoryImportTemplate: builder.query<Blob, void>({
      query: () => ({ url: '/inventory/import/template', responseHandler: (response) => response.blob() }),
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetStockMovementsQuery,
  useAdjustStockMutation,
  useBulkImportInventoryAdjustmentsMutation,
  useLazyDownloadInventoryImportTemplateQuery,
} = inventoryApi;
