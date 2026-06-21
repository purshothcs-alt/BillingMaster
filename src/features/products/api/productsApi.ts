import { baseApi } from '@/services/api/baseApi';
import { setCachedValue } from '@/services/db/db';
import type { Product, ProductFormValues } from '../types';

export const PRODUCTS_CACHE_KEY = 'products';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
      async onCacheEntryAdded(_arg, { cacheDataLoaded }) {
        // Keep an offline-readable snapshot of the catalog so the POS screen can
        // keep selling when the network drops mid-shift.
        try {
          const { data } = await cacheDataLoaded;
          await setCachedValue(PRODUCTS_CACHE_KEY, data);
        } catch {
          // Query failed or the cache entry was removed before data loaded; nothing to persist.
        }
      },
    }),
    createProduct: builder.mutation<Product, ProductFormValues>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<Product, { id: string; values: ProductFormValues }>({
      query: ({ id, values }) => ({ url: `/products/${id}`, method: 'PUT', body: values }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
