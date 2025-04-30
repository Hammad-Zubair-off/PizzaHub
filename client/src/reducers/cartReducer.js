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
        }
    }
});

export const { setCartItems, setLoading, setError, clearCart } = cartSlice.actions;

// Async Actions
export const fetchCartItems = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/cart', {
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
        console.log(pizzaId, quantity, size,"pizzaId, quantity, size");
        dispatch(setLoading(true));
        const response = await axiosInstance.post('cart/add', { pizzaId, quantity, size });
        console.log(response,"response from add to carts");
        dispatch(setCartItems(response.data.cartItems));
        toast.success('Item added to cart');
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to add item to cart'));
        toast.error('Failed to add item to cart');
    }
};

export const removeFromCart = (itemId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axiosInstance.delete(`cart/remove/${itemId}`);
        dispatch(setCartItems(response.data.cartItems));
        toast.success('Item removed from cart');
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to remove item from cart'));
        toast.error('Failed to remove item from cart');
    }
};

export const updateCartItemQuantity = (itemId, quantity) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axiosInstance.put(`cart/update/${itemId}`, { quantity });
        dispatch(setCartItems(response.data.cartItems));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to update cart item'));
        toast.error('Failed to update cart item');
    }
};

export const clearCartItems = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await axiosInstance.delete('cart/clear');
        dispatch(clearCart());
        toast.success('Cart cleared successfully');
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to clear cart'));
        toast.error('Failed to clear cart');
    }
};

export default cartSlice.reducer;