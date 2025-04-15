import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import FormInput from '../components/FormInput';

export default function Registerscreen() {
  const navigate = useNavigate();
  const { register, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.cpassword) {
      errors.cpassword = 'Confirm password is required';
    } else if (formData.password !== formData.cpassword) {
      errors.cpassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { name, email, password } = formData;
    const result = await register({ name, email, password });
    
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <AuthForm
      title="Create Account"
      submitText="Register"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkTo="/login"
    >
      <FormInput
        label="Full Name"
                    type="text"
                    name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="John Doe"
                    required
        error={formErrors.name}
      />
      
      <FormInput
        label="Email Address"
                    type="email"
                    name="email"
        value={formData.email}
        onChange={handleChange}
                    placeholder="name@example.com"
                    required
        error={formErrors.email}
      />
      
      <FormInput
        label="Password"
                    type="password"
                    name="password"
        value={formData.password}
        onChange={handleChange}
                    placeholder="Password"
                    required
        error={formErrors.password}
      />
      
      <FormInput
        label="Confirm Password"
                    type="password"
                    name="cpassword"
        value={formData.cpassword}
        onChange={handleChange}
                    placeholder="Confirm Password"
                    required
        error={formErrors.cpassword}
      />
    </AuthForm>
  );
}
