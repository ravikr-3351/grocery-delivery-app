import { useState, useEffect } from 'react';
import api from '../services/api';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import toast from 'react-hot-toast';
import { FiPackage, FiUsers, FiTruck, FiDollarSign, FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Fruits', stock: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, ridersRes, productsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
        api.get('/admin/riders'),
        api.get('/products?limit=100'),
      ]);
      setStats(statsRes.data.data);
      setOrders(ordersRes.data.data);
      setRiders(ridersRes.data.data);
      setProducts(productsRes.data.data);
    } catch (err) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const assignRider = async (orderId, riderId) => {
    try {
      await api.put(`/admin/orders/${orderId}/assign`, { riderId });
      toast.success('Rider assigned');
      fetchData();
    } catch { toast.error('Failed to assign rider'); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', { ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) });
      toast.success('Product added!');
      setShowAddProduct(false);
      setNewProduct({ name: '', price: '', category: 'Fruits', stock: '', description: '' });
      fetchData();
    } catch (err) { toast.error('Failed to add product'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="page-container"><p>Loading dashboard...</p></div>;

  return (
    <div className="page-container dashboard">
      <h2>Admin Dashboard</h2>

      <div className="tab-nav">
        {['overview', 'orders', 'products'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card"><FiPackage /><div><h3>{stats.totalOrders}</h3><p>Total Orders</p></div></div>
          <div className="stat-card"><FiDollarSign /><div><h3>${stats.totalRevenue?.toFixed(2)}</h3><p>Revenue</p></div></div>
          <div className="stat-card"><FiUsers /><div><h3>{stats.totalUsers}</h3><p>Customers</p></div></div>
          <div className="stat-card"><FiTruck /><div><h3>{stats.totalRiders}</h3><p>Riders</p></div></div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card admin-order">
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{order.user?.name} — {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-items">
                {order.items.map((item, i) => <span key={i} className="order-item-tag">{item.name} × {item.quantity}</span>)}
              </div>
              <div className="order-actions">
                <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}>
                  {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={order.rider?._id || ''} onChange={(e) => assignRider(order._id, e.target.value)}>
                  <option value="">Assign Rider</option>
                  {riders.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
                <span className="order-total">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <>
          <button className="add-product-btn" onClick={() => setShowAddProduct(!showAddProduct)}>
            <FiPlus /> Add Product
          </button>
          {showAddProduct && (
            <form onSubmit={addProduct} className="add-product-form">
              <input placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              <input placeholder="Price" type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                {['Fruits','Vegetables','Dairy','Bakery','Beverages','Snacks','Meat','Frozen','Household','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
              <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              <button type="submit">Save Product</button>
            </form>
          )}
          <div className="products-table">
            <table>
              <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td><td>{p.category}</td><td>${p.price.toFixed(2)}</td><td>{p.stock}</td>
                    <td><button className="delete-btn" onClick={() => deleteProduct(p._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
