import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { AuthUser, LoginResponse, RefreshResponse } from './types';

const ACCESS_TOKEN_KEY = 'billingmaster.accessToken';
const REFRESH_TOKEN_KEY = 'billingmaster.refreshToken';
const USER_KEY = 'billingmaster.user';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
}

const readStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: readStoredUser(),
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  expiresAt: null,
  isAuthenticated: Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
};

const persistSession = (user: AuthUser, accessToken: string, refreshToken: string) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsSet: (state, action: PayloadAction<LoginResponse>) => {
      const { user, accessToken, refreshToken, expiresIn } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.isAuthenticated = true;
      persistSession(user, accessToken, refreshToken);
    },
    tokensRefreshed: (state, action: PayloadAction<RefreshResponse>) => {
      const { accessToken, refreshToken, expiresIn } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },
    loggedOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      clearSession();
    },
  },
});

export const { credentialsSet, tokensRefreshed, loggedOut } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectPermissions = (state: RootState) => state.auth.user?.permissions ?? [];

export const selectHasPermission = (state: RootState, permission: string) =>
  state.auth.user?.permissions.includes(permission) ?? false;

export default authSlice.reducer;
