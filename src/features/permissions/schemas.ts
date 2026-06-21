import { z } from 'zod';

export const permissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
});

export type PermissionFormSchema = z.infer<typeof permissionSchema>;
