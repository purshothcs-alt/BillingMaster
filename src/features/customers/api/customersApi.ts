import { baseApi } from '@/services/api/baseApi';
import type { BulkImportResult } from '@/shared/types/bulkImport';
import type { Customer, CustomerFormValues } from '../types';

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => '/customers',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Customer' as const, id })), { type: 'Customer', id: 'LIST' }]
          : [{ type: 'Customer', id: 'LIST' }],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<Customer, CustomerFormValues>({
      query: (body) => ({ url: '/customers', method: 'POST', body }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; values: CustomerFormValues }>({
      query: ({ id, values }) => ({ url: `/customers/${id}`, method: 'PUT', body: values }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Customer', id }, { type: 'Customer', id: 'LIST' }],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({ url: `/customers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    bulkImportCustomers: builder.mutation<BulkImportResult<Customer>, FormData>({
      query: (formData) => ({ url: '/customers/import', method: 'POST', body: formData }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    downloadCustomersTemplate: builder.query<Blob, void>({
      query: () => ({ url: '/customers/import/template', responseHandler: (response) => response.blob() }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBulkImportCustomersMutation,
  useLazyDownloadCustomersTemplateQuery,
} = customersApi;
