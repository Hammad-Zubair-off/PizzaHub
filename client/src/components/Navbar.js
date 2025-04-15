import React from 'react';
import './Navbar.css';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dropdown, Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';

// CategoryFilter Component
const CategoryFilter = () => (
    <Dropdown className="category-filter mx-2">
        <Dropdown.Toggle variant="outline-secondary" id="category-dropdown">
            <i className="fas fa-filter me-1"></i>
            Filter
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/menu?category=all">All Pizzas</Dropdown.Item>
            <Dropdown.Item as={Link} to="/menu?category=veg">Veg Only</Dropdown.Item>
            <Dropdown.Item as={Link} to="/menu?category=non-veg">Non-Veg</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/menu?sort=popular">Most Popular</Dropdown.Item>
            <Dropdown.Item as={Link} to="/menu?sort=rating">Top Rated</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

// UserMenu Component
const UserMenu = ({ user, handleLogout }) => (
    <Dropdown align="end">
        <Dropdown.Toggle 
            as="div" 
            className="nav-link user-dropdown d-flex align-items-center px-3"
        >
            <div className="avatar me-2">
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="d-none d-lg-block">
                {user?.name || 'Account'}
            </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-sm">
            <Dropdown.Item as={Link} to="/profile">
                <i className="fas fa-user me-2"></i>
                Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/orders">
                <i className="fas fa-receipt me-2"></i>
                Orders
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/favorites">
                <i className="fas fa-heart me-2"></i>
                Favorites
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item 
                className="text-danger"
                onClick={handleLogout}
            >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

// Cart Button Component
const CartButton = ({ itemCount }) => (
    <Link 
        className="nav-link position-relative px-3" 
        to="/cart"
    >
        <i className="fas fa-shopping-cart"></i>
        {itemCount > 0 && (
            <span className="cart-badge">
                {itemCount}
            </span>
        )}
    </Link>
);

// Main Navbar Component
export default function Navbar() {
    const cartState = useSelector(state => state.cartReducer);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <BootstrapNavbar expand="lg" className="navbar shadow-sm sticky-top bg-white py-2">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    <i className="fas fa-pizza-slice me-2"></i>
                    KASURI PIZZA
                </BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="navbarNav" />

                <BootstrapNavbar.Collapse id="navbarNav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="px-3">Home</Nav.Link>
                        <Nav.Link as={Link} to="/menu" className="px-3">Menu</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="px-3">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="px-3">Contact</Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center gap-3">
                        {/* Admin Panel Button - Always visible */}
                        <Link 
                            className="btn btn-outline-primary" 
                            to="/dashboard"
                        >
                            <i className="fas fa-user-shield me-1"></i>
                            Admin
                        </Link>

                        {/* Filter */}
                        <CategoryFilter />

                        {/* Auth Buttons */}
                        {isAuthenticated() ? (
                            <div className="d-flex align-items-center gap-2">
                                <CartButton itemCount={cartState.cartItems.length} />
                                <UserMenu user={user} handleLogout={handleLogout} />
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <Link className="nav-link" to="/login">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Login
                                </Link>
                                <Link className="btn btn-primary rounded-pill px-4" to="/register">
                                    Sign Up
                            </Link>
                </div>
                        )}
            </div>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}
