import { baseApi } from '@/services/api/baseApi';
import type { Expense, ExpenseFormValues } from '../types';

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      query: () => '/expenses',
      providesTags: [{ type: 'Expense', id: 'LIST' }],
    }),
    createExpense: builder.mutation<Expense, ExpenseFormValues>({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }],
    }),
  }),
});

export const { useGetExpensesQuery, useCreateExpenseMutation } = expensesApi;
