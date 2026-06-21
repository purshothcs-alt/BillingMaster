import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ROUTES } from '@/shared/constants/routes';

const NotFoundPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
    <Stack spacing={2} alignItems="center" textAlign="center">
      <Typography variant="h1" fontWeight={800} color="primary.main">
        404
      </Typography>
      <Typography variant="h6">Page not found</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button component={RouterLink} to={ROUTES.DASHBOARD} variant="contained">
        Go to Dashboard
      </Button>
    </Stack>
  </Box>
);

export default NotFoundPage;
