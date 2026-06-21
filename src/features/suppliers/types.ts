export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type SupplierFormValues = Omit<Supplier, 'id' | 'createdAt'>;
