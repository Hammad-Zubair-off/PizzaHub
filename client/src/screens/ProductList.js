import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  let navigate = useNavigate();

  // State to store the list of products
  const [products, setProducts] = useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/pizzas/getallpizzas`);
        const data = await response.json();

        // Assuming the API response is an array of products
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Call the fetchProducts function when the component mounts
    fetchProducts();
  }, []);

  // Function to handle product editing
  const handleEdit = (product) => {
    navigate('/edit', { state: { data: product } });
  };

  // Function to navigate to the AddProduct component
  const handleAddProduct = () => {
    navigate('/add');
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      // Get the token from wherever you're storing it after login
      // This might be localStorage, sessionStorage, or a state management solution
      // Make sure to use the same key you used when storing the token
      const token = localStorage.getItem('token'); // Adjust this based on your authentication setup
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        // Optionally redirect to login page
        // navigate('/login');
        return;
      }

      // Make sure to include the 'Bearer ' prefix if your authentication middleware expects it
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      axios.delete(`/api/pizzas/deletepizza/${id}`, {
        headers: {
          'Authorization': authHeader
        }
      })
        .then(response => {
          alert('Product deleted successfully!');
          setProducts(products.filter(product => product._id !== id));
        })
        .catch(error => {
          console.error('Delete error:', error.response?.data || error.message);
          alert(`Error deleting product: ${error.response?.data?.message || error.message}`);
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Product List</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddProduct}>
        Add Product
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{product.name}</td>
              <td>
                <button
                  className="btn btn-danger mr-2"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;