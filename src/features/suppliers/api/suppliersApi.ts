import { baseApi } from '@/services/api/baseApi';
import type { Supplier, SupplierFormValues } from '../types';

export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<Supplier[], void>({
      query: () => '/suppliers',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Supplier' as const, id })), { type: 'Supplier', id: 'LIST' }]
          : [{ type: 'Supplier', id: 'LIST' }],
    }),
    createSupplier: builder.mutation<Supplier, SupplierFormValues>({
      query: (body) => ({ url: '/suppliers', method: 'POST', body }),
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),
    updateSupplier: builder.mutation<Supplier, { id: string; values: SupplierFormValues }>({
      query: ({ id, values }) => ({ url: `/suppliers/${id}`, method: 'PUT', body: values }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Supplier', id }, { type: 'Supplier', id: 'LIST' }],
    }),
    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({ url: `/suppliers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
