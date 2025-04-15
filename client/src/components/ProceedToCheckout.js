import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ProceedToCheckout = ({ cartItems }) => {
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.authReducer);
    const { user: userInfo } = userLogin || {};

    const calculateSubtotal = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotalItems = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckout = () => {
        if (!userInfo) {
            navigate('/login?redirect=shipping');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <div className="proceed-checkout">
            <div className="subtotal">
                <h4>Subtotal: Rs. {calculateSubtotal().toFixed(2)}/-</h4>
                <p>Total Items: {calculateTotalItems()}</p>
            </div>
            <Button
                className="w-100"
                variant="success"
                disabled={!cartItems || cartItems.length === 0}
                onClick={handleCheckout}
            >
                {!cartItems || cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
            </Button>
            <style jsx>{`
                .proceed-checkout {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin-top: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .subtotal {
                    margin-bottom: 15px;
                }
                .subtotal h4 {
                    color: #28a745;
                    margin-bottom: 10px;
                    font-weight: 600;
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