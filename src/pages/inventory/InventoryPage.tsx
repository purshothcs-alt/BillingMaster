import { useMemo, useState } from 'react';
import { Button, Chip, Tab, Tabs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { DataGrid } from '@/shared/components/DataGrid';
import { formatDateTime } from '@/shared/utils/format';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import { useGetInventoryQuery, useGetStockMovementsQuery } from '@/features/inventory/api/inventoryApi';
import { AdjustStockDialog } from '@/features/inventory/components/AdjustStockDialog';
import type { InventoryItem, StockMovement } from '@/features/inventory/types';

const inventoryColumnHelper = createColumnHelper<InventoryItem>();
const movementColumnHelper = createColumnHelper<StockMovement>();

const movementColor: Record<StockMovement['type'], 'success' | 'error' | 'warning'> = {
  in: 'success',
  out: 'error',
  adjustment: 'warning',
};

const InventoryPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.INVENTORY_MANAGE) ?? true;
  const [tab, setTab] = useState<'stock' | 'movements'>('stock');
  const [adjustOpen, setAdjustOpen] = useState(false);

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
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAdjustOpen(true)}>
              Adjust Stock
            </Button>
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
    </>
  );
};

export default InventoryPage;
