import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProceedToCheckout = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cartReducer || { cartItems: [] });

    const userLogin = useSelector((state) => state.authReducer);
    const dispatch = useDispatch();

    const { cartItems } = cart;
    const { user } = userLogin;

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleCheckout = () => {
        if (user) {
            navigate('/login?redirect=shipping');
        } else {
            // Simulate order confirmation
            toast.success('Order placed successfully!', { position: "top-right", autoClose: 2000 });
            // Optionally, you can clear the cart or redirect after a delay
            // dispatch(clearCart());
            // setTimeout(() => navigate('/'), 2000);
        }
    };

    return (
        <div className="proceed-checkout">
            <ToastContainer />
            <div className="subtotal">
                <h4>Subtotal: Rs. {calculateSubtotal().toFixed(2)}/-</h4>
                <p>Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
            </div>
            <Button
                className="w-100"
                variant="success"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
            >
                {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
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