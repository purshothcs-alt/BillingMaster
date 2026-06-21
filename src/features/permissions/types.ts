export interface Permission {
  id: string;
  name: string;
  description: string;
}

export type PermissionFormValues = Omit<Permission, 'id'>;
