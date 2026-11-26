
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Get cart items
export const selectCartItems = (state: RootState) =>
  state.cart.items;

// Calculate total quantity
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce((total, item) => total + item.qty, 0)
);

// Calculate total cart price
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    )
);
