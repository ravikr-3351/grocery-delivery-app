import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    category: 'Fruits',
    stock: '',
    image: '/assets/apple_image.png',
  });
  const navigate = useNavigate();

  const sellerToken = localStorage.getItem('sellerToken');

  useEffect(() => {
    if (!sellerToken) {
      navigate('/seller/login');
    } else {
      fetchDashboardData();
    }
  }, [sellerToken, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${sellerToken}` };

      const [profileRes, productsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/seller/profile', { headers }),
        axios.get('http://localhost:5000/api/seller/products', { headers }),
        axios.get('http://localhost:5000/api/seller/stats', { headers }),
      ]);

      setSeller(profileRes.data.seller);
      setProducts(productsRes.data.products);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${sellerToken}` };
      const response = await axios.post('http://localhost:5000/api/seller/products', formData, { headers });

      if (response.data.success) {
        setProducts([...products, response.data.product]);
        setFormData({
          name: '',
          description: '',
          price: '',
          offerPrice: '',
          category: 'Fruits',
          stock: '',
          image: '/assets/apple_image.png',
        });
        setShowAddProduct(false);
        alert('Product added successfully!');
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const headers = { Authorization: `Bearer ${sellerToken}` };
      const response = await axios.delete(`http://localhost:5000/api/seller/products/${productId}`, { headers });

      if (response.data.success) {
        setProducts(products.filter((p) => p._id !== productId));
        alert('Product deleted successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerInfo');
    navigate('/seller/login');
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Seller Dashboard</h1>
          {seller && (
            <div>
              <p><strong>Shop:</strong> {seller.shopName}</p>
              <p><strong>Email:</strong> {seller.email}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h3>Total Products</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalProducts}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h3>In Stock</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>{stats.inStock}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h3>Out of Stock</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d32f2f' }}>{stats.outOfStock}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h3>Rating</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>⭐ {stats.rating}</p>
          </div>
        </div>
      )}

      {/* Add Product Button */}
      <button
        onClick={() => setShowAddProduct(!showAddProduct)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '1rem',
          fontSize: '1rem',
        }}
      >
        {showAddProduct ? 'Cancel' : '+ Add New Product'}
      </button>

      {/* Add Product Form */}
      {showAddProduct && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '5px', marginBottom: '2rem' }}>
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProductSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleAddProductChange}
                  required
                  placeholder="Enter product name"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleAddProductChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Meat">Meat</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Household">Household</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleAddProductChange}
                  required
                  placeholder="0.00"
                  step="0.01"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label>Offer Price</label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleAddProductChange}
                  placeholder="0.00"
                  step="0.01"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleAddProductChange}
                  required
                  placeholder="0"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label>Image</label>
                <select
                  name="image"
                  value={formData.image}
                  onChange={handleAddProductChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="/assets/apple_image.png">Apple</option>
                  <option value="/assets/banana_image_1.png">Banana</option>
                  <option value="/assets/carrot_image.png">Carrot</option>
                  <option value="/assets/tomato_image.png">Tomato</option>
                  <option value="/assets/potato_image_1.png">Potato</option>
                  <option value="/assets/amul_milk_image.png">Milk</option>
                  <option value="/assets/eggs_image.png">Eggs</option>
                  <option value="/assets/paneer_image.png">Paneer</option>
                  <option value="/assets/brown_bread_image.png">Brown Bread</option>
                  <option value="/assets/coca_cola_image.png">Coca Cola</option>
                  <option value="/assets/maggi_image.png">Maggi</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleAddProductChange}
                placeholder="Enter product description"
                rows="3"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '1rem',
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div>
        <h2>Your Products ({products.length})</h2>
        {products.length === 0 ? (
          <p>You haven't added any products yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {products.map((product) => (
              <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '1rem', backgroundColor: '#fff' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px', marginBottom: '0.5rem' }} />
                <h3>{product.name}</h3>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p style={{ color: product.isAvailable ? '#4caf50' : '#d32f2f' }}>
                  {product.isAvailable ? '✓ Available' : '✗ Out of Stock'}
                </p>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '8px 12px',
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
