import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppSelector } from '@/app/hooks';
import { selectSidebarCollapsed } from '@/features/ui/uiSlice';
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from './Sidebar';
import { Header, HEADER_HEIGHT } from './Header';
import { Loader } from '@/shared/components/Loader/Loader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary/ErrorBoundary';

export const MainLayout = () => {
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          transition: 'width 0.2s',
        }}
      >
        <Header />
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: `${HEADER_HEIGHT}px` }}>
          <ErrorBoundary>
            <Suspense fallback={<Loader fullScreen label="Loading page..." />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  );
};
