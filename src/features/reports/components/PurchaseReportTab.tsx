import { useMemo } from 'react';
import { Button, Stack } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
import { DataGrid } from '@/shared/components/DataGrid';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { exportToCsv } from '@/shared/utils/exportCsv';
import { useGetPurchaseReportQuery } from '../api/reportsApi';
import type { PurchaseReportRow } from '../types';

const columnHelper = createColumnHelper<PurchaseReportRow>();

export const PurchaseReportTab = () => {
  const { data, isLoading } = useGetPurchaseReportQuery({
    from: dayjs().subtract(30, 'day').toISOString(),
    to: dayjs().toISOString(),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('poNumber', { header: 'PO Number' }),
      columnHelper.accessor('supplierName', { header: 'Supplier' }),
      columnHelper.accessor('orderDate', { header: 'Order Date', cell: (info) => formatDate(info.getValue()) }),
      columnHelper.accessor('totalAmount', { header: 'Total', cell: (info) => formatCurrency(info.getValue()) }),
      columnHelper.accessor('status', { header: 'Status' }),
    ],
    [],
  );

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          startIcon={<DownloadOutlinedIcon />}
          onClick={() => exportToCsv('purchases-report.csv', data ?? [])}
          disabled={!data?.length}
        >
          Export CSV
        </Button>
      </Stack>
      <DataGrid columns={columns} data={data ?? []} loading={isLoading} searchPlaceholder="Search purchase orders..." />
    </Stack>
  );
};
