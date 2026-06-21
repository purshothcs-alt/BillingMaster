import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
  size?: number;
}

export const Loader = ({ label, fullScreen = false, size = 32 }: LoaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        ...(fullScreen
          ? { position: 'fixed', inset: 0, zIndex: (theme) => theme.zIndex.modal + 1, bgcolor: 'background.default' }
          : { py: 6 }),
      }}
    >
      <CircularProgress size={size} />
      {label && (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
    </Box>
  );
};
