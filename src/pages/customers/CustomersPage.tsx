import { useMemo, useState } from 'react';
import { Button, Chip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { createColumnHelper } from '@tanstack/react-table';
import { EntityCrudPage } from '@/shared/components/EntityCrudPage';
import { FormSelect, FormTextField } from '@/shared/components/FormControls';
import { BulkImportDialog } from '@/shared/components/BulkImportDialog';
import { formatCurrency } from '@/shared/utils/format';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { toastSuccess } from '@/features/ui/toastSlice';
import { PERMISSIONS } from '@/shared/constants/permissions';
import {
  useBulkImportCustomersMutation,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useLazyDownloadCustomersTemplateQuery,
  useUpdateCustomerMutation,
} from '@/features/customers/api/customersApi';
import { customerSchema, type CustomerFormSchema } from '@/features/customers/schemas';
import type { Customer } from '@/features/customers/types';

const CUSTOMER_IMPORT_COLUMNS = ['Name', 'Email', 'Phone', 'Address', 'City', 'GstNumber', 'CreditLimit', 'Status'];

const columnHelper = createColumnHelper<Customer>();

const defaultValues: CustomerFormSchema = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  gstNumber: '',
  creditLimit: 0,
  status: 'active',
};

const CustomersPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const canManage = user?.permissions.includes(PERMISSIONS.CUSTOMERS_MANAGE) ?? true;
  const [importOpen, setImportOpen] = useState(false);
  const [bulkImportCustomers] = useBulkImportCustomersMutation();
  const [downloadTemplate] = useLazyDownloadCustomersTemplateQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('phone', { header: 'Phone' }),
      columnHelper.accessor('city', { header: 'City', cell: (info) => info.getValue() || '-' }),
      columnHelper.accessor('creditLimit', {
        header: 'Credit Limit',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('outstandingBalance', {
        header: 'Outstanding',
        cell: (info) => formatCurrency(info.getValue()),
      }),
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
    <>
    <EntityCrudPage<Customer, CustomerFormSchema>
      title="Customers"
      subtitle="Manage your customer directory and credit accounts"
      entityLabel="Customer"
      columns={columns}
      schema={customerSchema}
      defaultValues={defaultValues}
      canManage={canManage}
      extraToolbar={
        canManage ? (
          <Button size="small" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>
            Import
          </Button>
        ) : undefined
      }
      getRowLabel={(c) => c.name}
      toEditValues={(c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address ?? '',
        city: c.city ?? '',
        gstNumber: c.gstNumber ?? '',
        creditLimit: c.creditLimit,
        status: c.status,
      })}
      hooks={{
        useList: () => {
          const { data, isLoading, isFetching, refetch } = useGetCustomersQuery();
          return { data, isLoading, isFetching, refetch };
        },
        useCreate: () => {
          const [trigger, state] = useCreateCustomerMutation();
          return [trigger, state];
        },
        useUpdate: () => {
          const [trigger, state] = useUpdateCustomerMutation();
          return [trigger, state];
        },
        useRemove: () => {
          const [trigger, state] = useDeleteCustomerMutation();
          return [trigger, state];
        },
      }}
      renderFormFields={(control) => (
        <>
          <FormTextField name="name" control={control} label="Customer Name" required />
          <FormTextField name="email" control={control} label="Email" required />
          <FormTextField name="phone" control={control} label="Phone" required />
          <FormTextField name="address" control={control} label="Address" />
          <FormTextField name="city" control={control} label="City" />
          <FormTextField name="gstNumber" control={control} label="GST Number" />
          <FormTextField name="creditLimit" control={control} label="Credit Limit" type="number" />
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
    <BulkImportDialog<Customer>
      open={importOpen}
      onClose={() => setImportOpen(false)}
      title="Import Customers"
      expectedColumns={CUSTOMER_IMPORT_COLUMNS}
      templateFileName="customers-template.csv"
      onDownloadTemplate={() => downloadTemplate().unwrap()}
      onUpload={(file) => {
        const formData = new FormData();
        formData.append('file', file);
        return bulkImportCustomers(formData).unwrap();
      }}
      onImportSuccess={(result) => {
        dispatch(toastSuccess(`${result.importedCount} of ${result.totalRows} customers imported successfully.`));
      }}
    />
    </>
  );
};

export default CustomersPage;
