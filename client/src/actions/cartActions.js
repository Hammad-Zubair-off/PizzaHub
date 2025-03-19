// cartActions.js
export const addToCart = (pizza, quantity, varient) => (dispatch, getState) => {
    try {
        // Debug log
        console.log("Adding to cart:", { pizza, quantity, varient });

        // Create a cart item with the correct structure
        const cartItem = {
            _id: pizza._id,
            name: pizza.name,
            image: pizza.image,
            varient: varient,
            quantity: quantity,
            prices: pizza.prices  // This should be the full array of price objects
        };

        // Debug log
        console.log("Cart item being added:", cartItem);

        dispatch({ type: 'ADD_TO_CART', payload: cartItem });
        
        // Update localStorage
        const cartItems = getState().cartReducer.cartItems;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error in addToCart:", error);
    }
};

export const deleteFromCart = (pizza) => (dispatch, getState) => {
    try {
        dispatch({ type: 'DELETE_FROM_CART', payload: pizza });
        
        // Update localStorage
        const cartItems = getState().cartReducer.cartItems;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error in deleteFromCart:", error);
    }
};