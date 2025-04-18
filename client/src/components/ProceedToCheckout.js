import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51REHrHH0xzDgBkN3jfhb6Ff0mrC4tZMqP2GXYlEmVHr6iyFMv0W2uG88VXOJimnuppdaRVB9MnVDrfAtHL5bfiIP00eOa7M9GF');

const ProceedToCheckout = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cartReducer || { cartItems: [] });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'PK'
    });

    const { cartItems } = cart;

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Validate shipping address
        if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
            toast.error('Please fill in all shipping address fields');
            return;
        }

        try {
            setLoading(true);
            
            // Load Stripe
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Failed to load Stripe');
            }

            // Create checkout session
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    cartItems,
                    shippingAddress
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const session = await response.json();
            
            if (!session.id) {
                throw new Error('Invalid session response');
            }

            // Redirect to Stripe checkout
            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            
            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(`Checkout failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="proceed-checkout">
            <ToastContainer />
            <Form className="mb-4">
                <h5 className="mb-3">Shipping Address</h5>
                <Form.Group className="mb-3">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleAddressChange}
                        placeholder="Enter your street address"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        placeholder="Enter your city"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        placeholder="Enter your state"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        placeholder="Enter your ZIP code"
                        required
                    />
                </Form.Group>
            </Form>
            <div className="subtotal">
                <h4>Subtotal: Rs. {calculateSubtotal().toFixed(2)}/-</h4>
                <p>Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
            </div>
            <Button
                className="w-100"
                variant="success"
                disabled={cartItems.length === 0 || loading}
                onClick={handleCheckout}
            >
                {loading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                        Processing...
                    </>
                ) : cartItems.length === 0 ? (
                    'Cart is Empty'
                ) : (
                    'Proceed to Checkout'
                )}
            </Button>
            <style jsx>{`
                .proceed-checkout {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .subtotal {
                    margin-bottom: 15px;
                }
                .subtotal h4 {
                    color: #28a745;
                    margin-bottom: 10px;
                }
                .subtotal p {
                    margin-bottom: 0;
                    color: #6c757d;
                }
            `}</style>
        </div>
    );
};

export default ProceedToCheckout; 