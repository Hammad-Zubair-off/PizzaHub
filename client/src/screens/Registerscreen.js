import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registerscreen() {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const handleInputs = (e) => {
    const { name, value } = e.target; // ✅ Correct way to get name and value
    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault(); // ✅ Prevent default form submission

    const { name, email, password, cpassword } = user;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, cpassword }),
      });

      const data = await res.json(); // ✅ Await response JSON

      if (res.status === 422) {
        alert('Email already exists');
      } else if (res.status === 423) {
        alert('Credentials did not match');
      } else {
        alert('Registration Successful!');
        navigate('/Loginscreen');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container" style={{ backgroundColor: 'transparent' }}>
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Register Yourself
              </h5>
              <form onSubmit={PostData}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="floatingInput"
                    placeholder="Name"
                    value={user.name}
                    onChange={handleInputs}
                    required
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="floatingInput"
                    placeholder="name@example.com"
                    value={user.email}
                    onChange={handleInputs}
                    required
                  />
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleInputs}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="cpassword"
                    className="form-control"
                    id="floatingPasswordConfirm"
                    placeholder="Confirm Password"
                    value={user.cpassword}
                    onChange={handleInputs}
                    required
                  />
                  <label htmlFor="cpassword">Confirm Password</label>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">
                    Register
                  </button>
                </div>
                <hr className="my-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
