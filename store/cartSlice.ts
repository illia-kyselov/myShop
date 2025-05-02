import { Product } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        loadCart(state) {
            const raw = localStorage.getItem('cart');
            if (raw) state.items = JSON.parse(raw);
        },
        addToCart(state, action: PayloadAction<Product>) {
            const exist = state.items.find(item => item.product.id === action.payload.id);
            if (exist) {
                exist.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart(state, action: PayloadAction<number>) {
            state.items = state.items.filter(item => item.product.id !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart(state) {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
});

export const { loadCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
