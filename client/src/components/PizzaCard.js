import React, { useState } from 'react';
import { Card, Badge, Modal, Row, Col, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PizzaCard.css';

const PizzaCard = ({ pizza }) => {
    const [modalShow, setModalShow] = useState(false);
    const [selectedVarient, setSelectedVarient] = useState(pizza.varients[0]);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(pizza, selectedVarient, quantity));
        toast.success('Product added to cart!');
    };

    const getPrice = (varient) => {
        return pizza.prices.find(p => p.varient === varient)?.price || 0;
    };

    return (
        <>
            <Card className="pizza-card h-100" onClick={() => setModalShow(true)}>
                <div className="pizza-image-wrapper">
                    <Card.Img variant="top" src={pizza.image} className="pizza-image" />
                    <Badge 
                        bg={pizza.category === 'Veg' ? 'success' : 'danger'} 
                        className="category-badge"
                    >
                        {pizza.category}
                    </Badge>
                    {pizza.popularity >= 90 && (
                        <Badge bg="warning" text="dark" className="popular-badge">
                            Popular
                        </Badge>
                    )}
                </div>
                <Card.Body>
                    <Card.Title className="pizza-title">{pizza.name}</Card.Title>
                    <div className="pizza-meta">
                        <div className="rating">
                            <i className="fas fa-star text-warning"></i>
                            <span>{pizza.rating}</span>
                        </div>
                        <div className="cooking-time">
                            <i className="far fa-clock"></i>
                            <span>{pizza.cookingTime} min</span>
                        </div>
                    </div>
                    <div className="spice-level">
                        {[...Array(pizza.spiceLevel)].map((_, i) => (
                            <i key={i} className="fas fa-pepper-hot text-danger"></i>
                        ))}
                    </div>
                    <Card.Text className="description-truncate">
                        {pizza.description}
                    </Card.Text>
                    <div className="price-tag">
                        From Rs. {Math.min(...pizza.prices.map(p => p.price))}
                    </div>
                </Card.Body>
            </Card>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                centered
                className="pizza-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{pizza.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <img src={pizza.image} alt={pizza.name} className="modal-image" />
                        </Col>
                        <Col md={6}>
                            <h4 className="mb-3">{pizza.name}</h4>
                            <p className="description">{pizza.description}</p>
                            
                            <div className="meta-details">
                                <div className="rating-box">
                                    <div className="rating">
                                        <i className="fas fa-star text-warning me-1"></i>
                                        {pizza.rating}
                                    </div>
                                    <div className="popularity">
                                        {pizza.popularity}% Popularity
                                    </div>
                                </div>
                                
                                <div className="cooking-details">
                                    <div>
                                        <i className="far fa-clock me-1"></i>
                                        {pizza.cookingTime} min
                                    </div>
                                    <div className="spice-level">
                                        {[...Array(pizza.spiceLevel)].map((_, i) => (
                                            <i key={i} className="fas fa-pepper-hot text-danger"></i>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="ingredients mt-3">
                                <h5>Ingredients:</h5>
                                <div className="ingredients-list">
                                    {pizza.ingredients.map((ingredient, index) => (
                                        <Badge 
                                            key={index} 
                                            bg="light" 
                                            text="dark" 
                                            className="me-2 mb-2"
                                        >
                                            {ingredient}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="tags mt-3">
                                {pizza.tags.map((tag, index) => (
                                    <Badge 
                                        key={index} 
                                        bg="secondary" 
                                        className="me-2"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="size-selector mt-4">
                                <h5>Select Size:</h5>
                                <div className="varient-buttons">
                                    {pizza.varients.map((varient) => (
                                        <button
                                            key={varient}
                                            className={`varient-btn ${selectedVarient === varient ? 'active' : ''}`}
                                            onClick={() => setSelectedVarient(varient)}
                                        >
                                            {varient}
                                            <span className="price">Rs. {getPrice(varient)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="quantity-input mt-3">
                                <h5>Quantity:</h5>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={quantity}
                                    onChange={e => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                                    style={{ width: '80px', display: 'inline-block' }}
                                />
                            </div>
                            <button 
                                className="btn btn-primary w-100 mt-4"
                                onClick={handleAddToCart}
                            >
                                Add to Cart - Rs. {getPrice(selectedVarient)}
                            </button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PizzaCard; 