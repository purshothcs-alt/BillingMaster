import { z } from 'zod';

export const expenseSchema = z.object({
  referenceNumber: z.string().min(1, 'Reference number is required'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  expenseDate: z.string().min(1, 'Expense date is required'),
});

export type ExpenseFormSchema = z.infer<typeof expenseSchema>;
