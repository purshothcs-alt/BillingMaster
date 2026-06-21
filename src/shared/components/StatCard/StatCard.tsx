import type { ReactNode } from 'react';
import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  trend?: { value: number; label: string };
}

export const StatCard = ({ label, value, icon, color = 'primary', trend }: StatCardProps) => {
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 44, height: 44 }}>{icon}</Avatar>
        </Stack>
        {trend && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
            {isPositive ? (
              <TrendingUpIcon fontSize="small" color="success" />
            ) : (
              <TrendingDownIcon fontSize="small" color="error" />
            )}
            <Typography variant="body2" color={isPositive ? 'success.main' : 'error.main'} fontWeight={600}>
              {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {trend.label}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
