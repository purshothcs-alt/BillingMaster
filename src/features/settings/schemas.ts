import { z } from 'zod';
import { BUSINESS_TYPES } from './types';

export const businessSettingsSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(BUSINESS_TYPES),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
  invoicePrefix: z.string().min(1, 'Invoice prefix is required'),
  lowStockThreshold: z.coerce.number().min(0, 'Threshold cannot be negative'),
  enableTax: z.boolean(),
});

export type BusinessSettingsFormSchema = z.infer<typeof businessSettingsSchema>;
