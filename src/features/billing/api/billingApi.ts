import { baseApi } from '@/services/api/baseApi';
import type { CreateInvoiceInput, Invoice } from '../types';

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<Invoice[], void>({
      query: () => '/invoices',
      providesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
    getInvoiceById: builder.query<Invoice, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Invoice', id }],
    }),
    createInvoice: builder.mutation<Invoice, CreateInvoiceInput>({
      query: (body) => ({ url: '/invoices', method: 'POST', body }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }, 'Inventory', 'Dashboard'],
    }),
  }),
});

export const { useGetInvoicesQuery, useGetInvoiceByIdQuery, useCreateInvoiceMutation } = billingApi;
