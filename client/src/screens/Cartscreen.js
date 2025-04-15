import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, ListGroup, Image, Button, Alert } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart, updateCartItemQuantity } from '../actions/cartActions';
import ProceedToCheckout from '../components/ProceedToCheckout';

const CartScreen = () => {
    const dispatch = useDispatch();
    // Access cartReducer state with proper structure
    const cartState = useSelector((state) => state.cartReducer);
    const { cartItems = [], error } = cartState || {};

    const removeFromCartHandler = (id, variant) => {
        try {
            dispatch(removeFromCart(id, variant));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const updateQuantityHandler = (id, variant, quantity) => {
        try {
            if (quantity > 0 && quantity <= 10) {
                dispatch(updateCartItemQuantity(id, variant, quantity));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="cart-screen">
            <h2 className="text-center mb-4">
                <i className="fas fa-shopping-cart"></i> My Cart
            </h2>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {!cartItems || cartItems.length === 0 ? (
                <div className="text-center">
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious pizzas to get started!</p>
                </div>
            ) : (
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item key={`${item._id}-${item.variant}`}>
                                    <Row className="align-items-center">
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <h5>{item.name}</h5>
                                            <p className="mb-0">Size: {item.variant}</p>
                                        </Col>
                                        <Col md={2}>
                                            <p className="mb-0">Rs. {item.price}/-</p>
                                            <small className="text-muted">
                                                Total: Rs. {(item.price * item.quantity).toFixed(2)}/-
                                            </small>
                                        </Col>
                                        <Col md={3}>
                                            <div className="d-flex align-items-center quantity-selector">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => 
                                                        updateQuantityHandler(item._id, item.variant, item.quantity - 1)
                                                    }
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => 
                                                        updateQuantityHandler(item._id, item.variant, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= 10}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <Button
                                                variant="danger"
                                                onClick={() => removeFromCartHandler(item._id, item.variant)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <ProceedToCheckout cartItems={cartItems} />
                    </Col>
                </Row>
            )}
            <style jsx>{`
                .cart-screen {
                    padding: 20px;
                }
                .quantity-selector {
                    justify-content: center;
                }
                .quantity-selector span {
                    min-width: 30px;
                    text-align: center;
                }
                .text-muted {
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
};

export default CartScreen;