import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormDatePicker, FormSelect } from '@/shared/components/FormControls';
import { useAppDispatch } from '@/app/hooks';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { formatCurrency } from '@/shared/utils/format';
import { useGetProductsQuery } from '@/features/products/api/productsApi';
import { useGetSuppliersQuery } from '@/features/suppliers/api/suppliersApi';
import { useCreatePurchaseOrderMutation } from '../api/purchasesApi';
import { purchaseOrderSchema, type PurchaseOrderFormSchema } from '../schemas';

interface PurchaseOrderFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: PurchaseOrderFormSchema = {
  supplierId: '',
  expectedDate: null,
  items: [{ productId: '', productName: '', quantity: 1, unitCost: 0 }],
};

export const PurchaseOrderFormDialog = ({ open, onClose }: PurchaseOrderFormDialogProps) => {
  const dispatch = useAppDispatch();
  const { data: suppliers } = useGetSuppliersQuery();
  const { data: products } = useGetProductsQuery();
  const [createPurchaseOrder, { isLoading }] = useCreatePurchaseOrderMutation();

  const { control, handleSubmit, reset, watch, setValue } = useForm<PurchaseOrderFormSchema>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');

  useEffect(() => {
    if (!open) reset(defaultValues);
  }, [open, reset]);

  const total = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0), 0);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: PurchaseOrderFormSchema) => {
    try {
      await createPurchaseOrder(values).unwrap();
      dispatch(toastSuccess('Purchase order created successfully.'));
      handleClose();
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Purchase Order"
      maxWidth="md"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" loading={isLoading}>
            Create Order
          </Button>
        </>
      }
    >
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormSelect
            name="supplierId"
            control={control}
            label="Supplier"
            options={(suppliers ?? []).map((s) => ({ value: s.id, label: s.name }))}
          />
          <FormDatePicker name="expectedDate" control={control} label="Expected Delivery Date" />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Order Items</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>Product</TableCell>
                <TableCell sx={{ width: 110 }}>Quantity</TableCell>
                <TableCell sx={{ width: 130 }}>Unit Cost</TableCell>
                <TableCell sx={{ width: 130 }}>Subtotal</TableCell>
                <TableCell sx={{ width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Controller
                      name={`items.${index}.productId`}
                      control={control}
                      render={({ field: selectField, fieldState }) => (
                        <TextField
                          {...selectField}
                          select
                          size="small"
                          fullWidth
                          error={Boolean(fieldState.error)}
                          onChange={(e) => {
                            selectField.onChange(e.target.value);
                            const product = products?.find((p) => p.id === e.target.value);
                            if (product) {
                              setValue(`items.${index}.productName`, product.name);
                              setValue(`items.${index}.unitCost`, product.costPrice);
                            }
                          }}
                        >
                          {(products ?? []).map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: qtyField, fieldState }) => (
                        <TextField
                          {...qtyField}
                          type="number"
                          size="small"
                          error={Boolean(fieldState.error)}
                          onChange={(e) => qtyField.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`items.${index}.unitCost`}
                      control={control}
                      render={({ field: costField, fieldState }) => (
                        <TextField
                          {...costField}
                          type="number"
                          size="small"
                          error={Boolean(fieldState.error)}
                          onChange={(e) => costField.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency((items[index]?.quantity || 0) * (items[index]?.unitCost || 0))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append({ productId: '', productName: '', quantity: 1, unitCost: 0 })}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Item
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="subtitle1" fontWeight={700}>
            Total: {formatCurrency(total)}
          </Typography>
        </Stack>
      </Stack>
    </Modal>
  );
};
