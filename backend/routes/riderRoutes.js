const router = require('express').Router();
const { getAssignedOrders, updateDeliveryStatus } = require('../controllers/riderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('rider'));

router.get('/orders', getAssignedOrders);
router.put('/orders/:id/status', updateDeliveryStatus);

module.exports = router;
