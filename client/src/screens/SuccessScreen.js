import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../actions/cartActions';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart after successful payment
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body className="p-5">
              <div className="mb-4">
                <FaCheckCircle size={80} className="text-success" />
              </div>
              <Card.Title className="h3 mb-3">Payment Successful!</Card.Title>
              <Card.Text className="mb-4">
                Thank you for your order. Your payment has been processed successfully.
                We'll send you an email with your order details shortly.
              </Card.Text>
              <div className="d-grid gap-2">
                <Link to="/menu">
                  <Button variant="primary" size="lg" className="w-100">
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="outline-secondary" size="lg" className="w-100">
                    View Orders
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessScreen; 