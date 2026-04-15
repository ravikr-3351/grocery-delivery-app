/**
 * controllers/sellerProductController.js - Seller product management
 */

const Product = require('../models/Product');
const Seller = require('../models/Seller');

// Add Product by Seller
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, offerPrice, category, stock, image } = req.body;

    // Validate required fields
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const seller = await Seller.findById(req.user.id);

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      offerPrice: offerPrice || null,
      category,
      stock,
      image: image || 'https://via.placeholder.com/300x300?text=No+Image',
      seller: req.user.id,
      sellerName: seller.shopName,
      isAvailable: stock > 0,
    });

    // Update seller's products count
    seller.productsCount = (seller.productsCount || 0) + 1;
    await seller.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product by Seller
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, offerPrice, category, stock, image } = req.body;

    // Check if product exists and belongs to seller
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only update your own products' });
    }

    // Update product fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (offerPrice !== undefined) product.offerPrice = offerPrice;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image) product.image = image;

    product.isAvailable = stock > 0;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product by Seller
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only delete your own products' });
    }

    await Product.findByIdAndDelete(productId);

    // Update seller's products count
    const seller = await Seller.findById(req.user.id);
    seller.productsCount = Math.max(0, (seller.productsCount || 1) - 1);
    await seller.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product by Seller
exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate('seller', 'shopName email');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only view your own products' });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product Stock
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ success: false, message: 'Stock quantity is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    product.stock = stock;
    product.isAvailable = stock > 0;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
