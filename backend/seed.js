/**
 * seed.js - Populate database with sample data
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  // Fruits
  { name: 'Fresh Apples', description: 'Crispy red apples, 1kg pack', price: 3.99, category: 'Fruits', stock: 50, image: '/assets/apple_image.png' },
  { name: 'Organic Bananas', description: 'Ripe yellow bananas, bunch of 6', price: 2.49, category: 'Fruits', stock: 40, image: '/assets/banana_image_1.png' },
  { name: 'Fresh Mangoes', description: 'Juicy ripe mangoes, 1kg', price: 4.99, category: 'Fruits', stock: 35, image: '/assets/mango_image_1.png' },
  { name: 'Grapes', description: 'Sweet green grapes, 500g', price: 3.49, category: 'Fruits', stock: 38, image: '/assets/grapes_image_1.png' },
  { name: 'Fresh Oranges', description: 'Vitamin C rich oranges, 1kg', price: 3.79, category: 'Fruits', stock: 42, image: '/assets/orange_image.png' },

  // Vegetables
  { name: 'Fresh Carrots', description: 'Orange carrots, 500g pack', price: 1.49, category: 'Vegetables', stock: 55, image: '/assets/carrot_image.png' },
  { name: 'Onions', description: 'Golden onions, 1kg pack', price: 0.99, category: 'Vegetables', stock: 60, image: '/assets/onion_image_1.png' },
  { name: 'Potatoes', description: 'Fresh potatoes, 1kg pack', price: 1.29, category: 'Vegetables', stock: 65, image: '/assets/potato_image_1.png' },
  { name: 'Premium Potatoes', description: 'Premium quality potatoes, 2kg', price: 2.49, category: 'Vegetables', stock: 50, image: '/assets/potato_image_2.png' },
  { name: 'Sweet Potatoes', description: 'Organic sweet potatoes, 1kg', price: 2.99, category: 'Vegetables', stock: 35, image: '/assets/potato_image_3.png' },
  { name: 'Russet Potatoes', description: 'Russet potatoes for baking, 2kg', price: 2.79, category: 'Vegetables', stock: 45, image: '/assets/potato_image_4.png' },
  { name: 'Fresh Tomatoes', description: 'Vine-ripened tomatoes, 500g', price: 2.29, category: 'Vegetables', stock: 40, image: '/assets/tomato_image.png' },
  { name: 'Cherry Tomatoes', description: 'Sweet cherry tomatoes, 250g pack', price: 2.79, category: 'Vegetables', stock: 35, image: '/assets/tomato_image_2.png' },
  { name: 'Baby Spinach', description: 'Fresh baby spinach leaves, 200g', price: 2.99, category: 'Vegetables', stock: 30, image: '/assets/spinach_image_1.png' },
  { name: 'Organic Vegetables', description: 'Organic mixed vegetables, 1kg', price: 3.99, category: 'Vegetables', stock: 25, image: '/assets/organic_vegitable_image.png' },

  // Dairy
  { name: 'Amul Milk', description: 'Full cream milk, 1 liter', price: 1.99, category: 'Dairy', stock: 60, image: '/assets/amul_milk_image.png' },
  { name: 'Cheese', description: 'Premium cheddar cheese, 200g', price: 4.29, category: 'Dairy', stock: 25, image: '/assets/cheese_image.png' },
  { name: 'Eggs', description: 'Fresh eggs, dozen pack', price: 3.49, category: 'Dairy', stock: 45, image: '/assets/eggs_image.png' },
  { name: 'Paneer', description: 'Fresh paneer cheese, 200g', price: 2.99, category: 'Dairy', stock: 38, image: '/assets/paneer_image.png' },
  { name: 'Premium Paneer', description: 'Premium paneer, 500g', price: 6.99, category: 'Dairy', stock: 20, image: '/assets/paneer_image_2.png' },
  { name: 'Greek Yogurt', description: 'Plain Greek yogurt, 500g', price: 3.29, category: 'Dairy', stock: 40, image: '/assets/yogurt_image_1.png' },
  { name: 'Butter Croissant', description: 'Buttery croissants, 4 pack', price: 3.99, category: 'Dairy', stock: 30, image: '/assets/butter_croissant_image.png' },

  // Bakery
  { name: 'Brown Bread', description: 'Whole wheat brown bread, 400g', price: 2.49, category: 'Bakery', stock: 35, image: '/assets/brown_bread_image.png' },
  { name: 'Chocolate Cake', description: 'Fresh chocolate cake, 500g', price: 5.99, category: 'Bakery', stock: 20, image: '/assets/chocolate_cake_image.png' },
  { name: 'Vanilla Muffins', description: 'Delicious vanilla muffins, 6 pack', price: 4.49, category: 'Bakery', stock: 25, image: '/assets/vanilla_muffins_image.png' },

  // Beverages
  { name: 'Coca Cola', description: 'Coca Cola, 1.5 liter', price: 2.49, category: 'Beverages', stock: 50, image: '/assets/coca_cola_image.png' },
  { name: 'Fanta', description: 'Fanta Orange, 1 liter', price: 1.99, category: 'Beverages', stock: 45, image: '/assets/fanta_image_1.png' },
  { name: 'Pepsi', description: 'Pepsi Cola, 1.5 liter', price: 2.49, category: 'Beverages', stock: 48, image: '/assets/pepsi_image.png' },
  { name: 'Pepsi Black', description: 'Pepsi Black, 1 liter', price: 2.29, category: 'Beverages', stock: 40, image: '/assets/pepsi_image_2.png' },
  { name: 'Seven Up', description: 'Seven Up Lemon-Lime, 1 liter', price: 1.99, category: 'Beverages', stock: 42, image: '/assets/seven_up_image_1.png' },
  { name: 'Sprite', description: 'Sprite, 1.5 liter', price: 2.49, category: 'Beverages', stock: 50, image: '/assets/sprite_image_1.png' },

  // Snacks
  { name: 'Knorr Soup', description: 'Instant soup, 3 pack', price: 1.99, category: 'Snacks', stock: 40, image: '/assets/knorr_soup_image.png' },
  { name: 'Maggi Noodles', description: 'Instant noodles, 6 pack', price: 2.49, category: 'Snacks', stock: 60, image: '/assets/maggi_image.png' },
  { name: 'Maggi Oats', description: 'Instant oats, 500g', price: 3.99, category: 'Snacks', stock: 35, image: '/assets/maggi_oats_image.png' },
  { name: 'Yippee Noodles', description: 'Yippee instant noodles, 6 pack', price: 2.29, category: 'Snacks', stock: 50, image: '/assets/yippee_image.png' },
  { name: 'Top Ramen', description: 'Top Ramen noodles, 5 pack', price: 1.99, category: 'Snacks', stock: 55, image: '/assets/top_ramen_image.png' },

  // Grains & Flour
  { name: 'Basmati Rice', description: 'Premium basmati rice, 1kg', price: 4.99, category: 'Other', stock: 40, image: '/assets/basmati_rice_image.png' },
  { name: 'Brown Rice', description: 'Whole grain brown rice, 1kg', price: 3.49, category: 'Other', stock: 35, image: '/assets/brown_rice_image.png' },
  { name: 'Barley', description: 'Pearl barley, 500g', price: 2.29, category: 'Other', stock: 25, image: '/assets/barley_image.png' },
  { name: 'Wheat Flour', description: 'Whole wheat flour, 1kg', price: 1.99, category: 'Other', stock: 50, image: '/assets/wheat_flour_image.png' },
  { name: 'Quinoa', description: 'Organic quinoa, 500g', price: 5.99, category: 'Other', stock: 20, image: '/assets/quinoa_image.png' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    await User.create({ name: 'Admin User', email: 'admin@grocery.com', password: 'admin123', role: 'admin' });
    // Create sample rider
    await User.create({ name: 'John Rider', email: 'rider@grocery.com', password: 'rider123', role: 'rider', phone: '555-0101' });
    // Create sample customer
    await User.create({ name: 'Jane Customer', email: 'user@grocery.com', password: 'user123', role: 'user' });

    // Create products
    await Product.insertMany(sampleProducts);

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin: admin@grocery.com / admin123');
    console.log('📧 Rider: rider@grocery.com / rider123');
    console.log('📧 User:  user@grocery.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
