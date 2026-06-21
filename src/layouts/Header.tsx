import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectSidebarCollapsed,
  selectThemeMode,
  toggleSidebar,
  toggleSidebarCollapsed,
  toggleThemeMode,
} from '@/features/ui/uiSlice';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from './Sidebar';

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector(selectThemeMode);
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectCurrentUser);
  const { logout } = useAuth();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        bgcolor: 'background.paper',
        transition: 'width 0.2s, margin-left 0.2s',
      }}
    >
      <Toolbar sx={{ height: HEADER_HEIGHT, gap: 1 }}>
        <IconButton
          edge="start"
          onClick={() => dispatch(isDesktop ? toggleSidebarCollapsed() : toggleSidebar())}
        >
          {isDesktop && collapsed ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={() => dispatch(toggleThemeMode())}>
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate(ROUTES.SETTINGS);
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
