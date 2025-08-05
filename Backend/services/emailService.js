const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    try {
      // Check if email credentials are provided
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-16-character-app-password-here') {
        console.log('⚠️  Email credentials not configured - using console mode for development');
        this.transporter = null;
        return;
      }

      // Create transporter for sending emails
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify transporter configuration (don't block startup)
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service configuration error:', error.message);
          console.log('📧 Falling back to console mode for OTP display');
        } else {
          console.log('✅ Email service is ready to send messages');
          console.log(`📧 Configured for: ${process.env.EMAIL_USER}`);
        }
      });
    } catch (error) {
      console.error('❌ EmailService constructor error:', error);
      // Set a dummy transporter to prevent crashes
      this.transporter = null;
    }
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP email
  async sendOTPEmail(email, otp, name = 'User') {
    try {
      // Try to send real email first
      if (this.transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS !== 'your-16-character-app-password-here') {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'SmartElectronics - Email Verification OTP',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">SmartElectronics</h1>
                <p style="color: #e3f2fd; margin: 10px 0 0 0; font-size: 16px;">Your trusted electronics partner</p>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Email Verification</h2>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Hello ${name},<br><br>
                  Thank you for registering with SmartElectronics! Please verify your email with this OTP:
                </p>
                
                <div style="background: #f5f5f5; border: 2px dashed #1976d2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                  <div style="font-size: 32px; font-weight: bold; color: #1976d2; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </div>
                  <p style="color: #888; font-size: 14px; margin: 10px 0 0 0;">This code expires in 10 minutes</p>
                </div>
              </div>
            </div>
          `
        };

        const result = await this.transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully to:', email);
        return { success: true, messageId: result.messageId };
      }
      
      // Fallback: Log to console with clear instructions
      console.log('\n� =======================================');
      console.log('�🔐 OTP FOR REGISTRATION:');
      console.log('📧 Email:', email);
      console.log('🔢 OTP Code:', otp);
      console.log('⏰ Expires in: 10 minutes');
      console.log('📧 =======================================\n');
      console.log('⚠️  EMAIL NOT SENT - Using console for testing');
      console.log('💡 To enable email sending, update EMAIL_PASS in .env file');
      
      return { success: true, messageId: 'console-mode-' + Date.now() };
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      
      // Always show OTP in console if email fails
      console.log('\n📧 =======================================');
      console.log('🔐 OTP FOR REGISTRATION (EMAIL FAILED):');
      console.log('📧 Email:', email);
      console.log('🔢 OTP Code:', otp);
      console.log('📧 =======================================\n');
      
      return { success: false, error: error.message };
    }
  }

  // Send welcome email after successful registration
  async sendWelcomeEmail(email, name) {
    try {
      // For development: Log instead of sending email
      if (process.env.NODE_ENV === 'development') {
        console.log('🎉 [DEVELOPMENT] Welcome email for', name, 'at', email);
        return { success: true, messageId: 'dev-mode-' + Date.now() };
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to SmartElectronics! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to SmartElectronics!</h1>
              <p style="color: #e8f5e8; margin: 10px 0 0 0; font-size: 16px;">Your journey into smart technology begins now</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${name}! 👋</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Congratulations! Your account has been successfully created and verified. We're excited to have you join our community of tech enthusiasts.
              </p>
              
              <div style="background: #f8f9fa; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0;">
                <h3 style="color: #4caf50; margin: 0 0 10px 0; font-size: 18px;">What's Next?</h3>
                <ul style="color: #666; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Explore our wide range of electronic products</li>
                  <li style="margin-bottom: 8px;">Get exclusive deals and early access to new products</li>
                  <li style="margin-bottom: 8px;">Join our newsletter for tech tips and updates</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}" style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Start Shopping Now
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  Need help? Contact us at support@smartelectronics.com
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully to:', email);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken, name = 'User') {
    try {
      // For development: Log instead of sending email
      if (process.env.NODE_ENV === 'development') {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log('🔒 [DEVELOPMENT] Password reset for', name, 'at', email);
        console.log('🔗 [DEVELOPMENT] Reset URL:', resetUrl);
        return { success: true, messageId: 'dev-mode-' + Date.now() };
      }

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'SmartElectronics - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
              <p style="color: #fff3e0; margin: 10px 0 0 0; font-size: 16px;">SmartElectronics Account Security</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${name},<br><br>
                We received a request to reset your password for your SmartElectronics account. If you made this request, click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: #ff9800; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email or contact our support team.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                For security reasons, you can also copy and paste this link into your browser:<br>
                <span style="word-break: break-all; color: #999; font-size: 12px;">${resetUrl}</span>
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  If you need assistance, contact us at support@smartelectronics.com
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully to:', email);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();

// Debug export
console.log('EmailService export check:', typeof module.exports);
console.log('Has generateOTP:', typeof module.exports.generateOTP);
