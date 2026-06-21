import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().optional(),
  city: z.string().optional(),
  gstNumber: z.string().optional(),
  creditLimit: z.coerce.number().min(0, 'Credit limit cannot be negative'),
  status: z.enum(['active', 'inactive']),
});

export type CustomerFormSchema = z.infer<typeof customerSchema>;
