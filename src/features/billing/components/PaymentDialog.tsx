import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Modal } from '@/shared/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { formatCurrency } from '@/shared/utils/format';
import { toastError, toastSuccess } from '@/features/ui/toastSlice';
import { getErrorMessage } from '@/services/api/baseApi';
import {
  clearCart,
  selectCartCustomerId,
  selectCartDiscount,
  selectCartItems,
  selectCartTotal,
} from '../cartSlice';
import { useCreateInvoiceMutation } from '../api/billingApi';
import type { PaymentMethod } from '../types';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const PaymentDialog = ({ open, onClose, onComplete }: PaymentDialogProps) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const customerId = useAppSelector(selectCartCustomerId);
  const discountAmount = useAppSelector(selectCartDiscount);
  const total = useAppSelector(selectCartTotal);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState(total);
  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

  useEffect(() => {
    if (open) setAmountPaid(total);
  }, [open, total]);

  const changeDue = useMemo(() => Math.max(0, amountPaid - total), [amountPaid, total]);
  const insufficientCash = paymentMethod === 'cash' && amountPaid < total;

  const handleClose = () => {
    setPaymentMethod('cash');
    setAmountPaid(total);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await createInvoice({
        customerId: customerId ?? undefined,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        discountAmount,
        paymentMethod,
        amountPaid,
      }).unwrap();
      dispatch(toastSuccess('Payment received. Invoice generated.'));
      dispatch(clearCart());
      onComplete();
    } catch (error) {
      dispatch(toastError(getErrorMessage(error)));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Complete Payment"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" loading={isLoading} disabled={insufficientCash}>
            Confirm Payment
          </Button>
        </>
      }
    >
      <Stack spacing={2.5}>
        <Typography variant="h4" fontWeight={700} textAlign="center" color="primary.main">
          {formatCurrency(total)}
        </Typography>

        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          fullWidth
          onChange={(_e, value: PaymentMethod | null) => value && setPaymentMethod(value)}
        >
          <ToggleButton value="cash">Cash</ToggleButton>
          <ToggleButton value="card">Card</ToggleButton>
          <ToggleButton value="upi">UPI</ToggleButton>
          <ToggleButton value="wallet">Wallet</ToggleButton>
        </ToggleButtonGroup>

        {paymentMethod === 'cash' && (
          <TextField
            label="Amount Tendered"
            type="number"
            fullWidth
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
          />
        )}

        {paymentMethod === 'cash' && insufficientCash && (
          <Alert severity="warning">Amount tendered is less than the total due.</Alert>
        )}

        {paymentMethod === 'cash' && changeDue > 0 && (
          <Alert severity="info">Change due: {formatCurrency(changeDue)}</Alert>
        )}
      </Stack>
    </Modal>
  );
};
