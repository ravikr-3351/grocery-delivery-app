/**
 * controllers/sellerController.js - Seller authentication and management
 */

const Seller = require('../models/Seller');
const Product = require('../models/Product');
const generateToken = require('../utils/generateToken');

// Register Seller
exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !shopName || !address) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: 'Seller already exists with this email' });
    }

    // Create new seller
    const seller = await Seller.create({
      name,
      email,
      password,
      phone,
      shopName,
      address,
    });

    const token = generateToken(seller._id);

    res.status(201).json({
      success: true,
      message: 'Seller registered successfully',
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const seller = await Seller.findOne({ email }).select('+password');

    if (!seller) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await seller.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(seller._id);

    res.status(200).json({
      success: true,
      message: 'Seller logged in successfully',
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        phone: seller.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id);

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    const productCount = await Product.countDocuments({ seller: seller._id });

    res.status(200).json({
      success: true,
      seller: {
        ...seller._doc,
        productsCount: productCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Seller Profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const { name, phone, shopName, address } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.user.id,
      { name, phone, shopName, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Seller profile updated successfully',
      seller,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Seller's Products
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Seller Dashboard Stats
exports.getSellerStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ seller: req.user.id });
    const outOfStock = await Product.countDocuments({ seller: req.user.id, stock: 0 });
    const seller = await Seller.findById(req.user.id);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        outOfStock,
        inStock: totalProducts - outOfStock,
        rating: seller.rating,
        joinedDate: seller.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
