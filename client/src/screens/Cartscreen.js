import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, deleteFromCart } from '../actions/cartActions';

export default function Cartscreen() {
    const cartState = useSelector(state => state.cartReducer);
    const cartItems = cartState.cartItems || [];
    const dispatch = useDispatch();

    // Debug log - remove in production
    console.log("Cart Items in Cartscreen:", cartItems);

    // Calculate subtotal safely
    const subtotal = cartItems.reduce((total, item) => {
        if (!item || !item.prices || !item.varient) return total;
        
        // Find the price for this variant
        const priceObj = item.prices.find(p => p.varient === item.varient);
        const price = priceObj ? priceObj.price : 0;
        
        return total + (item.quantity * price);
    }, 0);

    // Handler for updating quantity
    const handleQuantityChange = (item, newQuantity) => {
        dispatch(addToCart(item, newQuantity, item.varient));
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <h2 className="text-center mb-4" style={{ fontSize: '36px' }}>🛒 My Cart</h2>
                    
                    {cartItems.length === 0 ? (
                        <h4 className="text-center text-muted">Your cart is empty.</h4>
                    ) : (
                        cartItems.map((item) => {
                            if (!item) return null;
                            
                            // Get price for this variant
                            const priceObj = item.prices && item.prices.find(p => p.varient === item.varient);
                            const price = priceObj ? priceObj.price : 0;
                            
                            return (
                                <div key={item._id} className="d-flex align-items-center justify-content-between border p-3 mb-2 shadow-sm rounded">
                                    {/* Left Section - Product Info */}
                                    <div className="w-50">
                                        <h5>{item.name} <small>({item.varient})</small></h5>
                                        <p className="mb-1">
                                            Price: {item.quantity} × {price} = <b>Rs. {item.quantity * price}</b>
                                        </p>
                                        
                                        {/* Quantity Buttons */}
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                            <span className="fw-bold">{item.quantity}</span>
                                            <button
                                                className="btn btn-sm btn-outline-danger ms-2"
                                                onClick={() => {
                                                    if (item.quantity > 1) {
                                                        handleQuantityChange(item, item.quantity - 1);
                                                    }
                                                }}
                                                disabled={item.quantity <= 1}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Middle Section - Image */}
                                    <div className="text-center">
                                        <img src={item.image} alt={item.name} className="rounded" height="80px" width="80px" />
                                    </div>

                                    {/* Right Section - Delete Icon */}
                                    <div>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(deleteFromCart(item))}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Subtotal & Checkout */}
                <div className="col-md-4 text-center">
                    <h3 className="fw-bold">Subtotal: Rs. {subtotal}/-</h3>
                    <button className="btn btn-success w-100 mt-3">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
}