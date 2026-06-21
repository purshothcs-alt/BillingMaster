import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(2, 'Description is required'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type RoleFormSchema = z.infer<typeof roleSchema>;
