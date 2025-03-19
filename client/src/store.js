// store.js
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { getAllPizzasReducer } from './reducers/pizzaReducers';
import { cartReducer } from './reducers/cartReducer';

// Initialize cart state properly
const cartItems = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

const initialState = {
    cartReducer: {
        cartItems: cartItems
    },
    getAllPizzasReducer: {
        pizzas: []
    }
};

const rootReducer = combineReducers({
    getAllPizzasReducer,
    cartReducer,
});

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;