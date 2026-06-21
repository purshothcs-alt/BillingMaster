import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loggedOut, selectCurrentUser, selectIsAuthenticated } from '../authSlice';
import { useLogoutMutation } from '../api/authApi';
import { ROUTES } from '@/shared/constants/routes';
import { toastInfo } from '@/features/ui/toastSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Proceed with local logout even if the server call fails (e.g. offline).
    } finally {
      dispatch(loggedOut());
      dispatch(toastInfo('You have been signed out.'));
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const hasPermission = (permission: string) => user?.permissions.includes(permission) ?? false;

  return { user, isAuthenticated, logout, hasPermission };
};
