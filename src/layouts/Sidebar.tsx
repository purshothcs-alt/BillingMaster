import { useNavigate, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectSidebarCollapsed, selectSidebarOpen, setSidebarOpen } from '@/features/ui/uiSlice';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { navItems } from './navigationConfig';

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectCurrentUser);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const visibleItems = navItems.filter(
    (item) => !item.permission || user?.permissions.includes(item.permission),
  );

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  const content = (
    <Box sx={{ width, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: 2.5, py: 2.5, overflow: 'hidden' }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          <ReceiptLongIcon fontSize="small" />
        </Avatar>
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} noWrap>
            BillingMaster
          </Typography>
        )}
      </Stack>
      <Divider />
      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {visibleItems.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          const button = (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                if (!isDesktop) dispatch(setSidebarOpen(false));
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          );
          return collapsed ? (
            <Tooltip key={item.path} title={item.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width,
          flexShrink: 0,
          transition: 'width 0.2s',
          '& .MuiDrawer-paper': { width, boxSizing: 'border-box', transition: 'width 0.2s' },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={sidebarOpen}
      onClose={() => dispatch(setSidebarOpen(false))}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' } }}
    >
      {content}
    </Drawer>
  );
};
