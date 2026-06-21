import { useMemo } from 'react';
import { Chip } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityCrudPage } from '@/shared/components/EntityCrudPage';
import { FormSelect, FormTextField } from '@/shared/components/FormControls';
import { formatCurrency } from '@/shared/utils/format';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '@/features/products/api/productsApi';
import { productSchema, type ProductFormSchema } from '@/features/products/schemas';
import { PRODUCT_UNITS, type Product } from '@/features/products/types';

const columnHelper = createColumnHelper<Product>();

const defaultValues: ProductFormSchema = {
  name: '',
  sku: '',
  barcode: '',
  category: '',
  unit: 'pcs',
  costPrice: 0,
  sellingPrice: 0,
  taxRate: 0,
  reorderLevel: 10,
  status: 'active',
};

const ProductsPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.PRODUCTS_MANAGE) ?? true;

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('sku', { header: 'SKU' }),
      columnHelper.accessor('category', { header: 'Category' }),
      columnHelper.accessor('costPrice', { header: 'Cost', cell: (info) => formatCurrency(info.getValue()) }),
      columnHelper.accessor('sellingPrice', {
        header: 'Price',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('taxRate', { header: 'Tax %', cell: (info) => `${info.getValue()}%` }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Chip
            size="small"
            label={info.getValue()}
            color={info.getValue() === 'active' ? 'success' : 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      }),
    ],
    [],
  );

  return (
    <EntityCrudPage<Product, ProductFormSchema>
      title="Products"
      subtitle="Manage your product catalog across all business lines"
      entityLabel="Product"
      columns={columns}
      schema={productSchema}
      defaultValues={defaultValues}
      canManage={canManage}
      dialogMaxWidth="md"
      getRowLabel={(p) => p.name}
      toEditValues={(p) => ({
        name: p.name,
        sku: p.sku,
        barcode: p.barcode ?? '',
        category: p.category,
        unit: p.unit,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        taxRate: p.taxRate,
        reorderLevel: p.reorderLevel,
        status: p.status,
      })}
      hooks={{
        useList: () => {
          const { data, isLoading, isFetching, refetch } = useGetProductsQuery();
          return { data, isLoading, isFetching, refetch };
        },
        useCreate: () => {
          const [trigger, state] = useCreateProductMutation();
          return [trigger, state];
        },
        useUpdate: () => {
          const [trigger, state] = useUpdateProductMutation();
          return [trigger, state];
        },
        useRemove: () => {
          const [trigger, state] = useDeleteProductMutation();
          return [trigger, state];
        },
      }}
      renderFormFields={(control) => (
        <>
          <FormTextField name="name" control={control} label="Product Name" required />
          <FormTextField name="sku" control={control} label="SKU" required />
          <FormTextField name="barcode" control={control} label="Barcode" />
          <FormTextField name="category" control={control} label="Category" required />
          <FormSelect
            name="unit"
            control={control}
            label="Unit"
            options={PRODUCT_UNITS.map((u) => ({ value: u, label: u }))}
          />
          <FormTextField name="costPrice" control={control} label="Cost Price" type="number" />
          <FormTextField name="sellingPrice" control={control} label="Selling Price" type="number" />
          <FormTextField name="taxRate" control={control} label="Tax Rate (%)" type="number" />
          <FormTextField name="reorderLevel" control={control} label="Reorder Level" type="number" />
          <FormSelect
            name="status"
            control={control}
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </>
      )}
    />
  );
};

export default ProductsPage;
