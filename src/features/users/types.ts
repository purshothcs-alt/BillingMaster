export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'suspended';
  password?: string;
}
