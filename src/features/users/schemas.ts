import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  roleId: z.string().min(1, 'Select a role'),
  status: z.enum(['active', 'suspended']),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, 'Password must be at least 6 characters'),
});

export type UserFormSchema = z.infer<typeof userSchema>;
