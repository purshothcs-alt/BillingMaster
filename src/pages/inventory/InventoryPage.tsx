import { useMemo, useState } from 'react';
import { Button, Chip, Stack, Tab, Tabs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { DataGrid } from '@/shared/components/DataGrid';
import { BulkImportDialog } from '@/shared/components/BulkImportDialog';
import { formatDateTime } from '@/shared/utils/format';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { toastSuccess } from '@/features/ui/toastSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import {
  useBulkImportInventoryAdjustmentsMutation,
  useGetInventoryQuery,
  useGetStockMovementsQuery,
  useLazyDownloadInventoryImportTemplateQuery,
} from '@/features/inventory/api/inventoryApi';
import { AdjustStockDialog } from '@/features/inventory/components/AdjustStockDialog';
import type { InventoryItem, StockMovement } from '@/features/inventory/types';

const INVENTORY_IMPORT_COLUMNS = ['ProductSku', 'Type', 'Quantity', 'Reason'];

const inventoryColumnHelper = createColumnHelper<InventoryItem>();
const movementColumnHelper = createColumnHelper<StockMovement>();

const movementColor: Record<StockMovement['type'], 'success' | 'error' | 'warning'> = {
  in: 'success',
  out: 'error',
  adjustment: 'warning',
};

const InventoryPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.INVENTORY_MANAGE) ?? true;
  const [tab, setTab] = useState<'stock' | 'movements'>('stock');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [bulkImportInventoryAdjustments] = useBulkImportInventoryAdjustmentsMutation();
  const [downloadTemplate] = useLazyDownloadInventoryImportTemplateQuery();

  const { data: inventory, isLoading: loadingInventory } = useGetInventoryQuery();
  const { data: movements, isLoading: loadingMovements } = useGetStockMovementsQuery();

  const inventoryColumns = useMemo(
    () => [
      inventoryColumnHelper.accessor('productName', { header: 'Product' }),
      inventoryColumnHelper.accessor('sku', { header: 'SKU' }),
      inventoryColumnHelper.accessor('warehouse', { header: 'Warehouse' }),
      inventoryColumnHelper.accessor('currentStock', {
        header: 'Current Stock',
        cell: (info) => {
          const row = info.row.original;
          const low = row.currentStock <= row.reorderLevel;
          return (
            <Chip
              size="small"
              label={`${info.getValue()} ${row.unit}`}
              color={low ? 'error' : 'success'}
              variant={low ? 'filled' : 'outlined'}
            />
          );
        },
      }),
      inventoryColumnHelper.accessor('reorderLevel', { header: 'Reorder Level' }),
      inventoryColumnHelper.accessor('updatedAt', {
        header: 'Last Updated',
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    [],
  );

  const movementColumns = useMemo(
    () => [
      movementColumnHelper.accessor('productName', { header: 'Product' }),
      movementColumnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <Chip size="small" label={info.getValue()} color={movementColor[info.getValue()]} sx={{ textTransform: 'capitalize' }} />
        ),
      }),
      movementColumnHelper.accessor('quantity', { header: 'Quantity' }),
      movementColumnHelper.accessor('reason', { header: 'Reason' }),
      movementColumnHelper.accessor('performedBy', { header: 'Performed By' }),
      movementColumnHelper.accessor('createdAt', {
        header: 'Date',
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    [],
  );

  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and movement history across warehouses"
        actions={
          canManage ? (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>
                Import
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAdjustOpen(true)}>
                Adjust Stock
              </Button>
            </Stack>
          ) : undefined
        }
      />

      <Tabs value={tab} onChange={(_e, value) => setTab(value)} sx={{ mb: 2 }}>
        <Tab value="stock" label="Stock Levels" />
        <Tab value="movements" label="Movement History" />
      </Tabs>

      {tab === 'stock' ? (
        <DataGrid
          columns={inventoryColumns}
          data={inventory ?? []}
          loading={loadingInventory}
          searchPlaceholder="Search products..."
          emptyMessage="No inventory records found."
        />
      ) : (
        <DataGrid
          columns={movementColumns}
          data={movements ?? []}
          loading={loadingMovements}
          searchPlaceholder="Search movements..."
          emptyMessage="No stock movements recorded yet."
        />
      )}

      <AdjustStockDialog open={adjustOpen} onClose={() => setAdjustOpen(false)} />
      <BulkImportDialog<InventoryItem>
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Stock Adjustments"
        expectedColumns={INVENTORY_IMPORT_COLUMNS}
        templateFileName="inventory-template.csv"
        onDownloadTemplate={() => downloadTemplate().unwrap()}
        onUpload={(file) => {
          const formData = new FormData();
          formData.append('file', file);
          return bulkImportInventoryAdjustments(formData).unwrap();
        }}
        onImportSuccess={(result) => {
          dispatch(toastSuccess(`${result.importedCount} of ${result.totalRows} stock adjustments imported successfully.`));
        }}
      />
    </>
  );
};

export default InventoryPage;
