const router = require('express').Router();
const { createOrder, getMyOrders, getOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('user'), createOrder);
router.get('/', authorize('user'), getMyOrders);
router.get('/:id', getOrder);

module.exports = router;
