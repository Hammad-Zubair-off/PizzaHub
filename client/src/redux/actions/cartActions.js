import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART
} from '../../constants/cartConstants';

// Action Creators
export const addToCart = (pizza) => (dispatch) => {
  dispatch({
    type: ADD_TO_CART,
    payload: pizza
  });
  localStorage.setItem('cartItems', JSON.stringify(pizza));
};

export const removeFromCart = (pizzaId) => (dispatch) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: pizzaId
  });
  localStorage.removeItem('cartItems');
};

export const updateCartItem = (pizzaId, quantity) => (dispatch) => {
  dispatch({
    type: UPDATE_CART_ITEM,
    payload: { pizzaId, quantity }
  });
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const updatedItems = cartItems.map(item => 
    item._id === pizzaId ? { ...item, quantity } : item
  );
  localStorage.setItem('cartItems', JSON.stringify(updatedItems));
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: CLEAR_CART });
  localStorage.removeItem('cartItems');
}; 