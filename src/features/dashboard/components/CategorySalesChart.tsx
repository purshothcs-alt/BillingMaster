import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatCurrency } from '@/shared/utils/format';
import { useGetCategorySalesQuery } from '../api/dashboardApi';

export const CategorySalesChart = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCategorySalesQuery();

  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
  ];

  return (
    <Card>
      <CardHeader title="Sales by Category" subheader="Share of revenue this month" />
      <CardContent sx={{ height: 320 }}>
        {!isLoading && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data ?? []}
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {(data ?? []).map((entry, index) => (
                  <Cell key={entry.category} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
