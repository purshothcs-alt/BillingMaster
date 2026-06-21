import { z } from 'zod';

export const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Select a product'),
  productName: z.string().min(1),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  unitCost: z.coerce.number().min(0, 'Unit cost cannot be negative'),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Select a supplier'),
  expectedDate: z.string().nullable().optional(),
  items: z.array(purchaseItemSchema).min(1, 'Add at least one item'),
});

export type PurchaseOrderFormSchema = z.infer<typeof purchaseOrderSchema>;
