import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Badge } from 'react-bootstrap';
import { FaUser, FaShoppingBag, FaClock, FaCheck, FaCalendar, FaPizzaSlice } from 'react-icons/fa';
import '../styles/ProfileScreen.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="profile-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getOrderStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const pendingOrders = user.orders?.filter(order => 
    ['pending', 'processing'].includes(order.status.toLowerCase())) || [];
  
  const completedOrders = user.orders?.filter(order => 
    order.status.toLowerCase() === 'completed') || [];

  return (
    <div className="profile-container">
      <div className="row justify-content-center w-100">
        <div className="col-lg-8">
          <div className="profile-card">
            <div className="card-body p-4 p-sm-5">
              <div className="profile-header">
                <div className="profile-avatar">
                  {getInitials(user.name)}
                </div>
                <h1 className="profile-title">Welcome, {user.name}!</h1>
                <p className="profile-subtitle">
                  Member since {formatDate(user.createdAt)}
                </p>
              </div>
              
              <div className="orders-section">
                <div className="section-header">
                  <h2>
                    <FaShoppingBag className="section-icon" />
                    Order History
                  </h2>
                </div>

                {/* Pending Orders */}
                <div className="order-category">
                  <h3>
                    <FaClock className="category-icon" />
                    Pending Orders ({pendingOrders.length})
                  </h3>
                  {pendingOrders.length === 0 ? (
                    <p className="no-orders">No pending orders</p>
                  ) : (
                    <div className="orders-list">
                      {pendingOrders.map(order => (
                        <div key={order._id} className="order-card">
                          <div className="order-header">
                            <div className="order-id">
                              Order #{order._id.slice(-6)}
                            </div>
                            {getOrderStatus(order.status)}
                          </div>
                          <div className="order-details">
                            <div className="order-info">
                              <FaCalendar className="info-icon" />
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="order-info">
                              <FaPizzaSlice className="info-icon" />
                              {order.items.length} items
                            </div>
                            <div className="order-total">
                              {formatPrice(order.totalAmount)}
                            </div>
                          </div>
                          <div className="order-items">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">x{item.quantity}</span>
                                <span className="item-price">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                </div>
              )}
                </div>

                {/* Completed Orders */}
                <div className="order-category">
                  <h3>
                    <FaCheck className="category-icon" />
                    Completed Orders ({completedOrders.length})
                  </h3>
                  {completedOrders.length === 0 ? (
                    <p className="no-orders">No completed orders</p>
                  ) : (
                    <div className="orders-list">
                      {completedOrders.map(order => (
                        <div key={order._id} className="order-card">
                          <div className="order-header">
                            <div className="order-id">
                              Order #{order._id.slice(-6)}
                            </div>
                            {getOrderStatus(order.status)}
                          </div>
                          <div className="order-details">
                            <div className="order-info">
                              <FaCalendar className="info-icon" />
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="order-info">
                              <FaPizzaSlice className="info-icon" />
                              {order.items.length} items
                            </div>
                            <div className="order-total">
                              {formatPrice(order.totalAmount)}
                            </div>
                          </div>
                          <div className="order-items">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">x{item.quantity}</span>
                                <span className="item-price">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                </div>
              )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 