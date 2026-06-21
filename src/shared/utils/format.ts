import dayjs from 'dayjs';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value || 0);

export const formatDate = (value: string | Date | null | undefined, pattern = 'DD MMM YYYY'): string =>
  value ? dayjs(value).format(pattern) : '-';

export const formatDateTime = (value: string | Date | null | undefined): string =>
  value ? dayjs(value).format('DD MMM YYYY, hh:mm A') : '-';

export const formatNumber = (value: number): string => new Intl.NumberFormat('en-IN').format(value || 0);

export const formatPercent = (value: number): string => `${value > 0 ? '+' : ''}${value}%`;
