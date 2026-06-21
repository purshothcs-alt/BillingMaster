import { Alert, Snackbar, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dismissToast, selectToasts } from '@/features/ui/toastSlice';

const MAX_VISIBLE = 3;

export const ToastContainer = () => {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();
  const visible = toasts.slice(0, MAX_VISIBLE);

  return (
    <Stack
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: (theme) => theme.zIndex.snackbar,
        gap: 1,
      }}
    >
      {visible.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open
          sx={{ position: 'static', transform: 'none' }}
          autoHideDuration={toast.autoHideDuration}
          onClose={() => dispatch(dismissToast(toast.id))}
          style={{ marginBottom: index * 8 }}
        >
          <Alert
            onClose={() => dispatch(dismissToast(toast.id))}
            severity={toast.severity}
            variant="filled"
            sx={{ minWidth: 280 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};
