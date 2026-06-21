import { useMemo } from 'react';
import { Chip } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityCrudPage } from '@/shared/components/EntityCrudPage';
import { FormSelect, FormTextField } from '@/shared/components/FormControls';
import { formatDateTime } from '@/shared/utils/format';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '@/features/users/api/usersApi';
import { userSchema, type UserFormSchema } from '@/features/users/schemas';
import type { User } from '@/features/users/types';
import { useGetRolesQuery } from '@/features/roles/api/rolesApi';

const columnHelper = createColumnHelper<User>();

const defaultValues: UserFormSchema = {
  name: '',
  email: '',
  roleId: '',
  status: 'active',
  password: '',
};

const UsersPage = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const canManage = currentUser?.permissions.includes(PERMISSIONS.USERS_MANAGE) ?? true;
  const { data: roles } = useGetRolesQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('roleName', { header: 'Role' }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Chip
            size="small"
            label={info.getValue()}
            color={info.getValue() === 'active' ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      }),
      columnHelper.accessor('lastLoginAt', {
        header: 'Last Login',
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    [],
  );

  return (
    <EntityCrudPage<User, UserFormSchema>
      title="Users"
      subtitle="Manage team members and their access roles"
      entityLabel="User"
      columns={columns}
      schema={userSchema}
      defaultValues={defaultValues}
      canManage={canManage}
      getRowLabel={(u) => u.name}
      toEditValues={(u) => ({ name: u.name, email: u.email, roleId: u.roleId, status: u.status, password: '' })}
      hooks={{
        useList: () => {
          const { data, isLoading, isFetching, refetch } = useGetUsersQuery();
          return { data, isLoading, isFetching, refetch };
        },
        useCreate: () => {
          const [trigger, state] = useCreateUserMutation();
          return [trigger, state];
        },
        useUpdate: () => {
          const [trigger, state] = useUpdateUserMutation();
          return [trigger, state];
        },
        useRemove: () => {
          const [trigger, state] = useDeleteUserMutation();
          return [trigger, state];
        },
      }}
      renderFormFields={(control) => (
        <>
          <FormTextField name="name" control={control} label="Full Name" required />
          <FormTextField name="email" control={control} label="Email" required />
          <FormSelect
            name="roleId"
            control={control}
            label="Role"
            options={(roles ?? []).map((r) => ({ value: r.id, label: r.name }))}
          />
          <FormTextField
            name="password"
            control={control}
            label="Password"
            type="password"
            placeholder="Leave blank to keep unchanged"
          />
          <FormSelect
            name="status"
            control={control}
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
            ]}
          />
        </>
      )}
    />
  );
};

export default UsersPage;
