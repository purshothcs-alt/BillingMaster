import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack } from '@mui/material';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormTextField } from '@/shared/components/FormControls';
import { useAppDispatch } from '@/app/hooks';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import { useCreatePermissionMutation } from '../api/permissionsApi';
import { permissionSchema, type PermissionFormSchema } from '../schemas';

interface CreatePermissionDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: PermissionFormSchema = {
  name: '',
  description: '',
};

export const CreatePermissionDialog = ({ open, onClose }: CreatePermissionDialogProps) => {
  const dispatch = useAppDispatch();
  const [createPermission, { isLoading }] = useCreatePermissionMutation();

  const { control, handleSubmit, reset } = useForm<PermissionFormSchema>({
    resolver: zodResolver(permissionSchema),
    defaultValues,
  });

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: PermissionFormSchema) => {
    try {
      await createPermission(values).unwrap();
      dispatch(toastSuccess('Permission created successfully.'));
      handleClose();
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Permission"
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
        <FormTextField name="name" control={control} label="Permission Key" required placeholder="e.g. expenses:view" />
        <FormTextField name="description" control={control} label="Description" required />
      </Stack>
    </Modal>
  );
};
