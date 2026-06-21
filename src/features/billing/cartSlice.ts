import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { CartItem } from './types';

interface CartState {
  customerId: string | null;
  items: CartItem[];
  discountAmount: number;
}

const initialState: CartState = {
  customerId: null,
  items: [],
  discountAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existing = state.items.find((item) => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    setQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    setCustomer: (state, action: PayloadAction<string | null>) => {
      state.customerId = action.payload;
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discountAmount = Math.max(0, action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.discountAmount = 0;
      state.customerId = null;
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  setQuantity,
  removeFromCart,
  setCustomer,
  setDiscount,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCustomerId = (state: RootState) => state.cart.customerId;
export const selectCartDiscount = (state: RootState) => state.cart.discountAmount;

export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const selectCartTax = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity * (item.taxRate / 100), 0);

export const selectCartTotal = (state: RootState) =>
  selectCartSubtotal(state) + selectCartTax(state) - state.cart.discountAmount;

export default cartSlice.reducer;
