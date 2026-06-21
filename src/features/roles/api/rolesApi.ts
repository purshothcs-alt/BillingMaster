import { baseApi } from '@/services/api/baseApi';
import type { Role, RoleFormValues } from '../types';

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Role' as const, id })), { type: 'Role', id: 'LIST' }]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    createRole: builder.mutation<Role, RoleFormValues>({
      query: (body) => ({ url: '/roles', method: 'POST', body }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    updateRole: builder.mutation<Role, { id: string; values: RoleFormValues }>({
      query: ({ id, values }) => ({ url: `/roles/${id}`, method: 'PUT', body: values }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Role', id }, { type: 'Role', id: 'LIST' }],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({ url: `/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
  }),
});

export const { useGetRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } =
  rolesApi;
