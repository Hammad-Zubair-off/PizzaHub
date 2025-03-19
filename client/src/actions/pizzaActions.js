import axios from "axios";

// Fetch all pizzas with optional filtering & sorting
export const getAllPizzas = (filters = {}) => async (dispatch) => {
    dispatch({ type: "GET_PIZZAS_REQUEST" });

    try {
        const response = await axios.get("/api/pizzas/getallpizzas", { params: filters });
        dispatch({ type: "GET_PIZZAS_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "GET_PIZZAS_FAILED", payload: error.message });
    }
};

// Add a new pizza (Admin functionality)
export const addPizza = (pizzaData, token) => async (dispatch) => {
    dispatch({ type: "ADD_PIZZA_REQUEST" });

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post("/api/pizzas/addpizza", pizzaData, config);
        dispatch({ type: "ADD_PIZZA_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "ADD_PIZZA_FAILED", payload: error.message });
    }
};

// Delete a pizza (Admin functionality)
export const deletePizza = (pizzaId, token) => async (dispatch) => {
    dispatch({ type: "DELETE_PIZZA_REQUEST" });

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/pizzas/deletepizza/${pizzaId}`, config);
        dispatch({ type: "DELETE_PIZZA_SUCCESS", payload: pizzaId });
    } catch (error) {
        dispatch({ type: "DELETE_PIZZA_FAILED", payload: error.message });
    }
};
