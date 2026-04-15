/**
 * components/common/ProductCard.js - Product display card
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const publicBase = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';
  const toPublicUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('/')) return `${publicBase}${path}`;
    return path;
  };
  const stripPublicBase = (path) => {
    if (publicBase && path.startsWith(publicBase)) return path.slice(publicBase.length);
    return path;
  };
  const [imgSrc, setImgSrc] = useState(toPublicUrl(product?.image) || fallbackImage);
  const [triedAlt, setTriedAlt] = useState(false);

  useEffect(() => {
    setImgSrc(toPublicUrl(product?.image) || fallbackImage);
    setTriedAlt(false);
  }, [product?.image]);

  const handleImageError = () => {
    if (!triedAlt && typeof imgSrc === 'string') {
      const rawSrc = stripPublicBase(imgSrc);
      if (rawSrc.startsWith('/assets/')) {
        setImgSrc(toPublicUrl(rawSrc.replace('/assets/', '/greencarts_assets/')));
        setTriedAlt(true);
        return;
      }
      if (rawSrc.startsWith('/greencarts_assets/')) {
        setImgSrc(toPublicUrl(rawSrc.replace('/greencarts_assets/', '/assets/')));
        setTriedAlt(true);
        return;
      }
    }
    setImgSrc(fallbackImage);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login as customer to add items in cart');
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only customer account can add products to cart');
      return;
    }

    addToCart(product._id);
  };

  const addButtonLabel = !user ? 'Login to Add' : user.role === 'user' ? 'Add' : 'Customer Only';
  const isDisabled = product.stock === 0 || (!!user && user.role !== 'user');

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imgSrc} alt={product?.name || 'Product'} onError={handleImageError} />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isDisabled}
            title={user?.role !== 'user' ? 'Only customer role can place orders' : ''}
          >
            <FiShoppingCart /> {addButtonLabel}
          </button>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="low-stock">Only {product.stock} left!</span>
        )}
        {product.stock === 0 && <span className="out-of-stock">Out of stock</span>}
      </div>
    </div>
  );
};

export default ProductCard;
