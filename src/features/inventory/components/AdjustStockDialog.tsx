import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack } from '@mui/material';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormSelect, FormTextField } from '@/shared/components/FormControls';
import { useAppDispatch } from '@/app/hooks';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { useGetProductsQuery } from '@/features/products/api/productsApi';
import { useAdjustStockMutation } from '../api/inventoryApi';
import { stockAdjustmentSchema, type StockAdjustmentFormSchema } from '../schemas';

interface AdjustStockDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: StockAdjustmentFormSchema = {
  productId: '',
  type: 'in',
  quantity: 1,
  reason: '',
};

export const AdjustStockDialog = ({ open, onClose }: AdjustStockDialogProps) => {
  const dispatch = useAppDispatch();
  const { data: products } = useGetProductsQuery();
  const [adjustStock, { isLoading }] = useAdjustStockMutation();

  const { control, handleSubmit, reset } = useForm<StockAdjustmentFormSchema>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues,
  });

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: StockAdjustmentFormSchema) => {
    try {
      await adjustStock(values).unwrap();
      dispatch(toastSuccess('Stock adjusted successfully.'));
      handleClose();
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Adjust Stock"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" loading={isLoading}>
            Save
          </Button>
        </>
      }
    >
      <Stack spacing={2.5} sx={{ mt: 0.5 }}>
        <FormSelect
          name="productId"
          control={control}
          label="Product"
          options={(products ?? []).map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))}
        />
        <FormSelect
          name="type"
          control={control}
          label="Movement Type"
          options={[
            { value: 'in', label: 'Stock In' },
            { value: 'out', label: 'Stock Out' },
            { value: 'adjustment', label: 'Adjustment' },
          ]}
        />
        <FormTextField name="quantity" control={control} label="Quantity" type="number" />
        <FormTextField name="reason" control={control} label="Reason" />
      </Stack>
    </Modal>
  );
};
