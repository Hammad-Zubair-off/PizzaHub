import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Alert, Button } from 'react-bootstrap';
import '../styles/Auth.css';

const Loginscreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            
            // Check if user is admin and redirect accordingly
            if (isAdmin()) {
                navigate('/dashboard');
            } else {
                // Redirect to the attempted page or home
                const from = location.state?.from?.pathname || '/';
                navigate(from);
            }
        } catch (err) {
            setError(err.message || 'Failed to log in');
        } finally {
            setLoading(false);
    }
  };

  return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <div className="auth-overlay">
                    <div className="auth-content">
                        <h1>Welcome to PizzaHub</h1>
                        <p>Experience the best pizza delivery service in town. Order your favorite pizzas with just a few clicks.</p>
                    </div>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-form-container">
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
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
                  />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="rememberMe"
                                label="Remember me"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                        </Form.Group>
                <div className="d-grid">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                </div>
                    </Form>
                    <div className="text-center mt-3">
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginscreen;
