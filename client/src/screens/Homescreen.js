import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../actions/pizzaActions';
import PizzaCard from '../components/PizzaCard';
import { Row, Col, Container, Alert, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Homescreen = () => {
  const dispatch = useDispatch();
  const { loading, error, pizzas } = useSelector(state => state.pizzaReducer);

  useEffect(() => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  // Only show featured/popular pizzas on homepage
  const featuredPizzas = useMemo(() => {
    return pizzas.filter(pizza => pizza.popularity >= 85).slice(0, 6);
  }, [pizzas]);

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to Kasuri Pizza</h1>
        <p className="lead mb-4">Discover our delicious range of authentic pizzas made with fresh ingredients</p>
        <Link to="/menu" className="btn btn-primary btn-lg">
          View Full Menu
        </Link>
      </div>

      {/* Featured Pizzas Section */}
      <div className="mb-5">
        <Row className="align-items-center mb-4">
          <Col>
            <h2>Featured Pizzas</h2>
          </Col>
          <Col xs="auto">
            <Link to="/menu" className="btn btn-outline-primary">
              See All Pizzas
            </Link>
          </Col>
        </Row>

        {loading ? (
          <Loader />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>
            {featuredPizzas.map(pizza => (
              <Col key={pizza._id} xs={12} sm={6} lg={4} className="mb-4">
                <PizzaCard pizza={pizza} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 bg-light rounded">
        <h3 className="mb-3">Can't decide what to order?</h3>
        <p className="mb-4">Browse our full menu with detailed descriptions and reviews</p>
        <Link to="/menu" className="btn btn-primary">
          Explore Full Menu
        </Link>
      </div>
    </Container>
  );
};

export default Homescreen;
