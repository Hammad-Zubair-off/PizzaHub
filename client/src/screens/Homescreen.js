import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../actions/pizzaActions';
import PizzaCard from '../components/PizzaCard';
import { Row, Col, Container, Alert, Form } from 'react-bootstrap';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

const Homescreen = () => {
    const dispatch = useDispatch();
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState('');

    const { loading, error, pizzas } = useSelector(state => state.pizzaReducer);

    useEffect(() => {
        dispatch(fetchPizzas(category !== 'all' ? category : '', sort));
    }, [dispatch, category, sort]);

    return (
        <Container className="py-5">
            <Row className="my-4">
                <Col md={8}>
                    <h2>Our Menu</h2>
                </Col>
                <Col md={4}>
                    <SearchBar />
                </Col>
            </Row>
            <div className="filters mb-4">
                <Row className="align-items-center">
                    <Col md={6} lg={3}>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="all">All Pizzas</option>
                                <option value="veg">Vegetarian</option>
                                <option value="non-veg">Non-Vegetarian</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6} lg={3}>
                        <Form.Group>
                            <Form.Label>Sort By</Form.Label>
                            <Form.Select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Default</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Top Rated</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row>
                    {pizzas.map(pizza => (
                        <Col key={pizza._id} xs={12} sm={6} lg={4} className="mb-4">
                            <PizzaCard pizza={pizza} />
                        </Col>
                    ))}
                    {pizzas.length === 0 && (
                        <Col xs={12}>
                            <Alert variant="info">
                                No pizzas found. Try adjusting your filters.
                            </Alert>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default Homescreen;
