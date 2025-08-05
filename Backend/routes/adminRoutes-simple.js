const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working!' });
});

// Get all users - no auth for testing
router.get('/users', async (req, res) => {
  try {
    console.log('📋 Admin: Fetching all users...');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get users without password
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalUsers = await User.countDocuments({});
    
    console.log(`📊 Found ${users.length} users out of ${totalUsers} total`);
    
    // If no users found, create a sample admin user for testing
    if (totalUsers === 0) {
      console.log('🔧 No users found, this might be why admin panel is empty');
      return res.json({
        success: true,
        users: [],
        count: 0,
        totalUsers: 0,
        message: 'No users found in database'
      });
    }

    res.json({
      success: true,
      users: users,
      count: users.length,
      totalUsers: totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit)
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders: 0, // Placeholder
        totalRevenue: 0 // Placeholder
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
});

module.exports = router;
