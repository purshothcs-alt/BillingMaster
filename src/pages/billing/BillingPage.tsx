import { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { ProductGrid } from '@/features/billing/components/ProductGrid';
import { CartPanel } from '@/features/billing/components/CartPanel';
import { PaymentDialog } from '@/features/billing/components/PaymentDialog';

const BillingPage = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <>
      <PageHeader title="Billing / POS" subtitle="Build the cart and take payment at the counter" />
      <Grid container spacing={2.5} sx={{ height: 'calc(100vh - 200px)' }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%', overflowY: 'auto' }}>
          <ProductGrid />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <CartPanel onCheckout={() => setPaymentOpen(true)} />
          </Paper>
        </Grid>
      </Grid>

      <PaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onComplete={() => setPaymentOpen(false)}
      />
    </>
  );
};

export default BillingPage;
