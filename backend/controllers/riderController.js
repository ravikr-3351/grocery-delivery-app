/**
 * controllers/riderController.js - Rider delivery operations
 */

const Order = require('../models/Order');
const { backfillUnassignedOrders } = require('../utils/orderAssignment');

// @desc    Get rider's assigned orders
// @route   GET /api/rider/orders
exports.getAssignedOrders = async (req, res) => {
  try {
    await backfillUnassignedOrders(50);
    const orders = await Order.find({ rider: req.user._id })
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update delivery status
// @route   PUT /api/rider/orders/:id/status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Shipped', 'Delivered'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Allowed: Shipped, Delivered' });
    }

    const order = await Order.findOne({ _id: req.params.id, rider: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not assigned to you' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
