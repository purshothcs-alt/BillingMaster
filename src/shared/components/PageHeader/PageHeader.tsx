import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Breadcrumbs } from '@/layouts/Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mt: 0.5 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Stack direction="row" spacing={1.5}>{actions}</Stack>}
      </Stack>
    </Box>
  );
};
