import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
const AddProduct = () => {
  // State variables for form fields
  const [productName, setProductName] = useState('');
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [prices, setPrices] = useState([{ small: 0, medium: 0, large: 0 }]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');

  // Function to handle form submission
  const navigate=useNavigate()
  
  
  const getPriceForVariant = (variant) => {
    const priceObject = prices.find((price) => price[variant]);
    return priceObject ? priceObject[variant] : 0;
  };
  const handleVariantChange = (e) => {
    setSelectedVariants((prevSelectedVariants) => {
      // Use Set to ensure unique values, convert to array
      const uniqueVariants = Array.from(new Set([...prevSelectedVariants, ...Array.from(e.target.selectedOptions, (option) => option.value)]));
      return uniqueVariants;
    });
  };
  
  // Handler function for price change
  const handlePriceChange = (variant, value) => {
    const newPrices = [...prices];
    const priceIndex = newPrices.findIndex((price) => price.hasOwnProperty(variant));
    
    if (priceIndex !== -1) {
      // Variant already exists, update its value
      newPrices[priceIndex][variant] = value;
    } else {
      // Variant doesn't exist, add a new entry
      newPrices.push({ [variant]: value });
    }
  
    setPrices(newPrices);
  };

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>
      <form >
        {/* Product Name */}
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/* Variants */}
        <div className="mb-3">
  <label>Variants</label>
  <select
    multiple
    className="form-control"
    onChange={handleVariantChange}
    value={selectedVariants}
   
  >
    <option value="small">Small</option>
    <option value="medium">Medium</option>
    <option value="large">Large</option>
    
  </select>
</div>

        {/* Prices */}
        <div className="mb-3">
  <label>Prices</label>
  {selectedVariants.map((variant, index) => (
    <div key={index}>
      <label>Price for {variant}</label>
      <input
        type="number"
        className="form-control"
        value={getPriceForVariant(variant)}
        onChange={(e) => handlePriceChange(variant, +e.target.value)}
      />
    </div>
  ))}
</div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            className="form-control"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
            <option value="category4">Category 4</option>
          </select>
        </div>

        {/* Product Image */}
        <div className="mb-3">
          <label htmlFor="productImage" className="form-label">
            Product Image URL
          </label>
          <input
            type="text"
            className="form-control"
            id="productImage"
            value={productImage}
            onChange={(e) => setProductImage(e.target.value)}
          />
        </div>

        {/* Product Description */}
        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">
            Product Description
          </label>
          <textarea
            className="form-control"
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn" onClick={async (e)=>{
 
 e.preventDefault();

 // Prepare the product data

 const data = {
    name: productName,
    variants: selectedVariants,
    prices: prices,
    category: selectedCategory,
    image: productImage,
    description: productDescription,
  };
 

 try {
   // Make a POST request using Axios
   const id="65b4e54929464fb0dc547ab1"
   const response = await axios.post(`/api/pizzas/addpizza`, data);

   // Handle the response as needed
   console.log('Product updated successfully:', response.data);
   alert('Product updated successfully')
   navigate('/productList')
 } catch (error) {
   console.error('Error updating product:', error);
 }
        }}>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
