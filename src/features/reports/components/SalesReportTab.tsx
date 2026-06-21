import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, Card, CardContent, Stack } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@/shared/components/DataGrid';
import { FormDatePicker } from '@/shared/components/FormControls';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { exportToCsv } from '@/shared/utils/exportCsv';
import { useGetSalesReportQuery } from '../api/reportsApi';
import type { SalesReportRow } from '../types';

const columnHelper = createColumnHelper<SalesReportRow>();

interface RangeForm {
  from: string;
  to: string;
}

export const SalesReportTab = () => {
  const theme = useTheme();
  const [range, setRange] = useState<RangeForm>({
    from: dayjs().subtract(30, 'day').toISOString(),
    to: dayjs().toISOString(),
  });
  const { control, watch } = useForm<RangeForm>({ defaultValues: range });
  const formValues = watch();

  const { data, isLoading } = useGetSalesReportQuery({ from: range.from, to: range.to });

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', { header: 'Date', cell: (info) => formatDate(info.getValue()) }),
      columnHelper.accessor('invoiceCount', { header: 'Invoices' }),
      columnHelper.accessor('grossSales', { header: 'Gross Sales', cell: (info) => formatCurrency(info.getValue()) }),
      columnHelper.accessor('discounts', { header: 'Discounts', cell: (info) => formatCurrency(info.getValue()) }),
      columnHelper.accessor('netSales', { header: 'Net Sales', cell: (info) => formatCurrency(info.getValue()) }),
    ],
    [],
  );

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <FormDatePicker name="from" control={control} label="From" />
        <FormDatePicker name="to" control={control} label="To" />
        <Button
          variant="outlined"
          onClick={() => setRange({ from: formValues.from, to: formValues.to })}
        >
          Apply
        </Button>
        <Button
          startIcon={<DownloadOutlinedIcon />}
          onClick={() => exportToCsv('sales-report.csv', data ?? [])}
          disabled={!data?.length}
        >
          Export CSV
        </Button>
      </Stack>

      <Card>
        <CardContent sx={{ height: 300 }}>
          {!isLoading && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="date" tickFormatter={(v: string) => formatDate(v, 'DD MMM')} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} width={48} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(v: string) => formatDate(v)} />
                <Bar dataKey="netSales" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <DataGrid columns={columns} data={data ?? []} loading={isLoading} enableGlobalFilter={false} />
    </Stack>
  );
};
