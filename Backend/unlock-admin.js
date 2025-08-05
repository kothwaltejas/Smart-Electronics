const mongoose = require('mongoose');
require('dotenv').config();

// Import the actual User model
const User = require('./models/userModel');

const unlockAdminAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find and unlock the admin account
    const admin = await User.findOne({ email: 'tejastk151@gmail.com', role: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('Current admin status:', {
      email: admin.email,
      role: admin.role,
      isLocked: admin.isLocked,
      loginAttempts: admin.loginAttempts,
      lockUntil: admin.lockUntil
    });

    // Reset login attempts and unlock
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    
    // Mark the field as modified to ensure it saves
    admin.markModified('loginAttempts');
    admin.markModified('lockUntil');
    
    await admin.save();

    console.log('✅ Admin account unlocked successfully!');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('📧 Email: tejastk151@gmail.com');
    console.log('🔒 Password: AdminPass@2024');
    console.log('🔑 Admin Security Code: SMART_ADMIN_2024');
    console.log('');
    console.log('🚀 Try logging in now!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error unlocking admin account:', error.message);
    process.exit(1);
  }
};

unlockAdminAccount();
