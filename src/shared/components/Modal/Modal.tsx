import type { ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  type DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ModalProps {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  fullWidth?: boolean;
  disableCloseOnBackdrop?: boolean;
}

export const Modal = ({
  open,
  title,
  onClose,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  disableCloseOnBackdrop = false,
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (disableCloseOnBackdrop && reason === 'backdropClick') return;
        onClose();
      }}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack component="span">{title}</Stack>
        <IconButton aria-label="close" size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
};
