const express = require('express');
const {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  logout,
  verifyEmailOTP,
  resendEmailOTP,
  completeRegistration,
  forgotPassword,
  resetPassword,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/verify-email-otp', verifyEmailOTP);
router.post('/resend-email-otp', resendEmailOTP);
router.post('/complete-registration', completeRegistration);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

// Address management routes
router.get('/addresses', getUserAddresses);
router.post('/addresses', addUserAddress);
router.put('/addresses/:id', updateUserAddress);
router.delete('/addresses/:id', deleteUserAddress);
router.put('/addresses/:id/default', setDefaultAddress);

module.exports = router;
