import { useMemo } from 'react';
import { Box, Chip } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityCrudPage } from '@/shared/components/EntityCrudPage';
import { FormMultiSelect, FormTextField } from '@/shared/components/FormControls';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from '@/features/roles/api/rolesApi';
import { roleSchema, type RoleFormSchema } from '@/features/roles/schemas';
import type { Role } from '@/features/roles/types';

const columnHelper = createColumnHelper<Role>();

const permissionOptions = Object.entries(PERMISSIONS).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' '),
}));

const defaultValues: RoleFormSchema = {
  name: '',
  description: '',
  permissions: [],
};

const RolesPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.ROLES_MANAGE) ?? true;

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Role Name' }),
      columnHelper.accessor('description', { header: 'Description' }),
      columnHelper.accessor('permissions', {
        header: 'Permissions',
        cell: (info) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 320 }}>
            {info.getValue().slice(0, 3).map((p) => (
              <Chip key={p} size="small" label={p} />
            ))}
            {info.getValue().length > 3 && <Chip size="small" label={`+${info.getValue().length - 3} more`} />}
          </Box>
        ),
      }),
      columnHelper.accessor('userCount', { header: 'Users' }),
    ],
    [],
  );

  return (
    <EntityCrudPage<Role, RoleFormSchema>
      title="Roles"
      subtitle="Define roles and their permission scopes"
      entityLabel="Role"
      columns={columns}
      schema={roleSchema}
      defaultValues={defaultValues}
      canManage={canManage}
      dialogMaxWidth="sm"
      getRowLabel={(r) => r.name}
      toEditValues={(r) => ({ name: r.name, description: r.description, permissions: r.permissions })}
      hooks={{
        useList: () => {
          const { data, isLoading, isFetching, refetch } = useGetRolesQuery();
          return { data, isLoading, isFetching, refetch };
        },
        useCreate: () => {
          const [trigger, state] = useCreateRoleMutation();
          return [trigger, state];
        },
        useUpdate: () => {
          const [trigger, state] = useUpdateRoleMutation();
          return [trigger, state];
        },
        useRemove: () => {
          const [trigger, state] = useDeleteRoleMutation();
          return [trigger, state];
        },
      }}
      renderFormFields={(control) => (
        <>
          <FormTextField name="name" control={control} label="Role Name" required />
          <FormTextField name="description" control={control} label="Description" required />
          <FormMultiSelect name="permissions" control={control} label="Permissions" options={permissionOptions} />
        </>
      )}
    />
  );
};

export default RolesPage;
