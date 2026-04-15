import { useState, useEffect } from 'react';
import api from '../services/api';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  return (
    <div className="page-container dashboard">
      <div className="dashboard-header">
        <h2>My Orders</h2>
        <p>Welcome, {user?.name}!</p>
      </div>

      {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
        <div className="empty-state"><h3>No orders yet</h3><p>Start shopping to see your orders here!</p></div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-items">
                {order.items.map((item, i) => (
                  <span key={i} className="order-item-tag">{item.name} × {item.quantity}</span>
                ))}
              </div>
              <div className="order-footer">
                <span className="order-total">Total: ${order.totalAmount.toFixed(2)}</span>
                {order.rider && <span className="rider-info">🏍️ Rider: {order.rider.name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
