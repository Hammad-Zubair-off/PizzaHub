import React from 'react';
import './Navbar.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const cartState = useSelector(state => state.cartReducer);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-lg p-3 mb-5 bg-white rounded">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">KASURIPIZZA</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                       
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">
                                <i className="fa-solid fa-cart-shopping" style={{ color: 'grey' }}></i>
                                <b style={{ fontSize: '10px', color: 'black' }}>{cartState.cartItems.length}</b>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin">Admin</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
