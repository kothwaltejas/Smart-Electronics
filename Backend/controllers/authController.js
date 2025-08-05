const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET || 'smartenterprises_secret_key_2025', 
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'Smart Enterprises',
      audience: 'Smart-Enterprises-Users'
    }
  );
};

// Send token response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);
  
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Update last login
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  res.status(statusCode)
     .cookie('token', token, options)
     .json({
       success: true,
       message,
       token,
       user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         avatar: user.avatar,
         phone: user.phone,
         address: user.address,
         addresses: user.addresses,
         isEmailVerified: user.isEmailVerified,
         isActive: user.isActive,
         lastLogin: user.lastLogin
       }
     });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // If this is a two-step registration (no name provided), just send OTP
    if (!name) {
      // Generate OTP and store temporarily (don't create user yet)
      const otp = emailService.generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store pending registration data in memory or temporary storage
    // For simplicity, we'll use a global pendingRegistrations object
    global.pendingRegistrations = global.pendingRegistrations || {};
    
    // Clean up expired pending registrations
    Object.keys(global.pendingRegistrations).forEach(email => {
      if (global.pendingRegistrations[email].otpExpires < new Date()) {
        delete global.pendingRegistrations[email];
      }
    });
    
    global.pendingRegistrations[email] = {
      email,
      password,
      phone: phone || '',
      otp,
      otpExpires,
      createdAt: new Date()
    };      // Send OTP email
      const emailResult = await emailService.sendOTPEmail(email, otp, 'User');
      
      if (!emailResult.success) {
        // If email fails, remove from pending registrations
        delete global.pendingRegistrations[email];
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP email. Please try again.'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'OTP sent! Please check your email for the verification code.',
        requiresEmailVerification: true,
        email: email
      });
    }

    // Full registration (with name) - original flow
    const otp = emailService.generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      phone,
      emailOTP: otp,
      emailOTPExpires: otpExpires,
      isEmailVerified: false
    });

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, name);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for the OTP verification code.',
      requiresEmailVerification: true,
      userId: user._id,
      email: user.email
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if this is an admin user trying to login without admin code
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin account detected. Please use admin login with security code.',
        requiresAdminLogin: true
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts. Try again later.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Admin login with additional security
// @route   POST /api/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    console.log('🔐 Admin login attempt:', { email: req.body.email, hasPassword: !!req.body.password, hasAdminCode: !!req.body.adminCode });
    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📝 Admin code from request:', JSON.stringify(req.body.adminCode));
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, adminCode } = req.body;

    // First, check if user exists and is actually an admin
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    
    console.log('👤 User found:', { 
      exists: !!user, 
      role: user?.role, 
      isActive: user?.isActive,
      email: user?.email,
      hasPassword: !!user?.password
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin account not found.'
      });
    }

    // Check if account is locked
    console.log('🔒 Lock status check:', {
      isLocked: user.isLocked,
      lockUntil: user.lockUntil,
      currentTime: new Date(),
      loginAttempts: user.loginAttempts
    });
    
    if (user.isLocked) {
      console.log('🔒 Account is locked until:', user.lockUntil);
      return res.status(423).json({
        success: false,
        message: 'Admin account temporarily locked. Contact system administrator.'
      });
    }

    // Check password first
    console.log('🔒 Checking password...');
    console.log('🔒 Password from request:', password);
    console.log('🔒 Expected password: AdminPass@2024');
    const isPasswordCorrect = await user.comparePassword(password);
    console.log('🔒 Password check result:', isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      console.log('❌ Password incorrect, incrementing login attempts');
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    console.log('✅ Password correct, proceeding to admin code check...');

    // Only after valid email/password, check admin code
    console.log('🔑 Checking admin code...');
    const validAdminCode = process.env.ADMIN_ACCESS_CODE || 'SMART_ADMIN_2024';
    console.log('🔑 Expected code:', validAdminCode, 'Length:', validAdminCode.length);
    console.log('🔑 Received code:', adminCode, 'Length:', adminCode?.length);
    console.log('🔑 Codes match (strict):', adminCode === validAdminCode);
    console.log('🔑 Codes match (trimmed):', adminCode?.trim() === validAdminCode?.trim());
    
    if (adminCode !== validAdminCode) {
      console.log('❌ Admin code validation failed!');
      return res.status(403).json({
        success: false,
        message: 'Invalid admin security code'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    console.log('✅ Admin login successful for:', user.email);
    sendTokenResponse(user, 200, res, 'Admin login successful');

  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        addresses: user.addresses,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, phone, address } = req.body;
    
    const updateData = {
      name,
      phone,
      address,
      updatedAt: new Date()
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify email OTP
// @route   POST /api/auth/verify-email-otp
// @access  Public
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Check if this is a pending registration
    global.pendingRegistrations = global.pendingRegistrations || {};
    const pendingRegistration = global.pendingRegistrations[email];

    if (pendingRegistration) {
      // Verify OTP for pending registration
      if (pendingRegistration.otp !== otp || pendingRegistration.otpExpires < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // OTP verified for pending registration - require profile completion
      return res.status(200).json({
        success: true,
        message: 'Email verified! Please complete your registration.',
        requiresProfileCompletion: true,
        email: email
      });
    }

    // Check for existing user (existing user OTP verification)
    const user = await User.findOne({
      email,
      emailOTP: otp,
      emailOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Verify email and clear OTP fields for existing user
    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    // Send welcome email for complete registration
    await emailService.sendWelcomeEmail(user.email, user.name);

    // Send token response (auto-login after verification)
    sendTokenResponse(user, 200, res, 'Email verified successfully! Welcome to Smart Enterprises!');

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Complete registration with user details (step 2)
// @route   POST /api/auth/complete-registration
// @access  Public
exports.completeRegistration = async (req, res) => {
  try {
    const { email, name, address, phone } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    // Get pending registration data
    global.pendingRegistrations = global.pendingRegistrations || {};
    const pendingRegistration = global.pendingRegistrations[email];

    if (!pendingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found for this email'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Clean up pending registration
      delete global.pendingRegistrations[email];
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create the actual user now
    const user = await User.create({
      name,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      phone: phone || pendingRegistration.phone,
      address: address && (address.landmark || address.city || address.state || address.pincode) ? {
        street: address.landmark || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.pincode || '',
        country: 'India'
      } : undefined,
      isEmailVerified: true,
      isActive: true
    });

    // Clean up pending registration
    delete global.pendingRegistrations[email];

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    // Send token response (auto-login after completion)
    sendTokenResponse(user, 200, res, 'Registration completed successfully! Welcome to Smart Enterprises!');

  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration completion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Resend email OTP
// @route   POST /api/auth/resend-email-otp
// @access  Public
exports.resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user with unverified email
    const user = await User.findOne({
      email,
      isEmailVerified: false
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found or email already verified'
      });
    }

    // Generate new OTP
    const otp = emailService.generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.emailOTP = otp;
    user.emailOTPExpires = otpExpires;
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP has been resent to your email address'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await emailService.sendPasswordResetEmail(email, user.name, resetUrl);
    res.json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ success: false, message: 'All fields required' });
    const user = await User.findOne({ email, passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ========================
// ADDRESS MANAGEMENT
// ========================

// @desc    Get user addresses
// @route   GET /api/auth/addresses
// @access  Private
exports.getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    
    res.status(200).json({
      success: true,
      data: user.addresses || []
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add new address
// @route   POST /api/auth/addresses
// @access  Private
exports.addUserAddress = async (req, res) => {
  try {
    const { label, fullName, phone, address, city, state, pinCode, country, isDefault } = req.body;
    
    // Validate required fields
    if (!label || !fullName || !phone || !address || !city || !state || !pinCode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // If this is set as default or it's the first address, unset other defaults
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Add new address
    const newAddress = {
      label,
      fullName,
      phone,
      address,
      city,
      state,
      pinCode,
      country: country || 'India',
      isDefault: isDefault || user.addresses.length === 0 // First address is default
    };
    
    user.addresses.push(newAddress);
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses[user.addresses.length - 1]
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/auth/addresses/:id
// @access  Private
exports.updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If updating to default, unset other defaults
    if (updateData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update address
    Object.assign(user.addresses[addressIndex], updateData);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
exports.deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);
    
    // If deleted address was default, make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/auth/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Unset all defaults
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
    
    // Set this address as default
    user.addresses[addressIndex].isDefault = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
