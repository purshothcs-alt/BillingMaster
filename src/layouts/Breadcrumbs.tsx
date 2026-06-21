import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useAppSelector } from '@/app/hooks';
import { selectBreadcrumbs } from '@/features/ui/uiSlice';
import { navItems } from './navigationConfig';
import { ROUTES } from '@/shared/constants/routes';

export const Breadcrumbs = () => {
  const location = useLocation();
  const overrides = useAppSelector(selectBreadcrumbs);

  const crumbs =
    overrides.length > 0
      ? overrides
      : (() => {
          const match = navItems.find((item) => location.pathname.startsWith(item.path));
          return match ? [{ label: match.label, path: match.path }] : [];
        })();

  return (
    <MuiBreadcrumbs sx={{ fontSize: '0.85rem' }}>
      <Link
        component={RouterLink}
        to={ROUTES.DASHBOARD}
        color="inherit"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        underline="hover"
      >
        <HomeOutlinedIcon sx={{ fontSize: 16 }} />
        Home
      </Link>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        if (isLast || !crumb.path) {
          return (
            <Typography key={crumb.label} color="text.primary" fontSize="inherit">
              {crumb.label}
            </Typography>
          );
        }
        return (
          <Link key={crumb.label} component={RouterLink} to={crumb.path} color="inherit" underline="hover">
            {crumb.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
