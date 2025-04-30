import React, { useState } from 'react';
import './Navbar.css';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dropdown, Container, Nav, Navbar as BootstrapNavbar, Modal, Form, Button, Alert } from 'react-bootstrap';

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

// Admin Login Modal Component
const AdminLoginModal = ({ show, handleClose, handleSubmit, error, loading }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Admin Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(formData);
                }}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <div className="d-grid">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login as Admin'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

// Main Navbar Component
export default function Navbar() {
    const cartState = useSelector(state => state.cartReducer);
    const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
    const navigate = useNavigate();
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminError, setAdminError] = useState('');
    const [adminLoading, setAdminLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAdminLogin = async (formData) => {
        setAdminError('');
        setAdminLoading(true);
        try {
            const result = await login(formData.email, formData.password, true);
            if (result.success) {
                setShowAdminModal(false);
                navigate('/admin/dashboard');
            } else {
                setAdminError(result.error);
            }
        } catch (err) {
            setAdminError(err.message || 'Failed to log in');
        } finally {
            setAdminLoading(false);
        }
    };

    return (
        <>
            <BootstrapNavbar expand="lg" className="navbar shadow-sm sticky-top bg-white py-2">
                <Container>
                    <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold text-primary">
                        <i className="fas fa-pizza-slice me-2"></i>
                        KASURI PIZZA
                    </BootstrapNavbar.Brand>

                    <BootstrapNavbar.Toggle aria-controls="navbarNav" />

                    <BootstrapNavbar.Collapse id="navbarNav">
                        <Nav className="ms-auto align-items-center">
                            <CategoryFilter />
                            <Link className="nav-link px-3" to="/menu">
                                Menu
                            </Link>
                            <Link className="nav-link px-3" to="/about">
                                About
                            </Link>
                            <CartButton itemCount={cartState.cartItems.length} />
                            
                            {isAuthenticated() ? (
                                <>
                                    {isAdmin() ? (
                                        <Link 
                                            className="nav-link px-3" 
                                            to="/admin/dashboard"
                                        >
                                            <i className="fas fa-user-shield me-1"></i>
                                            Admin Panel
                                        </Link>
                                    ) : (
                                        <button
                                            className="nav-link px-3"
                                            onClick={() => setShowAdminModal(true)}
                                        >
                                            <i className="fas fa-user-shield me-1"></i>
                                            Admin Login
                                        </button>
                                    )}
                                    <UserMenu user={user} handleLogout={handleLogout} />
                                </>
                            ) : (
                                <>
                                    <button
                                        className="nav-link px-3"
                                        onClick={() => setShowAdminModal(true)}
                                    >
                                        <i className="fas fa-user-shield me-1"></i>
                                        Admin Login
                                    </button>
                                    <Link className="nav-link px-3" to="/login">
                                        Login
                                    </Link>
                                    <Link className="nav-link px-3" to="/register">
                                        Register
                                    </Link>
                                </>
                            )}
                        </Nav>
                    </BootstrapNavbar.Collapse>
                </Container>
            </BootstrapNavbar>

            <AdminLoginModal
                show={showAdminModal}
                handleClose={() => setShowAdminModal(false)}
                handleSubmit={handleAdminLogin}
                error={adminError}
                loading={adminLoading}
            />
        </>
    );
}
