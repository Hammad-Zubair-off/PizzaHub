import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pizzas, setPizzas] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('pizzas');

    // State for pizza form
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPizza, setCurrentPizza] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        varients: ['small', 'medium', 'large'],
        prices: [
            { varient: 'small', price: 0 },
            { varient: 'medium', price: 0 },
            { varient: 'large', price: 0 }
        ],
        category: 'Veg',
        image: '',
        description: '',
        ingredients: [''],
        cookingTime: 15,
        spiceLevel: 1,
        rating: 4.0,
        popularity: 80,
        tags: [],
        isAvailable: true
    });
    const [formError, setFormError] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        if (!isAdmin()) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [isAdmin, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found. Please login again.');
                navigate('/admin/login');
                return;
            }

            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch pizzas
            const pizzasResponse = await axios.get('/api/pizzas', { headers });
            setPizzas(pizzasResponse.data);

            // Fetch orders
            const ordersResponse = await axios.get('/api/orders/all', { headers });
            setOrders(ordersResponse.data.orders);

            // Fetch users
            const usersResponse = await axios.get('/api/auth/users', { headers });
            setUsers(usersResponse.data.users);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            const errorMessage = err.response?.data?.message || 'Failed to fetch data';
            setError(errorMessage);
            setLoading(false);

            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                navigate('/admin/login');
            }
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle price changes
    const handlePriceChange = (index, value) => {
        const newPrices = [...formData.prices];
        newPrices[index].price = Number(value);
        setFormData({
            ...formData,
            prices: newPrices
        });
    };

    // Handle ingredient changes
    const handleIngredientChange = (index, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData({
            ...formData,
            ingredients: newIngredients
        });
    };

    // Add new ingredient field
    const addIngredientField = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, '']
        });
    };

    // Remove ingredient field
    const removeIngredientField = (index) => {
        const newIngredients = [...formData.ingredients];
        newIngredients.splice(index, 1);
        setFormData({
            ...formData,
            ingredients: newIngredients
        });
    };

    // Handle form submission for adding new pizza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            // Validate form
            if (!formData.name || !formData.image || !formData.description) {
                setFormError('Please fill in all required fields');
                return;
            }

            // Filter out empty ingredients
            const filteredIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
            
            if (filteredIngredients.length === 0) {
                setFormError('Please add at least one ingredient');
                return;
            }

            // Prepare pizza data
            const pizzaData = {
                ...formData,
                ingredients: filteredIngredients
            };

            const token = localStorage.getItem('token');
            if (!token) {
                setFormError('No authentication token found. Please login again.');
                navigate('/admin/login');
                return;
            }

            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Add new pizza
            const response = await axios.post('/api/pizzas', pizzaData, { headers });
            
            if (response.data) {
                // Refresh pizzas list
                const pizzasResponse = await axios.get('/api/pizzas', { headers });
                setPizzas(pizzasResponse.data);
                
                // Close modal and reset form
                setShowAddModal(false);
                resetForm();
                toast.success('Pizza added successfully!');
            }
        } catch (err) {
            console.error('Error adding pizza:', err);
            const errorMessage = err.response?.data?.message || 'Failed to add pizza';
            setFormError(errorMessage);

            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                navigate('/admin/login');
            }
        }
    };

    // Handle pizza update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            // Validate form
            if (!formData.name || !formData.image || !formData.description) {
                setFormError('Please fill in all required fields');
                return;
            }

            // Filter out empty ingredients
            const filteredIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
            
            if (filteredIngredients.length === 0) {
                setFormError('Please add at least one ingredient');
                return;
            }

            // Prepare pizza data
            const pizzaData = {
                ...formData,
                ingredients: filteredIngredients
            };

            const token = localStorage.getItem('token');
            if (!token) {
                setFormError('No authentication token found. Please login again.');
                navigate('/admin/login');
                return;
            }

            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Update pizza
            const response = await axios.put(`/api/pizzas/${currentPizza._id}`, pizzaData, { headers });
            
            if (response.data) {
                // Refresh pizzas list
                const pizzasResponse = await axios.get('/api/pizzas', { headers });
                setPizzas(pizzasResponse.data);
                
                // Close modal and reset form
                setShowEditModal(false);
                resetForm();
                toast.success('Pizza updated successfully!');
            }
        } catch (err) {
            console.error('Error updating pizza:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update pizza';
            setFormError(errorMessage);

            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                navigate('/admin/login');
            }
        }
    };

    // Handle pizza deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pizza?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please login again.');
                    navigate('/admin/login');
                    return;
                }

                const headers = { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Delete pizza
                await axios.delete(`/api/pizzas/${id}`, { headers });
                
                // Refresh pizzas list
                const response = await axios.get('/api/pizzas', { headers });
                setPizzas(response.data);
                toast.success('Pizza deleted successfully!');
            } catch (err) {
                console.error('Error deleting pizza:', err);
                const errorMessage = err.response?.data?.message || 'Failed to delete pizza';
                setError(errorMessage);

                // If unauthorized, redirect to login
                if (err.response?.status === 401) {
                    navigate('/admin/login');
                }
            }
        }
    };

    // Handle edit pizza
    const handleEdit = (pizza) => {
        setCurrentPizza(pizza);
        setFormData({
            name: pizza.name,
            varients: pizza.varients,
            prices: pizza.prices,
            category: pizza.category,
            image: pizza.image,
            description: pizza.description,
            ingredients: pizza.ingredients,
            cookingTime: pizza.cookingTime,
            spiceLevel: pizza.spiceLevel,
            rating: pizza.rating,
            popularity: pizza.popularity,
            tags: pizza.tags,
            isAvailable: pizza.isAvailable
        });
        setShowEditModal(true);
    };

    // Handle order status update
    const handleOrderStatusUpdate = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.put(`/api/orders/${orderId}/status`, { status }, { headers });
            
            // Refresh orders list
            const response = await axios.get('/api/orders/all', { headers });
            setOrders(response.data.orders);
        } catch (err) {
            console.error('Error updating order status:', err);
            setError(err.response?.data?.message || 'Failed to update order status');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            varients: ['small', 'medium', 'large'],
            prices: [
                { varient: 'small', price: 0 },
                { varient: 'medium', price: 0 },
                { varient: 'large', price: 0 }
            ],
            category: 'Veg',
            image: '',
            description: '',
            ingredients: [''],
            cookingTime: 15,
            spiceLevel: 1,
            rating: 4.0,
            popularity: 80,
            tags: [],
            isAvailable: true
        });
        setFormError('');
    };

    if (loading) return <Loader />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container fluid className="py-3">
            <Row className="mb-4">
                <Col>
                    <h2>Admin Dashboard</h2>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Button 
                        variant={activeTab === 'pizzas' ? 'primary' : 'outline-primary'} 
                        onClick={() => setActiveTab('pizzas')}
                        className="me-2"
                    >
                        Manage Pizzas
                    </Button>
                    <Button 
                        variant={activeTab === 'orders' ? 'primary' : 'outline-primary'} 
                        onClick={() => setActiveTab('orders')}
                        className="me-2"
                    >
                        Manage Orders
                    </Button>
                    <Button 
                        variant={activeTab === 'users' ? 'primary' : 'outline-primary'} 
                        onClick={() => setActiveTab('users')}
                    >
                        Manage Users
                    </Button>
                </Col>
            </Row>

            {/* Pizzas Management */}
            {activeTab === 'pizzas' && (
                <>
                    <Row className="mb-3">
                        <Col>
                            <Button variant="success" onClick={() => setShowAddModal(true)}>
                                Add New Pizza
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price (Small)</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pizzas.map(pizza => (
                                        <tr key={pizza._id}>
                                            <td>{pizza.name}</td>
                                            <td>{pizza.category}</td>
                                            <td>Rs. {pizza.prices[0].price}</td>
                                            <td>
                                                <Badge bg={pizza.isAvailable ? 'success' : 'danger'}>
                                                    {pizza.isAvailable ? 'Available' : 'Not Available'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button 
                                                    variant="info" 
                                                    size="sm" 
                                                    className="me-2"
                                                    onClick={() => handleEdit(pizza)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(pizza._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
            )}

            {/* Orders Management */}
            {activeTab === 'orders' && (
                <Row>
                    <Col>
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id.slice(-6)}</td>
                                        <td>{order.user?.name || 'Guest'}</td>
                                        <td>Rs. {order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <Badge bg={
                                                order.status === 'pending' ? 'warning' :
                                                order.status === 'confirmed' ? 'info' :
                                                order.status === 'preparing' ? 'primary' :
                                                order.status === 'out_for_delivery' ? 'info' :
                                                order.status === 'delivered' ? 'success' :
                                                'danger'
                                            }>
                                                {order.status.replace(/_/g, ' ').toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Form.Select 
                                                size="sm" 
                                                value={order.status}
                                                onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
                <Row>
                    <Col>
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge bg={user.role === 'admin' ? 'danger' : 'info'}>
                                                {user.role.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}

            {/* Add Pizza Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Pizza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {formError && <Alert variant="danger">{formError}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Prices</Form.Label>
                            {formData.prices.map((price, index) => (
                                <div key={price.varient} className="d-flex mb-2">
                                    <Form.Label className="me-2 w-25">{price.varient}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={price.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Form.Control
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                        className="me-2"
                                    />
                                    <Button
                                        variant="danger"
                                        onClick={() => removeIngredientField(index)}
                                        disabled={formData.ingredients.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={addIngredientField}>
                                Add Ingredient
                            </Button>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cooking Time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                name="cookingTime"
                                value={formData.cookingTime}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Spice Level (1-5)</Form.Label>
                            <Form.Control
                                type="number"
                                name="spiceLevel"
                                value={formData.spiceLevel}
                                onChange={handleInputChange}
                                min="1"
                                max="5"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isAvailable"
                                label="Available"
                                checked={formData.isAvailable}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Add Pizza
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Pizza Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Pizza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        {formError && <Alert variant="danger">{formError}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Prices</Form.Label>
                            {formData.prices.map((price, index) => (
                                <div key={price.varient} className="d-flex mb-2">
                                    <Form.Label className="me-2 w-25">{price.varient}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={price.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Form.Control
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                        className="me-2"
                                    />
                                    <Button
                                        variant="danger"
                                        onClick={() => removeIngredientField(index)}
                                        disabled={formData.ingredients.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={addIngredientField}>
                                Add Ingredient
                            </Button>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cooking Time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                name="cookingTime"
                                value={formData.cookingTime}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Spice Level (1-5)</Form.Label>
                            <Form.Control
                                type="number"
                                name="spiceLevel"
                                value={formData.spiceLevel}
                                onChange={handleInputChange}
                                min="1"
                                max="5"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isAvailable"
                                label="Available"
                                checked={formData.isAvailable}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update Pizza
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;