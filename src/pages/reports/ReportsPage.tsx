import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { SalesReportTab } from '@/features/reports/components/SalesReportTab';
import { InventoryReportTab } from '@/features/reports/components/InventoryReportTab';
import { PurchaseReportTab } from '@/features/reports/components/PurchaseReportTab';

type ReportTab = 'sales' | 'inventory' | 'purchases';

const ReportsPage = () => {
  const [tab, setTab] = useState<ReportTab>('sales');

  return (
    <>
      <PageHeader title="Reports" subtitle="Analyze sales, inventory valuation, and purchase activity" />
      <Tabs value={tab} onChange={(_e, value) => setTab(value)} sx={{ mb: 2 }}>
        <Tab value="sales" label="Sales" />
        <Tab value="inventory" label="Inventory Valuation" />
        <Tab value="purchases" label="Purchases" />
      </Tabs>
      {tab === 'sales' && <SalesReportTab />}
      {tab === 'inventory' && <InventoryReportTab />}
      {tab === 'purchases' && <PurchaseReportTab />}
    </>
  );
};

export default ReportsPage;
