import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AuthPages.css';

const SellerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, address: { ...formData.address, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/seller/register', formData);
      if (response.data.success) {
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('sellerInfo', JSON.stringify(response.data.seller));
        toast.success('Seller account created successfully!');
        navigate('/seller/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Seller registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Seller Registration</h2>
        <p className="auth-subtitle">Create your seller account and start adding products.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Seller Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>
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
              placeholder="At least 6 characters"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Your contact number"
            />
          </div>
          <div className="form-group">
            <label>Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
              placeholder="Your shop name"
            />
          </div>
          <h3 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>Shop Address</h3>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              placeholder="Street address"
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              placeholder="City"
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              required
              placeholder="State"
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              required
              placeholder="Zip code"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating seller...' : 'Create Seller Account'}
          </button>
        </form>
        <p className="auth-link">
          Already registered? <Link to="/seller/login">Login as Seller</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
