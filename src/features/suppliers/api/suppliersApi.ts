import { baseApi } from '@/services/api/baseApi';
import type { BulkImportResult } from '@/shared/types/bulkImport';
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
    bulkImportSuppliers: builder.mutation<BulkImportResult<Supplier>, FormData>({
      query: (formData) => ({ url: '/suppliers/import', method: 'POST', body: formData }),
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),
    downloadSuppliersTemplate: builder.query<Blob, void>({
      query: () => ({ url: '/suppliers/import/template', responseHandler: (response) => response.blob() }),
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useBulkImportSuppliersMutation,
  useLazyDownloadSuppliersTemplateQuery,
} = suppliersApi;
