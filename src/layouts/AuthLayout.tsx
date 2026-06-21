import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Avatar, Box, Paper, Stack, Typography, useMediaQuery, type Theme } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Loader } from '@/shared/components/Loader/Loader';

export const AuthLayout = () => {
  const showBrandPanel = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {showBrandPanel && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Stack spacing={3} alignItems="center" sx={{ maxWidth: 420, textAlign: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.15)' }}>
              <ReceiptLongIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700}>
              BillingMaster
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              One platform for billing, inventory, and point-of-sale across supermarkets, retail,
              restaurants, medical stores, automobile service centers, electronics and hardware
              businesses.
            </Typography>
          </Stack>
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          variant={showBrandPanel ? 'outlined' : 'elevation'}
          sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420 }}
        >
          <Suspense fallback={<Loader label="Loading..." />}>
            <Outlet />
          </Suspense>
        </Paper>
      </Box>
    </Box>
  );
};
