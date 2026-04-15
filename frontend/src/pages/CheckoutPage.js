import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartTotal, cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { deliveryAddress: address, paymentMethod: 'COD' });
      const riderName = data?.data?.rider?.name;
      toast.success(
        riderName
          ? `Order placed! Assigned to delivery rider: ${riderName}`
          : 'Order placed! Rider will be assigned shortly.'
      );
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to place order';
      if (err.response?.status === 403) {
        toast.error('Only customer account can place orders. Please login as user.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-container checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="address-form">
          <h3>Delivery Address</h3>
          <div className="form-group">
            <label>Street Address</label>
            <input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required placeholder="123 Main St" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required placeholder="New York" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required placeholder="NY" />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} required placeholder="10001" />
            </div>
          </div>
          <h3>Payment Method</h3>
          <div className="payment-option selected">
            <input type="radio" checked readOnly /> Cash on Delivery (COD)
          </div>
          <div className="order-total">
            <span>Total: <strong>${(cartTotal + 2.99).toFixed(2)}</strong></span>
          </div>
          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

