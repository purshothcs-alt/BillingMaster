export interface Expense {
  id: string;
  referenceNumber: string;
  description: string;
  amount: number;
  expenseDate: string;
}

export type ExpenseFormValues = Omit<Expense, 'id'>;
