export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

export interface RoleFormValues {
  name: string;
  description: string;
  permissions: string[];
}
