import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import './CartPage.css';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, cartTotal, loading } = useCart();

  if (loading) return <div className="page-container"><p>Loading cart...</p></div>;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="page-container empty-cart">
        <h2>Your cart is empty 🛒</h2>
        <p>Add some fresh groceries!</p>
        <Link to="/" className="shop-btn">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <h2>Shopping Cart ({cart.items.length} items)</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.product?._id || item._id} className="cart-item">
              <img src={item.product?.image} alt={item.product?.name} />
              <div className="cart-item-info">
                <h4>{item.product?.name}</h4>
                <p className="item-price">${item.product?.price?.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}><FiMinus /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}><FiPlus /></button>
              </div>
              <p className="item-total">${(item.product?.price * item.quantity).toFixed(2)}</p>
              <button className="remove-btn" onClick={() => removeItem(item.product?._id)}><FiTrash2 /></button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>$2.99</span></div>
          <div className="summary-row total"><span>Total</span><span>${(cartTotal + 2.99).toFixed(2)}</span></div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
