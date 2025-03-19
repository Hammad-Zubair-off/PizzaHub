import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  // State for admin name and password
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/login', {
        username: adminName,
        password: password,
      });

      if (response.data.success) {
        alert('Login Successful!');
        navigate('/productList');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <form onSubmit={handleLogin}>
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
                required
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
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
