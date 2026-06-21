import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import type { RootState } from '@/app/store';
import { loggedOut, tokensRefreshed } from '@/features/auth/authSlice';
import type { RefreshResponse } from '@/features/auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;
        if (!refreshToken) {
          api.dispatch(loggedOut());
          return result;
        }

        const refreshResult = await rawBaseQuery(
          {
            url: '/auth/refresh-token',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          api.dispatch(tokensRefreshed(refreshResult.data as RefreshResponse));
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Customer',
    'Supplier',
    'Product',
    'Category',
    'Inventory',
    'StockMovement',
    'Purchase',
    'Sale',
    'Invoice',
    'Expense',
    'Report',
    'Setting',
    'User',
    'Role',
    'Permission',
    'Dashboard',
  ],
  endpoints: () => ({}),
});

export const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

export const getErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    if (typeof error.data === 'object' && error.data && 'message' in error.data) {
      return String((error.data as { message?: string }).message ?? 'Request failed');
    }
    return `Request failed (${error.status})`;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};
