import { baseApi } from '@/services/api/baseApi';
import type { Permission, PermissionFormValues } from '../types';

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<Permission[], void>({
      query: () => '/permissions',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Permission' as const, id })), { type: 'Permission', id: 'LIST' }]
          : [{ type: 'Permission', id: 'LIST' }],
    }),
    createPermission: builder.mutation<Permission, PermissionFormValues>({
      query: (body) => ({ url: '/permissions', method: 'POST', body }),
      invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
    }),
    deletePermission: builder.mutation<void, string>({
      query: (id) => ({ url: `/permissions/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
    }),
  }),
});

export const { useGetPermissionsQuery, useCreatePermissionMutation, useDeletePermissionMutation } = permissionsApi;
