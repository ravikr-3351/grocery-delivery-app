/**
 * controllers/orderController.js - Order management
 */

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const mongoose = require('mongoose');
const { getAutoAssignedRider, backfillUnassignedOrders } = require('../utils/orderAssignment');

// @desc    Create order from cart
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod = 'COD' } = req.body;
    await backfillUnassignedOrders(20);

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Build order items and calculate total
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      };
    });

    const assignedRider = await getAutoAssignedRider();

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      rider: assignedRider?._id || null,
      status: assignedRider ? 'Confirmed' : 'Pending',
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    await order.populate('rider', 'name phone');
    res.status(201).json({
      success: true,
      message: assignedRider
        ? `Order placed and assigned to ${order.rider.name}`
        : 'Order placed. No rider available at the moment.',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .populate('rider', 'name phone')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email')
      .populate('rider', 'name phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user can only see their own orders (unless admin/rider)
    if (req.user.role === 'user' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    await backfillUnassignedOrders(100);
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('rider', 'name phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: orders,
      pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), totalItems: total },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('rider', 'name phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign rider to order (Admin)
// @route   PUT /api/admin/orders/:id/assign
exports.assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;

    if (!riderId) {
      return res.status(400).json({ success: false, message: 'riderId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(riderId)) {
      return res.status(400).json({ success: false, message: 'Invalid riderId' });
    }

    const rider = await User.findOne({ _id: riderId, role: 'rider' }).select('_id');
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rider: riderId, status: 'Confirmed' },
      { new: true }
    ).populate('user', 'name email').populate('rider', 'name phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
