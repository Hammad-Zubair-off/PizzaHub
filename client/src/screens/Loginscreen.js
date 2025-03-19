import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Loginscreen() {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LoginUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post("/api/auth/login", { email, password });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      console.log("Login Successful, Token:", response.data.token);

      alert("Login Successful!");
      navigate('/');

    } catch (error) {
      console.error("Login error:", error.response?.data?.message || "Something went wrong");
      alert(error.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="container" style={{ backgroundColor: 'transparent' }}>
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">Log In</h5>
              <form onSubmit={LoginUser}> 
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    autoComplete="off"
                    className="form-control"
                    id="floatingPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">
                    Sign in
                  </button>
                </div>
                <hr className="my-4" />
                <div className="d-grid">
                  <b>Don't have an account?  
                    <button className="btn btn-link fw-bold" type="button" onClick={() => navigate("/Registerscreen")}>
                      Register Now
                    </button>
                  </b>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
