/**
 * pages/HomePage.js - Products listing with search and filter
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { FiSearch } from 'react-icons/fi';
import './HomePage.css';

const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Meat', 'Frozen', 'Household'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Fresh Groceries,<br />Delivered Fast 🚀</h1>
        <p>Shop from hundreds of fresh products and get them delivered to your doorstep</p>
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="categories-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? 'active' : ''}`}
            onClick={() => { setCategory(cat); setPage(1); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>Try a different search or category</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {pagination.totalPages}</span>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
