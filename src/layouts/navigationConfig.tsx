import type { ReactNode } from 'react';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2Outlined';
import WarehouseIcon from '@mui/icons-material/WarehouseOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSaleOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccountsOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKeyOutlined';
import { ROUTES } from '@/shared/constants/routes';
import { PERMISSIONS } from '@/shared/constants/permissions';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  permission?: string;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon />, permission: PERMISSIONS.DASHBOARD_VIEW },
  { label: 'Billing / POS', path: ROUTES.BILLING, icon: <PointOfSaleIcon />, permission: PERMISSIONS.BILLING_VIEW },
  { label: 'Customers', path: ROUTES.CUSTOMERS, icon: <PeopleIcon />, permission: PERMISSIONS.CUSTOMERS_VIEW },
  { label: 'Suppliers', path: ROUTES.SUPPLIERS, icon: <LocalShippingIcon />, permission: PERMISSIONS.SUPPLIERS_VIEW },
  { label: 'Products', path: ROUTES.PRODUCTS, icon: <Inventory2Icon />, permission: PERMISSIONS.PRODUCTS_VIEW },
  { label: 'Inventory', path: ROUTES.INVENTORY, icon: <WarehouseIcon />, permission: PERMISSIONS.INVENTORY_VIEW },
  { label: 'Purchases', path: ROUTES.PURCHASES, icon: <ShoppingCartIcon />, permission: PERMISSIONS.PURCHASES_VIEW },
  { label: 'Expenses', path: ROUTES.EXPENSES, icon: <ReceiptLongIcon />, permission: PERMISSIONS.EXPENSES_VIEW },
  { label: 'Reports', path: ROUTES.REPORTS, icon: <AssessmentIcon />, permission: PERMISSIONS.REPORTS_VIEW },
  { label: 'Users', path: ROUTES.USERS, icon: <ManageAccountsIcon />, permission: PERMISSIONS.USERS_VIEW },
  { label: 'Roles', path: ROUTES.ROLES, icon: <AdminPanelSettingsIcon />, permission: PERMISSIONS.ROLES_VIEW },
  { label: 'Permissions', path: ROUTES.PERMISSIONS, icon: <VpnKeyIcon />, permission: PERMISSIONS.PERMISSIONS_VIEW },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: <SettingsIcon />, permission: PERMISSIONS.SETTINGS_MANAGE },
];
