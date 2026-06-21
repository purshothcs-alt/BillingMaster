import { Grid } from '@mui/material';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { StatCard } from '@/shared/components/StatCard/StatCard';
import { formatCurrency, formatNumber } from '@/shared/utils/format';
import { useGetSalesSummaryQuery } from '../api/dashboardApi';

export const SalesSummaryCards = () => {
  const { data, isLoading } = useGetSalesSummaryQuery();

  const summary = data ?? {
    todaySales: 0,
    todaySalesTrend: 0,
    totalOrders: 0,
    totalOrdersTrend: 0,
    averageOrderValue: 0,
    averageOrderValueTrend: 0,
    totalCustomers: 0,
    totalCustomersTrend: 0,
  };

  const cards = [
    {
      label: "Today's Sales",
      value: formatCurrency(summary.todaySales),
      icon: <PaidOutlinedIcon />,
      color: 'primary' as const,
      trend: { value: summary.todaySalesTrend, label: 'vs yesterday' },
    },
    {
      label: 'Total Orders',
      value: formatNumber(summary.totalOrders),
      icon: <ReceiptLongOutlinedIcon />,
      color: 'success' as const,
      trend: { value: summary.totalOrdersTrend, label: 'vs yesterday' },
    },
    {
      label: 'Avg. Order Value',
      value: formatCurrency(summary.averageOrderValue),
      icon: <TrendingUpOutlinedIcon />,
      color: 'info' as const,
      trend: { value: summary.averageOrderValueTrend, label: 'vs last week' },
    },
    {
      label: 'Total Customers',
      value: formatNumber(summary.totalCustomers),
      icon: <PeopleAltOutlinedIcon />,
      color: 'secondary' as const,
      trend: { value: summary.totalCustomersTrend, label: 'vs last month' },
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
          {!isLoading && <StatCard {...card} />}
        </Grid>
      ))}
    </Grid>
  );
};
