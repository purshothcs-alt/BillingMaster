import { useMemo, useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { DataGrid } from '@/shared/components/DataGrid';
import { useConfirm } from '@/shared/components/ConfirmDialog/ConfirmDialogProvider';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { PERMISSIONS } from '@/shared/constants/permissions';
import { useDeletePermissionMutation, useGetPermissionsQuery } from '@/features/permissions/api/permissionsApi';
import { CreatePermissionDialog } from '@/features/permissions/components/CreatePermissionDialog';
import type { Permission } from '@/features/permissions/types';

const columnHelper = createColumnHelper<Permission>();

const PermissionsPage = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.PERMISSIONS_MANAGE) ?? true;
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetPermissionsQuery();
  const [deletePermission] = useDeletePermissionMutation();

  const handleDelete = async (permission: Permission) => {
    const ok = await confirm({
      title: 'Delete Permission',
      message: `Are you sure you want to delete "${permission.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    try {
      await deletePermission(permission.id).unwrap();
      dispatch(toastSuccess('Permission deleted successfully.'));
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  const columns = useMemo(() => {
    const base = [
      columnHelper.accessor('name', { header: 'Permission Key' }),
      columnHelper.accessor('description', { header: 'Description' }),
    ];

    if (!canManage) return base;

    return [
      ...base,
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(row.original)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      }),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleDelete closes over stable deps (confirm, dispatch, deletePermission)
  }, [canManage]);

  return (
    <>
      <PageHeader
        title="Permissions"
        subtitle="Manage the permission keys assignable to roles"
        actions={
          canManage ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Add Permission
            </Button>
          ) : undefined
        }
      />

      <DataGrid
        columns={columns}
        data={data ?? []}
        loading={isLoading || isFetching}
        searchPlaceholder="Search permissions..."
        emptyMessage='No permissions found. Click "Add Permission" to create one.'
      />

      <CreatePermissionDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
};

export default PermissionsPage;
