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

// @route   PUT /api/admin/users/:id
// @desc    Update user details
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, phone } = req.body;
    
    console.log(`📝 Admin: Updating user ${userId}...`);
    
    // Remove undefined fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log(`✅ User ${userId} updated successfully`);
    res.json({
      success: true,
      user: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (block/unblock)
router.put('/users/:id/status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    console.log(`🔒 Admin: Updating user ${userId} status to ${status}...`);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status: status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log(`✅ User ${userId} status updated to ${status}`);
    res.json({
      success: true,
      user: user,
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`
    });
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
});

module.exports = router;
