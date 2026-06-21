import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { GuestRoute } from './guards/GuestRoute';
import { PermissionRoute } from './guards/PermissionRoute';
import { ROUTES } from '@/shared/constants/routes';
import { PERMISSIONS } from '@/shared/constants/permissions';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const SuppliersPage = lazy(() => import('@/pages/suppliers/SuppliersPage'));
const ProductsPage = lazy(() => import('@/pages/products/ProductsPage'));
const InventoryPage = lazy(() => import('@/pages/inventory/InventoryPage'));
const PurchasesPage = lazy(() => import('@/pages/purchases/PurchasesPage'));
const BillingPage = lazy(() => import('@/pages/billing/BillingPage'));
const ExpensesPage = lazy(() => import('@/pages/expenses/ExpensesPage'));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
const RolesPage = lazy(() => import('@/pages/roles/RolesPage'));
const PermissionsPage = lazy(() => import('@/pages/permissions/PermissionsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          {
            element: <PermissionRoute permission={PERMISSIONS.DASHBOARD_VIEW} />,
            children: [{ path: ROUTES.DASHBOARD, element: <DashboardPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.BILLING_VIEW} />,
            children: [{ path: ROUTES.BILLING, element: <BillingPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.CUSTOMERS_VIEW} />,
            children: [{ path: ROUTES.CUSTOMERS, element: <CustomersPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.SUPPLIERS_VIEW} />,
            children: [{ path: ROUTES.SUPPLIERS, element: <SuppliersPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.PRODUCTS_VIEW} />,
            children: [{ path: ROUTES.PRODUCTS, element: <ProductsPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW} />,
            children: [{ path: ROUTES.INVENTORY, element: <InventoryPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.PURCHASES_VIEW} />,
            children: [{ path: ROUTES.PURCHASES, element: <PurchasesPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.EXPENSES_VIEW} />,
            children: [{ path: ROUTES.EXPENSES, element: <ExpensesPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.REPORTS_VIEW} />,
            children: [{ path: ROUTES.REPORTS, element: <ReportsPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.SETTINGS_MANAGE} />,
            children: [{ path: ROUTES.SETTINGS, element: <SettingsPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.USERS_VIEW} />,
            children: [{ path: ROUTES.USERS, element: <UsersPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.ROLES_VIEW} />,
            children: [{ path: ROUTES.ROLES, element: <RolesPage /> }],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.PERMISSIONS_VIEW} />,
            children: [{ path: ROUTES.PERMISSIONS, element: <PermissionsPage /> }],
          },
          { path: 'unauthorized', element: <UnauthorizedPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
