import { Grid, Stack } from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { SalesSummaryCards } from '@/features/dashboard/components/SalesSummaryCards';
import { RevenueChart } from '@/features/dashboard/components/RevenueChart';
import { CategorySalesChart } from '@/features/dashboard/components/CategorySalesChart';
import { LowStockAlerts } from '@/features/dashboard/components/LowStockAlerts';
import { RecentSalesTable } from '@/features/dashboard/components/RecentSalesTable';

const DashboardPage = () => {
  return (
    <Stack spacing={3}>
      <PageHeader title="Dashboard" subtitle="Overview of your business performance" />
      <SalesSummaryCards />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <CategorySalesChart />
        </Grid>
      </Grid>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RecentSalesTable />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <LowStockAlerts />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardPage;
