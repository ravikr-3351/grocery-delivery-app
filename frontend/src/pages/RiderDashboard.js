import { useState, useEffect } from 'react';
import api from '../services/api';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Dashboard.css';

const RiderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/rider/orders');
      setOrders(data.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/rider/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="page-container dashboard">
      <div className="dashboard-header">
        <h2>Delivery Dashboard</h2>
        <p>Welcome, {user?.name}! 🏍️</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card"><div><h3>{orders.length}</h3><p>Total Assigned</p></div></div>
        <div className="stat-card"><div><h3>{orders.filter(o => o.status === 'Shipped').length}</h3><p>In Transit</p></div></div>
        <div className="stat-card"><div><h3>{orders.filter(o => o.status === 'Delivered').length}</h3><p>Delivered</p></div></div>
      </div>

      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <div className="empty-state"><h3>No deliveries assigned</h3><p>Check back later for new assignments</p></div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">Customer: {order.user?.name}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-items">
                {order.items.map((item, i) => <span key={i} className="order-item-tag">{item.name} × {item.quantity}</span>)}
              </div>
              <div className="delivery-address">
                📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
              </div>
              <div className="order-actions">
                {order.status === 'Confirmed' && (
                  <button className="action-btn shipped" onClick={() => updateStatus(order._id, 'Shipped')}>
                    Mark as Shipped
                  </button>
                )}
                {order.status === 'Shipped' && (
                  <button className="action-btn delivered" onClick={() => updateStatus(order._id, 'Delivered')}>
                    Mark as Delivered
                  </button>
                )}
                <span className="order-total">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;
