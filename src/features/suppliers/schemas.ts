import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactPerson: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  status: z.enum(['active', 'inactive']),
});

export type SupplierFormSchema = z.infer<typeof supplierSchema>;
