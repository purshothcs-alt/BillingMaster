import { useMemo } from 'react';
import { Button, Stack } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { createColumnHelper } from '@tanstack/react-table';
import { DataGrid } from '@/shared/components/DataGrid';
import { formatCurrency } from '@/shared/utils/format';
import { exportToCsv } from '@/shared/utils/exportCsv';
import { useGetInventoryReportQuery } from '../api/reportsApi';
import type { InventoryReportRow } from '../types';

const columnHelper = createColumnHelper<InventoryReportRow>();

export const InventoryReportTab = () => {
  const { data, isLoading } = useGetInventoryReportQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', { header: 'Product' }),
      columnHelper.accessor('sku', { header: 'SKU' }),
      columnHelper.accessor('currentStock', { header: 'Current Stock' }),
      columnHelper.accessor('unitCost', { header: 'Unit Cost', cell: (info) => formatCurrency(info.getValue()) }),
      columnHelper.accessor('stockValue', { header: 'Stock Value', cell: (info) => formatCurrency(info.getValue()) }),
    ],
    [],
  );

  const totalValue = (data ?? []).reduce((sum, row) => sum + row.stockValue, 0);

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <strong>Total Stock Value:</strong>
            <span>{formatCurrency(totalValue)}</span>
          </Stack>
        </Stack>
        <Button
          startIcon={<DownloadOutlinedIcon />}
          onClick={() => exportToCsv('inventory-report.csv', data ?? [])}
          disabled={!data?.length}
        >
          Export CSV
        </Button>
      </Stack>
      <DataGrid columns={columns} data={data ?? []} loading={isLoading} searchPlaceholder="Search products..." />
    </Stack>
  );
};
