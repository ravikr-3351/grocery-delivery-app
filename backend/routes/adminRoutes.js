const router = require('express').Router();
const { getAllOrders, updateOrderStatus, assignRider } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

router.use(protect, authorize('admin'));

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/assign', assignRider);

// Get all riders (for assignment dropdown)
router.get('/riders', async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('name email phone');
    res.json({ success: true, data: riders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const [totalOrders, totalProducts, totalUsers, totalRiders, revenue] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'rider' }),
      Order.aggregate([{ $match: { status: 'Delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);
    res.json({
      success: true,
      data: { totalOrders, totalProducts, totalUsers, totalRiders, totalRevenue: revenue[0]?.total || 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
