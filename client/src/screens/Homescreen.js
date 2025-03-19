import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPizzas } from "../actions/pizzaActions";
import Pizza from "../components/Pizza";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function Homescreen() {
  const dispatch = useDispatch();
  const pizzasState = useSelector((state) => state.getAllPizzasReducer);
  const { pizzas, error, loading } = pizzasState;

  useEffect(() => {
    dispatch(getAllPizzas());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      {loading && <Loader />}
      {error && <Error message="Error fetching pizzas. Please try again later." />}
      
      <div className="row">
        {pizzas &&
          pizzas.map((pizza) => {
            console.log(pizza); // Debugging log
            return (
              <div key={pizza._id} className="col-md-4 p-2">
                <Pizza pizza={pizza} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
