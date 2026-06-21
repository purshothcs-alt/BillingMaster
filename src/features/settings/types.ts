export const BUSINESS_TYPES = [
  'Supermarket',
  'Retail',
  'Restaurant',
  'Medical Store',
  'Automobile Service Center',
  'Electronics Store',
  'Hardware Store',
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export interface BusinessSettings {
  businessName: string;
  businessType: BusinessType;
  email: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  currency: string;
  invoicePrefix: string;
  lowStockThreshold: number;
  enableTax: boolean;
}
