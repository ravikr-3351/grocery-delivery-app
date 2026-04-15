/**
 * components/layout/Navbar.js - Navigation bar with role-based links
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const sellerToken = localStorage.getItem('sellerToken');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSellerLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerInfo');
    navigate('/seller/login');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    const paths = { admin: '/admin', rider: '/rider', user: '/dashboard' };
    return paths[user.role] || '/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">🛒 FreshCart</Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Products</Link>

          {sellerToken ? (
            <>
              <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)}>
                <FiUser /> Seller Dashboard
              </Link>
              <button onClick={handleSellerLogout} className="logout-btn">
                <FiLogOut /> Seller Logout
              </button>
            </>
          ) : user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>
                <FiUser /> {user.name}
              </Link>

              {user.role === 'user' && (
                <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
                  <FiShoppingCart />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              )}

              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="register-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              <Link to="/seller/login" className="register-link" onClick={() => setMenuOpen(false)}>Sell with Us</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
