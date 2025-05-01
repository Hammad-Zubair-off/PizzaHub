// cartReducer.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../shared/axiosInstance';

const initialState = {
    cartItems: [],
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.error = null;
        },
        updateCartItem: (state, action) => {
            const { itemId, quantity } = action.payload;
            const itemIndex = state.cartItems.findIndex(item => item._id === itemId);
            if (itemIndex !== -1) {
                state.cartItems[itemIndex].quantity = quantity;
            }
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
        }
    }
});

export const { setCartItems, setLoading, setError, clearCart, updateCartItem, removeCartItem } = cartSlice.actions;

// Async Actions
export const fetchCartItems = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const token = localStorage.getItem('token');

        const response = await axiosInstance.get('/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        dispatch(setCartItems(response.data.cartItems));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch cart items'));
        toast.error('Failed to fetch cart items');
    }
};

export const addToCart = (pizzaId, quantity, size) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('cart/add', { pizzaId, quantity, size });
        dispatch(setCartItems(response.data.cartItems));
        toast.success('Item added to cart');
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to add item to cart'));
        toast.error('Failed to add item to cart');
    }
};

export const removeFromCart = (itemId) => async (dispatch) => {
    try {
        // Optimistically update UI
        dispatch(removeCartItem(itemId));
        
        const response = await axiosInstance.delete(`cart/remove/${itemId}`);
        // Update with server response
        dispatch(setCartItems(response.data.cartItems));
        toast.success('Item removed from cart');
    } catch (error) {
        // Revert on error
        dispatch(fetchCartItems());
        dispatch(setError(error.response?.data?.message || 'Failed to remove item from cart'));
        toast.error('Failed to remove item from cart');
    }
};

export const updateCartItemQuantity = (itemId, quantity) => async (dispatch) => {
    try {
        // Optimistically update UI
        dispatch(updateCartItem({ itemId, quantity }));
        
        const response = await axiosInstance.put(`cart/update/${itemId}`, { quantity });
        // Update with server response
        dispatch(setCartItems(response.data.cartItems));
    } catch (error) {
        // Revert on error
        dispatch(fetchCartItems());
        dispatch(setError(error.response?.data?.message || 'Failed to update cart item'));
        toast.error('Failed to update cart item');
    }
};

export const clearCartItems = () => async (dispatch) => {
    try {
        // Optimistically clear cart
        dispatch(clearCart());
        
        await axiosInstance.delete('cart/clear');
        toast.success('Cart cleared successfully');
    } catch (error) {
        // Revert on error
        dispatch(fetchCartItems());
        dispatch(setError(error.response?.data?.message || 'Failed to clear cart'));
        toast.error('Failed to clear cart');
    }
};

export default cartSlice.reducer;