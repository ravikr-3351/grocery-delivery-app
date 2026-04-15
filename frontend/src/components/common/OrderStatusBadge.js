/**
 * components/common/OrderStatusBadge.js - Color-coded order status
 */
import './OrderStatusBadge.css';

const OrderStatusBadge = ({ status }) => {
  const statusClass = {
    Pending: 'status-pending',
    Confirmed: 'status-confirmed',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled',
  };

  return (
    <span className={`status-badge ${statusClass[status] || ''}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
