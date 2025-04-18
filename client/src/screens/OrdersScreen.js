import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login to view your orders');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(response.data.orders);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.response?.data?.message || 'Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: 'warning',
            confirmed: 'info',
            preparing: 'primary',
            out_for_delivery: 'info',
            delivered: 'success',
            cancelled: 'danger'
        };

        return (
            <Badge bg={statusColors[status] || 'secondary'}>
                {status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <Loader />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <Container className="py-5">
            <h2 className="mb-4">My Orders</h2>
            {orders.length === 0 ? (
                <Card>
                    <Card.Body className="text-center">
                        <h5>No orders found</h5>
                        <p>You haven't placed any orders yet.</p>
                    </Card.Body>
                </Card>
            ) : (
                orders.map((order) => (
                    <Card key={order._id} className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Order #{order._id.slice(-6)}</strong>
                                <span className="ms-3 text-muted">
                                    {formatDate(order.createdAt)}
                                </span>
                            </div>
                            {getStatusBadge(order.status)}
                        </Card.Header>
                        <Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.pizza.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>Rs. {item.price.toFixed(2)}</td>
                                            <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end">
                                            <strong>Total Amount:</strong>
                                        </td>
                                        <td>
                                            <strong>Rs. {order.totalAmount.toFixed(2)}</strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </Table>
                            {order.shippingAddress && (
                                <div className="mt-3">
                                    <h6>Shipping Address:</h6>
                                    <p className="mb-0">
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default OrdersScreen; 