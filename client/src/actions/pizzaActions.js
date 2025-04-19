import axios from "axios";
import {
    FETCH_PIZZAS_REQUEST,
    FETCH_PIZZAS_SUCCESS,
    FETCH_PIZZAS_FAILURE,
    ADD_PIZZA_REQUEST,
    ADD_PIZZA_SUCCESS,
    ADD_PIZZA_FAILURE,
    UPDATE_PIZZA_REQUEST,
    UPDATE_PIZZA_SUCCESS,
    UPDATE_PIZZA_FAILURE,
    DELETE_PIZZA_REQUEST,
    DELETE_PIZZA_SUCCESS,
    DELETE_PIZZA_FAILURE
} from '../constants/pizzaConstants';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL =  'http://localhost:5000/api';

// Fetch all pizzas
export const fetchPizzas = (category = '', sort = '') => async (dispatch) => {
    try {
        console.log('Error here');
        dispatch({ type: FETCH_PIZZAS_REQUEST });
        
        // Build query string
        let queryString = '';
        if (category) queryString += `?category=${category}`;
        if (sort) queryString += `${queryString ? '&' : '?'}sort=${sort}`;
        
        console.log('URL Requesting from String:', `${API_URL}/pizzas${queryString}`);
        
        const { data } = await axios.get(`${API_URL}/pizzas${queryString}`);
        dispatch({ type: FETCH_PIZZAS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_PIZZAS_FAILURE,
            payload: error.response?.data?.message || 'Error fetching pizzas'
        });
    }
};

// export const fetchPizzas = (category = '', sort = '') => async (dispatch) => {
//     try {
//         console.log('Dispatching FETCH_PIZZAS_REQUEST');
//         dispatch({ type: FETCH_PIZZAS_REQUEST });

//         let queryString = '';
//         if (category) queryString += `?category=${category}`;
//         if (sort) queryString += `${queryString ? '&' : '?'}sort=${sort}`;

//         console.log('Query String:', queryString);
//         const url = `${API_URL}/pizzas${queryString}`;
//         console.log('URL:', url);
//         const { data } = await axios.get(`${API_URL}/pizzas${queryString}`);
//         console.log('Fetched data:', data);

//         dispatch({ type: FETCH_PIZZAS_SUCCESS, payload: data });
//     } catch (error) {
//         console.error('Error fetching pizzas:', error);
//         dispatch({
//             type: FETCH_PIZZAS_FAILURE,
//             payload: error.response?.data?.message || 'Error fetching pizzas'
//         });
//     }
// };


// Get Single Pizza
export const fetchPizzaById = (id) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PIZZAS_REQUEST });
        const { data } = await axios.get(`${API_URL}/pizzas/${id}`);
        dispatch({ type: FETCH_PIZZAS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_PIZZAS_FAILURE,
            payload: error.response?.data?.message || 'Error fetching pizza'
        });
    }
};

// Add new pizza
export const addPizza = (pizzaData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_PIZZA_REQUEST });
        const { data } = await axios.post(`${API_URL}/pizzas`, pizzaData);
        dispatch({ type: ADD_PIZZA_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ADD_PIZZA_FAILURE,
            payload: error.response?.data?.message || 'Error adding pizza'
        });
    }
};

// Update pizza
export const updatePizza = (id, pizzaData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PIZZA_REQUEST });
        const { data } = await axios.put(`${API_URL}/pizzas/${id}`, pizzaData);
        dispatch({ type: UPDATE_PIZZA_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: UPDATE_PIZZA_FAILURE,
            payload: error.response?.data?.message || 'Error updating pizza'
        });
    }
};

// Delete pizza
export const deletePizza = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PIZZA_REQUEST });
        await axios.delete(`${API_URL}/pizzas/${id}`);
        dispatch({ type: DELETE_PIZZA_SUCCESS, payload: id });
    } catch (error) {
        dispatch({
            type: DELETE_PIZZA_FAILURE,
            payload: error.response?.data?.message || 'Error deleting pizza'
        });
    }
};
