import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_ITEM,
    CLEAR_CART
} from '../../constants/cartConstants';

const initialState = {
    cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]')
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload]
            };

        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload)
            };

        case UPDATE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item._id === action.payload.pizzaId
                        ? { ...item, quantity: action.payload.quantity }
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