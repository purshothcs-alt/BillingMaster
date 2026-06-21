export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  taxRate: number;
  quantity: number;
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  taxRate: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  customerId?: string;
  customerName?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeDue: number;
  status: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

export interface CreateInvoiceInput {
  customerId?: string;
  items: { productId: string; quantity: number }[];
  discountAmount: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
}
