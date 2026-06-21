import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { useGetRevenueChartQuery } from '../api/dashboardApi';

type Range = '7d' | '30d' | '12m';

export const RevenueChart = () => {
  const theme = useTheme();
  const [range, setRange] = useState<Range>('30d');
  const { data, isLoading } = useGetRevenueChartQuery({ range });

  return (
    <Card>
      <CardHeader
        title="Revenue Overview"
        subheader="Revenue vs. expenses"
        action={
          <ToggleButtonGroup
            size="small"
            value={range}
            exclusive
            onChange={(_e, value: Range | null) => value && setRange(value)}
          >
            <ToggleButton value="7d">7D</ToggleButton>
            <ToggleButton value="30d">30D</ToggleButton>
            <ToggleButton value="12m">12M</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent sx={{ height: 320 }}>
        {!isLoading && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => formatDate(value, range === '12m' ? 'MMM' : 'DD MMM')}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value: string) => formatDate(value)}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={theme.palette.primary.main}
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke={theme.palette.warning.main}
                fill="url(#expensesGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
