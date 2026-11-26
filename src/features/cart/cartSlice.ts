
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState, Product } from "./cartTypes";

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // Add a product or increase its quantity
    addItem: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({
          ...action.payload,
          qty: 1,
        });
      }
    },

    // Remove product from cart
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // Update product quantity
    updateQty: (
      state,
      action: PayloadAction<{ id: number; qty: number }>
    ) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (item) {
        item.qty = Math.max(1, Math.floor(action.payload.qty));
      }
    },

    // Empty entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
