import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Select a product'),
  type: z.enum(['in', 'out', 'adjustment']),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  reason: z.string().min(2, 'Please provide a reason'),
});

export type StockAdjustmentFormSchema = z.infer<typeof stockAdjustmentSchema>;
