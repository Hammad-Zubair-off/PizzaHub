import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
    fetchCartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCartItems 
} from '../reducers/cartReducer';
import { Button, Container, Table, Form, Row, Col, Card } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Cartscreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cartItems, loading, error } = useSelector(state => state.cartReducer);

    useEffect(() => {
        if (isAuthenticated()) {
            dispatch(fetchCartItems());
        } else {
            navigate('/login');
        }
    }, [dispatch, isAuthenticated, navigate]);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateCartItemQuantity(itemId, newQuantity));
        }
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleClearCart = () => {
        dispatch(clearCartItems());
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <div className="alert alert-danger">{error}</div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-5">
                    <h4>Your cart is empty</h4>
                    <Link to="/menu" className="btn btn-primary mt-3">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <>
                    <Table responsive className="align-middle">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item?._id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={item?.pizza?.image} 
                                                alt={item?.pizza?.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                className="me-2"
                                            />
                                            <span>{item?.pizza?.name}</span>
                                        </div>
                                    </td>
                                    <td>{item?.size}</td>
                                    <td>${item?.price?.toFixed(2)}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm"
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            >
                                                <FaMinus />
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                value={item?.quantity}
                                                min="1"
                                                className="mx-2"
                                                style={{ width: '60px' }}
                                                onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                            />
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm"
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </div>
                                    </td>
                                    <td>${(item?.price * item?.quantity).toFixed(2)}</td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleRemoveItem(item._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row className="mt-4">
                        <Col md={6}>
                            <Button 
                                variant="outline-danger" 
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h4>Order Summary</h4>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tax (10%):</span>
                                    <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total:</strong>
                                    <strong>${(calculateSubtotal() * 1.1).toFixed(2)}</strong>
                                </div>
                                <Button 
                                    variant="primary" 
                                    className="w-100"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Cartscreen;