import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';

interface PermissionRouteProps {
  permission: string;
}

/** Blocks access to a route subtree unless the current user holds the given permission. */
export const PermissionRoute = ({ permission }: PermissionRouteProps) => {
  const user = useAppSelector(selectCurrentUser);
  const allowed = user?.permissions.includes(permission) ?? false;

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
