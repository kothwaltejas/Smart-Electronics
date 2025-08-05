require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 Direct Gmail Test');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Gmail connection successful!');
    
    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email with OTP: 123456'
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Send failed:', error.message);
      } else {
        console.log('✅ Email sent successfully!', info.messageId);
      }
    });
  }
});
