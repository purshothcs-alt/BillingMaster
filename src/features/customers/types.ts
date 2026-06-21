export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  gstNumber?: string;
  creditLimit: number;
  outstandingBalance: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type CustomerFormValues = Omit<Customer, 'id' | 'outstandingBalance' | 'createdAt'>;
