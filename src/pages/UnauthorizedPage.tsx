import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ROUTES } from '@/shared/constants/routes';

const UnauthorizedPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
    <Stack spacing={2} alignItems="center" textAlign="center">
      <LockOutlinedIcon sx={{ fontSize: 56, color: 'warning.main' }} />
      <Typography variant="h6">Access denied</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
        You don't have permission to view this page. Contact your administrator if you believe this is
        a mistake.
      </Typography>
      <Button component={RouterLink} to={ROUTES.DASHBOARD} variant="contained">
        Go to Dashboard
      </Button>
    </Stack>
  </Box>
);

export default UnauthorizedPage;
