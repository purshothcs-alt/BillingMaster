import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { AlertColor } from '@mui/material';
import type { RootState } from '@/app/store';

export interface Toast {
  id: string;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

type ToastInput = Omit<Toast, 'id'>;

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: {
      reducer: (state, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload);
      },
      prepare: (input: ToastInput) => ({
        payload: { id: nanoid(), autoHideDuration: 5000, ...input },
      }),
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { showToast, dismissToast, clearToasts } = toastSlice.actions;

export const selectToasts = (state: RootState) => state.toast.toasts;

export const toastSuccess = (message: string) => showToast({ message, severity: 'success' });
export const toastError = (message: string) => showToast({ message, severity: 'error' });
export const toastInfo = (message: string) => showToast({ message, severity: 'info' });
export const toastWarning = (message: string) => showToast({ message, severity: 'warning' });

export default toastSlice.reducer;
