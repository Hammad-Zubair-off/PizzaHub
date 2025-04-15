// cartReducer.js
import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_ITEM,
    CLEAR_CART
} from '../constants/cartConstants';

const initialState = {
    cartItems: [],
    loading: false,
    error: null
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            const existItem = state.cartItems.find(
                x => x._id === item._id && x.variant === item.variant
            );

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x._id === existItem._id && x.variant === existItem.variant
                            ? { ...x, quantity: x.quantity + item.quantity, totalPrice: x.price * (x.quantity + item.quantity) }
                            : x
                    )
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                };
            }
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    x => !(x._id === action.payload.id && x.variant === action.payload.variant)
                )
            };
        case UPDATE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item._id === action.payload.id && item.variant === action.payload.variant
                        ? { 
                            ...item, 
                            quantity: action.payload.quantity,
                            totalPrice: item.price * action.payload.quantity 
                          }
                        : item
                )
            };
        case CLEAR_CART:
            return {
                ...state,
                cartItems: []
            };
        default:
            return state;
    }
};

export default cartReducer;