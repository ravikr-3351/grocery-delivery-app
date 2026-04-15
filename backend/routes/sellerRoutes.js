/**
 * routes/sellerRoutes.js - Routes for seller operations
 */

const express = require('express');
const router = express.Router();
const { registerSeller, loginSeller, getSellerProfile, updateSellerProfile, getSellerProducts, getSellerStats } = require('../controllers/sellerController');
const { addProduct, updateProduct, deleteProduct, getProduct, updateStock } = require('../controllers/sellerProductController');
const { authenticate } = require('../middleware/sellerAuth');

// Authentication Routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);

// Protected Routes (Require Authentication)
router.get('/profile', authenticate, getSellerProfile);
router.put('/profile', authenticate, updateSellerProfile);
router.get('/stats', authenticate, getSellerStats);
router.get('/products', authenticate, getSellerProducts);

// Product Management Routes
router.post('/products', authenticate, addProduct);
router.get('/products/:productId', authenticate, getProduct);
router.put('/products/:productId', authenticate, updateProduct);
router.delete('/products/:productId', authenticate, deleteProduct);
router.patch('/products/:productId/stock', authenticate, updateStock);

module.exports = router;
