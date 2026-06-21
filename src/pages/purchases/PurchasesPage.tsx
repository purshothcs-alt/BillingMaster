import { useState } from 'react';
import { Button, Chip, MenuItem, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { DataGrid } from '@/shared/components/DataGrid';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import {
  useGetPurchaseOrdersQuery,
  useUpdatePurchaseOrderStatusMutation,
} from '@/features/purchases/api/purchasesApi';
import { PurchaseOrderFormDialog } from '@/features/purchases/components/PurchaseOrderFormDialog';
import type { PurchaseOrder, PurchaseOrderStatus } from '@/features/purchases/types';

const columnHelper = createColumnHelper<PurchaseOrder>();

const statusColor: Record<PurchaseOrderStatus, 'default' | 'info' | 'success' | 'error'> = {
  draft: 'default',
  ordered: 'info',
  received: 'success',
  cancelled: 'error',
};

const PurchasesPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.PURCHASES_MANAGE) ?? true;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useGetPurchaseOrdersQuery();
  const [updateStatus] = useUpdatePurchaseOrderStatusMutation();

  const handleStatusChange = async (id: string, status: PurchaseOrderStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      dispatch(toastSuccess('Purchase order status updated.'));
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  const columns = [
    columnHelper.accessor('poNumber', { header: 'PO Number' }),
    columnHelper.accessor('supplierName', { header: 'Supplier' }),
    columnHelper.accessor('orderDate', { header: 'Order Date', cell: (info) => formatDate(info.getValue()) }),
    columnHelper.accessor('expectedDate', {
      header: 'Expected',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Total',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) =>
        canManage ? (
          <Select
            size="small"
            value={info.getValue()}
            onChange={(e) => handleStatusChange(info.row.original.id, e.target.value as PurchaseOrderStatus)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="received">Received</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        ) : (
          <Chip size="small" label={info.getValue()} color={statusColor[info.getValue()]} sx={{ textTransform: 'capitalize' }} />
        ),
    }),
  ];

  return (
    <>
      <PageHeader
        title="Purchases"
        subtitle="Create and track purchase orders with your suppliers"
        actions={
          canManage ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              New Purchase Order
            </Button>
          ) : undefined
        }
      />

      <DataGrid
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        searchPlaceholder="Search purchase orders..."
        emptyMessage="No purchase orders found."
      />

      <PurchaseOrderFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default PurchasesPage;
