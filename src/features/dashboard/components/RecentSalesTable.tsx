import { useMemo } from 'react';
import { Card, CardContent, CardHeader, Chip } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { DataGrid } from '@/shared/components/DataGrid';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import { useGetRecentSalesQuery } from '../api/dashboardApi';
import type { RecentSale } from '../types';

const statusColor: Record<RecentSale['status'], 'success' | 'warning' | 'default'> = {
  paid: 'success',
  pending: 'warning',
  refunded: 'default',
};

const columnHelper = createColumnHelper<RecentSale>();

export const RecentSalesTable = () => {
  const { data, isLoading } = useGetRecentSalesQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor('invoiceNo', { header: 'Invoice #' }),
      columnHelper.accessor('customerName', { header: 'Customer' }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Chip size="small" label={info.getValue()} color={statusColor[info.getValue()]} sx={{ textTransform: 'capitalize' }} />
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    [],
  );

  return (
    <Card>
      <CardHeader title="Recent Sales" subheader="Latest transactions across all channels" />
      <CardContent>
        <DataGrid
          columns={columns}
          data={data ?? []}
          loading={isLoading}
          enableGlobalFilter={false}
          emptyMessage="No recent sales yet."
        />
      </CardContent>
    </Card>
  );
};
