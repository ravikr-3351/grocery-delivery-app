import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AuthPages.css';

const SellerLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/seller/login', formData);
      if (response.data.success) {
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('sellerInfo', JSON.stringify(response.data.seller));
        toast.success('Welcome back, seller!');
        navigate('/seller/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Seller login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Seller Login</h2>
        <p className="auth-subtitle">Access your seller dashboard and manage products.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seller@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Seller'}
          </button>
        </form>

        <p className="auth-link">
          New seller? <Link to="/seller/register">Create your seller account</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLoginPage;
