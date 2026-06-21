import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  costPrice: z.coerce.number().min(0, 'Cost price cannot be negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price cannot be negative'),
  taxRate: z.coerce.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
  reorderLevel: z.coerce.number().min(0, 'Reorder level cannot be negative'),
  status: z.enum(['active', 'inactive']),
});

export type ProductFormSchema = z.infer<typeof productSchema>;
