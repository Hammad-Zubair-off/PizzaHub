// cartReducer.js
export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            // Debug log
            console.log("Processing ADD_TO_CART in reducer:", action.payload);
            
            // Check if the item with the same ID AND variant exists
            const existingItem = state.cartItems.find(
                item => item._id === action.payload._id && item.varient === action.payload.varient
            );
            
            if (existingItem) {
                // If item exists, replace it with the new payload
                return {
                    ...state,
                    cartItems: state.cartItems.map(item => 
                        (item._id === action.payload._id && item.varient === action.payload.varient) 
                            ? action.payload 
                            : item
                    )
                };
            } else {
                // If item doesn't exist, add it to cart
                return {
                    ...state,
                    cartItems: [...state.cartItems, action.payload]
                };
            }
            
        case 'DELETE_FROM_CART':
            // Debug log
            console.log("Processing DELETE_FROM_CART in reducer:", action.payload);
            
            // Delete items matching both ID AND variant
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    item => !(item._id === action.payload._id && item.varient === action.payload.varient)
                )
            };
            
        default:
            return state;
    }
};