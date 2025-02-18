import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
const ProductList = () => {
  let navigate=useNavigate();

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

  // Function to handle product deletion
  const handleDelete = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  // Function to handle product editing (you can implement a separate EditProduct component)
  const handleEdit = (product) => {
    // Implement edit logic, for example, navigate to an edit page with the product details
   
    navigate('/edit', { state: { data: product } });
    
  };

  // Function to navigate to the AddProduct component
  const handleAddProduct = (product) => {
    navigate('/add');
  };


  const handleDelet = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      axios.delete(`/api/pizzas/deletepizza/${id}`)
        .then(response => {
          // Handle success response
          alert('Product deleted successfully. Kindly reload the page to see results.');
          // Optionally, you can perform additional actions such as updating state
        })
        .catch(error => {
          // Handle error response
          alert('Error deleting product');
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
            <tr key={product.id}>
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
                  onClick={() => handleDelet(product._id)}
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
