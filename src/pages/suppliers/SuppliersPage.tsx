import { useMemo } from 'react';
import { Chip } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityCrudPage } from '@/shared/components/EntityCrudPage';
import { FormSelect, FormTextField } from '@/shared/components/FormControls';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from '@/features/suppliers/api/suppliersApi';
import { supplierSchema, type SupplierFormSchema } from '@/features/suppliers/schemas';
import type { Supplier } from '@/features/suppliers/types';

const columnHelper = createColumnHelper<Supplier>();

const defaultValues: SupplierFormSchema = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  gstNumber: '',
  paymentTerms: 'Net 30',
  status: 'active',
};

const SuppliersPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.SUPPLIERS_MANAGE) ?? true;

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('contactPerson', { header: 'Contact', cell: (info) => info.getValue() || '-' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('phone', { header: 'Phone' }),
      columnHelper.accessor('paymentTerms', { header: 'Payment Terms' }),
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
    <EntityCrudPage<Supplier, SupplierFormSchema>
      title="Suppliers"
      subtitle="Manage vendors and supplier purchase terms"
      entityLabel="Supplier"
      columns={columns}
      schema={supplierSchema}
      defaultValues={defaultValues}
      canManage={canManage}
      getRowLabel={(s) => s.name}
      toEditValues={(s) => ({
        name: s.name,
        contactPerson: s.contactPerson ?? '',
        email: s.email,
        phone: s.phone,
        address: s.address ?? '',
        gstNumber: s.gstNumber ?? '',
        paymentTerms: s.paymentTerms,
        status: s.status,
      })}
      hooks={{
        useList: () => {
          const { data, isLoading, isFetching, refetch } = useGetSuppliersQuery();
          return { data, isLoading, isFetching, refetch };
        },
        useCreate: () => {
          const [trigger, state] = useCreateSupplierMutation();
          return [trigger, state];
        },
        useUpdate: () => {
          const [trigger, state] = useUpdateSupplierMutation();
          return [trigger, state];
        },
        useRemove: () => {
          const [trigger, state] = useDeleteSupplierMutation();
          return [trigger, state];
        },
      }}
      renderFormFields={(control) => (
        <>
          <FormTextField name="name" control={control} label="Supplier Name" required />
          <FormTextField name="contactPerson" control={control} label="Contact Person" />
          <FormTextField name="email" control={control} label="Email" required />
          <FormTextField name="phone" control={control} label="Phone" required />
          <FormTextField name="address" control={control} label="Address" />
          <FormTextField name="gstNumber" control={control} label="GST Number" />
          <FormTextField name="paymentTerms" control={control} label="Payment Terms" required />
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

export default SuppliersPage;
