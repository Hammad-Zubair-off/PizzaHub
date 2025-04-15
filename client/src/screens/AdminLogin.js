import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Alert, Button, Container, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        email: 'admin@pizzahub.com',  // Default admin email
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in as admin
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (token && user.role === 'admin') {
            navigate('/admin/productList');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Make sure we're sending both email and password
            if (!formData.email || !formData.password) {
                setError('Both email and password are required');
                return;
            }

            const response = await axios.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.success && response.data.user?.role === 'admin') {
                // Store the token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Set default authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                // Redirect to product list (admin functionality)
                navigate('/admin/productList');
            } else {
                setError('Unauthorized access. Admin privileges required.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <div style={{ maxWidth: "400px", width: "100%" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Admin Login</h2>
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
                                    disabled  // Disable email field since we're using a fixed admin email
                                />
                                <Form.Text className="text-muted">
                                    Default admin email: admin@pizzahub.com
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter admin password"
                                    autoComplete="current-password"
                                />
                            </Form.Group>
                            <Button
                                className="w-100"
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login as Admin'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default AdminLogin; 