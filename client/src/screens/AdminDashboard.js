import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import { fetchPizzas, addPizza, updatePizza, deletePizza } from '../actions/pizzaActions';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pizzas, loading, error } = useSelector(state => state.pizzaReducer);

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

    useEffect(() => {
        dispatch(fetchPizzas());
    }, [dispatch]);

    const handleManageProducts = () => {
        navigate('/admin/products');
    };

    const handleManageOrders = () => {
        navigate('/admin/orders');
    };

    const handleManageUsers = () => {
        navigate('/admin/users');
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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

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

        // Dispatch action to add pizza
        dispatch(addPizza(pizzaData));
        
        // Close modal and reset form
        setShowAddModal(false);
        resetForm();
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

    // Handle update pizza
    const handleUpdate = (e) => {
        e.preventDefault();
        setFormError('');

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

        // Dispatch action to update pizza
        dispatch(updatePizza(currentPizza._id, pizzaData));
        
        // Close modal and reset form
        setShowEditModal(false);
        resetForm();
    };

    // Handle delete pizza
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this pizza?')) {
            dispatch(deletePizza(id));
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
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <Container className="py-5">
            <h2 className="mb-4">Admin Dashboard</h2>
            <Row>
                <Col md={4} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Products</Card.Title>
                            <Card.Text>
                                Manage your pizza menu ({pizzas?.length || 0} pizzas)
                            </Card.Text>
                            <Button variant="primary" onClick={handleManageProducts}>
                                Manage Products
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Orders</Card.Title>
                            <Card.Text>
                                View and manage customer orders
                            </Card.Text>
                            <Button variant="primary" onClick={handleManageOrders}>
                                Manage Orders
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Users</Card.Title>
                            <Card.Text>
                                Manage user accounts and permissions
                            </Card.Text>
                            <Button variant="primary" onClick={handleManageUsers}>
                                Manage Users
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <Loader />
                    ) : (
                        <Card>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="mb-0">Pizzas</h4>
                                    <Button 
                                        variant="success" 
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        Add New Pizza
                                    </Button>
                                </div>
                                <Table responsive striped hover>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
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
                                                <td>
                                                    <img 
                                                        src={pizza.image} 
                                                        alt={pizza.name} 
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                                    />
                                                </td>
                                                <td>{pizza.name}</td>
                                                <td>{pizza.category}</td>
                                                <td>${pizza.prices.find(p => p.varient === 'small')?.price || 0}</td>
                                                <td>
                                                    <span className={`badge ${pizza.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                                                        {pizza.isAvailable ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        className="me-2"
                                                        onClick={() => handleEdit(pizza)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
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
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Add Pizza Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Pizza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Veg">Vegetarian</option>
                                        <option value="Non-Veg">Non-Vegetarian</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image URL *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cooking Time (minutes) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cookingTime"
                                        value={formData.cookingTime}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Spice Level (1-5) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="spiceLevel"
                                        value={formData.spiceLevel}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="5"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Prices *</Form.Label>
                            <Row>
                                {formData.prices.map((price, index) => (
                                    <Col md={4} key={index}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>
                                                {price.varient ? 
                                                    price.varient.charAt(0).toUpperCase() + price.varient.slice(1) : 
                                                    'Price'}
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={price.price}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients *</Form.Label>
                            {formData.ingredients.map((ingredient, index) => (
                                <Row key={index} className="mb-2">
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            placeholder={`Ingredient ${index + 1}`}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => removeIngredientField(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={addIngredientField}
                                className="mt-2"
                            >
                                Add Ingredient
                            </Button>
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

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Add Pizza
                            </Button>
                            <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Pizza Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Pizza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Form onSubmit={handleUpdate}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Veg">Vegetarian</option>
                                        <option value="Non-Veg">Non-Vegetarian</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image URL *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cooking Time (minutes) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cookingTime"
                                        value={formData.cookingTime}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Spice Level (1-5) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="spiceLevel"
                                        value={formData.spiceLevel}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="5"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Prices *</Form.Label>
                            <Row>
                                {formData.prices.map((price, index) => (
                                    <Col md={4} key={index}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>
                                                {price.varient ? 
                                                    price.varient.charAt(0).toUpperCase() + price.varient.slice(1) : 
                                                    'Price'}
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={price.price}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients *</Form.Label>
                            {formData.ingredients.map((ingredient, index) => (
                                <Row key={index} className="mb-2">
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            placeholder={`Ingredient ${index + 1}`}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => removeIngredientField(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={addIngredientField}
                                className="mt-2"
                            >
                                Add Ingredient
                            </Button>
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

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Update Pizza
                            </Button>
                            <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;