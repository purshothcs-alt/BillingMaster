import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export interface ConfirmOptions {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const handleClose = (result: boolean) => {
    pending?.resolve(result);
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={Boolean(pending)} onClose={() => handleClose(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{pending?.title ?? 'Please confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{pending?.message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => handleClose(false)} color="inherit">
            {pending?.cancelLabel ?? 'Cancel'}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color={pending?.destructive ? 'error' : 'primary'}
            autoFocus
          >
            {pending?.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider
export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  return useMemo(() => ctx, [ctx]);
};
