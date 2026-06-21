import { baseApi } from '@/services/api/baseApi';
import type { PurchaseOrder, PurchaseOrderFormValues, PurchaseOrderStatus } from '../types';

export const purchasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query<PurchaseOrder[], void>({
      query: () => '/purchases',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Purchase' as const, id })), { type: 'Purchase', id: 'LIST' }]
          : [{ type: 'Purchase', id: 'LIST' }],
    }),
    createPurchaseOrder: builder.mutation<PurchaseOrder, PurchaseOrderFormValues>({
      query: (body) => ({ url: '/purchases', method: 'POST', body }),
      invalidatesTags: [{ type: 'Purchase', id: 'LIST' }],
    }),
    updatePurchaseOrderStatus: builder.mutation<PurchaseOrder, { id: string; status: PurchaseOrderStatus }>({
      query: ({ id, status }) => ({ url: `/purchases/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Purchase', id },
        { type: 'Purchase', id: 'LIST' },
        'Inventory',
      ],
    }),
    deletePurchaseOrder: builder.mutation<void, string>({
      query: (id) => ({ url: `/purchases/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Purchase', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderStatusMutation,
  useDeletePurchaseOrderMutation,
} = purchasesApi;
