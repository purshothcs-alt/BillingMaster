export type RoleName = 'admin' | 'manager' | 'cashier' | 'inventory_clerk' | 'viewer';

export interface Permission {
  id: string;
  key: string;
  description: string;
}

export interface Role {
  id: string;
  name: RoleName | string;
  description: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  roleName: RoleName | string;
  permissions: string[];
  businessType?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
