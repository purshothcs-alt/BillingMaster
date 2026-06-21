import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGetCustomersQuery } from '@/features/customers/api/customersApi';
import { formatCurrency } from '@/shared/utils/format';
import { EmptyState } from '@/shared/components/EmptyState/EmptyState';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartCustomerId,
  selectCartDiscount,
  selectCartItems,
  selectCartSubtotal,
  selectCartTax,
  selectCartTotal,
  setCustomer,
  setDiscount,
} from '../cartSlice';

interface CartPanelProps {
  onCheckout: () => void;
}

export const CartPanel = ({ onCheckout }: CartPanelProps) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const customerId = useAppSelector(selectCartCustomerId);
  const discount = useAppSelector(selectCartDiscount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const { data: customers } = useGetCustomersQuery();

  const customerOptions = (customers ?? []).map((c) => ({ value: c.id, label: c.name }));

  return (
    <Stack sx={{ height: '100%' }}>
      <Autocomplete
        size="small"
        options={customerOptions}
        value={customerOptions.find((c) => c.value === customerId) ?? null}
        onChange={(_e, value) => dispatch(setCustomer(value?.value ?? null))}
        renderInput={(params) => <TextField {...params} label="Walk-in customer (optional)" />}
        sx={{ mb: 2 }}
      />

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 200 }}>
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCartOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
            title="Cart is empty"
            description="Tap a product to add it to the cart."
          />
        ) : (
          <Stack spacing={1.5} divider={<Divider />}>
            {items.map((item) => (
              <Stack key={item.productId} direction="row" alignItems="center" spacing={1}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {item.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(item.unitPrice)} x {item.quantity}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton size="small" onClick={() => dispatch(decrementQuantity(item.productId))}>
                    <RemoveIcon fontSize="inherit" />
                  </IconButton>
                  <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => dispatch(incrementQuantity(item.productId))}>
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => dispatch(removeFromCart(item.productId))}>
                    <DeleteOutlineIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>

      <Stack spacing={1} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Tax
          </Typography>
          <Typography variant="body2">{formatCurrency(tax)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Discount
          </Typography>
          <TextField
            size="small"
            type="number"
            value={discount}
            onChange={(e) => dispatch(setDiscount(Number(e.target.value)))}
            sx={{ width: 100 }}
            slotProps={{ input: { sx: { textAlign: 'right' } } }}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            {formatCurrency(total)}
          </Typography>
        </Stack>
        <Button variant="contained" size="large" fullWidth disabled={items.length === 0} onClick={onCheckout}>
          Charge {formatCurrency(total)}
        </Button>
      </Stack>
    </Stack>
  );
};
