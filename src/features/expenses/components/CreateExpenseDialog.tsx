import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack } from '@mui/material';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormDatePicker, FormTextField } from '@/shared/components/FormControls';
import { useAppDispatch } from '@/app/hooks';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { useCreateExpenseMutation } from '../api/expensesApi';
import { expenseSchema, type ExpenseFormSchema } from '../schemas';

interface CreateExpenseDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: ExpenseFormSchema = {
  referenceNumber: '',
  description: '',
  amount: 0,
  expenseDate: new Date().toISOString(),
};

export const CreateExpenseDialog = ({ open, onClose }: CreateExpenseDialogProps) => {
  const dispatch = useAppDispatch();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const { control, handleSubmit, reset } = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: ExpenseFormSchema) => {
    try {
      await createExpense(values).unwrap();
      dispatch(toastSuccess('Expense recorded successfully.'));
      handleClose();
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Expense"
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
        <FormTextField name="referenceNumber" control={control} label="Reference Number" required />
        <FormTextField name="description" control={control} label="Description" required />
        <FormTextField name="amount" control={control} label="Amount" type="number" required />
        <FormDatePicker name="expenseDate" control={control} label="Expense Date" />
      </Stack>
    </Modal>
  );
};
