const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin-only routes
router.post('/', protect, authorize('admin'), upload.single('image'), createProduct);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
