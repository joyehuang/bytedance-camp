import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        selectedSpecs?: { [key: string]: string };
      }>
    ) => {
      const { product, quantity, selectedSpecs } = action.payload;

      // 检查是否已存在相同商品和规格
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedSpecs) === JSON.stringify(selectedSpecs)
      );

      if (existingItemIndex >= 0) {
        // 更新数量
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // 添加新商品
        state.items.push({ product, quantity, selectedSpecs });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) => {
      const { index, quantity } = action.payload;
      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
