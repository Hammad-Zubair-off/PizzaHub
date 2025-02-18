// Import necessary libraries
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'

// Define the AdminPanel component
const Admin = () => {
  // State for admin name and password
  const [adminName, setAdminName] = useState('hammad');
  const [password, setPassword] = useState('123');

  // History object for navigation
  let navigate=useNavigate();

  // Function to handle form submission
  const handleLogin = () => {
    // Check if the provided credentials are correct
    if (adminName === 'hammad' && password === '123') {
      // Navigate to another screen (replace '/dashboard' with your desired route)
      navigate('/productList');
    } else {
      // Show an alert for incorrect password
      alert('Sorry, incorrect password');
    }
  };

  // JSX for the login form
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <form>
            <div className="mb-3">
              <label htmlFor="adminName" className="form-label">
                Admin Name
              </label>
              <input
                type="text"
                className="form-control"
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
