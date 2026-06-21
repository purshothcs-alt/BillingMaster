import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({
  title = 'Nothing here yet',
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Stack spacing={1.5} alignItems="center">
        {icon ?? <InboxOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            {description}
          </Typography>
        )}
        {action}
      </Stack>
    </Box>
  );
};
