import { useMemo, useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { DataGrid } from '@/shared/components/DataGrid';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import { useGetExpensesQuery } from '@/features/expenses/api/expensesApi';
import { CreateExpenseDialog } from '@/features/expenses/components/CreateExpenseDialog';
import type { Expense } from '@/features/expenses/types';

const columnHelper = createColumnHelper<Expense>();

const ExpensesPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.EXPENSES_MANAGE) ?? true;
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetExpensesQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor('referenceNumber', { header: 'Reference No.' }),
      columnHelper.accessor('description', { header: 'Description' }),
      columnHelper.accessor('amount', { header: 'Amount', cell: (info) => formatCurrency(info.getValue()) }),
      columnHelper.accessor('expenseDate', { header: 'Date', cell: (info) => formatDate(info.getValue()) }),
    ],
    [],
  );

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Track business expenses and outgoing costs"
        actions={
          canManage ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Add Expense
            </Button>
          ) : undefined
        }
      />

      <DataGrid
        columns={columns}
        data={data ?? []}
        loading={isLoading || isFetching}
        searchPlaceholder="Search expenses..."
        emptyMessage='No expenses found. Click "Add Expense" to create one.'
      />

      <CreateExpenseDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
};

export default ExpensesPage;
