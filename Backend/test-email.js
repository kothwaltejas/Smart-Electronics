// Test Email Service
require('dotenv').config();
const emailService = require('./services/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Service...\n');
  
  // Check environment variables
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
  console.log('🔑 EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
  console.log('🔑 EMAIL_PASS value:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'undefined');
  
  // Wait a moment for transporter verification
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate test OTP
  const testOTP = emailService.generateOTP();
  console.log('\n🔢 Generated OTP:', testOTP);
  
  // Try to send test email
  try {
    const result = await emailService.sendOTPEmail('test@example.com', testOTP, 'Test User');
    console.log('\n✅ Email service result:', result);
  } catch (error) {
    console.error('\n❌ Email service error:', error.message);
  }
}

testEmail();
