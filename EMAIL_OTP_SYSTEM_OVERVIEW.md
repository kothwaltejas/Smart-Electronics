# SmartElectronics - Email OTP Login System Overview

## System Architecture

The SmartElectronics application implements a robust Email OTP (One-Time Password) authentication system with a two-step registration process.

## Backend Implementation

### Core Files:
- **`controllers/authController.js`** - Main authentication logic
- **`services/emailService.js`** - Email sending and OTP generation
- **`models/userModel.js`** - User data structure with OTP fields
- **`routes/authRoutes.js`** - API endpoints
- **`middleware/auth.js`** - Authentication middleware

### Key Features:

#### 1. Two-Step Registration Process
- **Step 1**: Email + Password → Send OTP → Verify OTP
- **Step 2**: Complete profile (Name, Address, Phone) → Account creation

#### 2. OTP Management
- 6-digit OTP generation
- 10-minute expiration
- Console logging for development (when email not configured)
- Resend OTP functionality

#### 3. Email Templates
- Professional HTML email templates
- OTP verification emails
- Welcome emails after registration
- Password reset emails

### API Endpoints:
```
POST /api/auth/register              - Start registration (send OTP)
POST /api/auth/verify-email-otp      - Verify OTP
POST /api/auth/complete-registration - Complete profile
POST /api/auth/resend-email-otp      - Resend OTP
POST /api/auth/login                 - Standard login
POST /api/auth/logout                - Logout
POST /api/auth/forgot-password       - Password reset
```

## Frontend Implementation

### Core Files:
- **`pages/RegisterTwoStep.jsx`** - Two-step registration component
- **`pages/Login.jsx`** - Login component
- **`context/AuthProvider.jsx`** - Authentication context
- **`App.jsx`** - Route configuration

### Registration Flow:
1. User enters email and password
2. System sends OTP to email
3. User enters OTP for verification
4. User completes profile with name and optional details
5. Account is created and user is automatically logged in

## Environment Configuration

Required environment variables in `.env`:

```bash
# Database
MONGO_URI=mongodb://localhost:27017/smartelectronics

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=smartelectronics_secret_key_2025
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password-here

# Frontend
FRONTEND_URL=http://localhost:5173

# Admin
ADMIN_ACCESS_CODE=SMART_ADMIN_2025
```

## Database Schema

### User Model Fields:
```javascript
{
  name: String,
  email: String (required, unique),
  password: String (required, hashed),
  role: String (user/admin),
  phone: String,
  address: Object,
  isEmailVerified: Boolean,
  emailOTP: String,
  emailOTPExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  loginAttempts: Number,
  lockUntil: Date,
  lastLogin: Date,
  isActive: Boolean,
  timestamps: true
}
```

## Security Features

1. **Password Security**
   - BCrypt hashing with salt rounds 12
   - Minimum 8 characters requirement

2. **JWT Security**
   - HttpOnly cookies
   - Secure flag in production
   - SameSite protection
   - 7-day expiration

3. **OTP Security**
   - 10-minute expiration
   - One-time use
   - Secure random generation

4. **Account Protection**
   - Login attempt tracking
   - Account locking mechanism
   - Password reset with tokens

## Development vs Production

### Development Mode:
- OTP logged to console
- Detailed error messages
- Email sending optional

### Production Mode:
- Actual email sending required
- Minimal error exposure
- HTTPS enforcement

## Cleaned Up Files

### Removed Unnecessary Files:
- `Backend/services/emailService.js.backup`
- `Backend/services/emailService-simple.js`
- `Frontend/src/pages/LoginNew.jsx`
- `Frontend/src/pages/RegisterNew.jsx`
- `Frontend/src/pages/Register.jsx`
- `Frontend/src/context/AuthProvider_new.jsx`
- `Frontend/src/pages/AdminDashboard_new.jsx`

### Current Active Files:
- `Backend/services/emailService.js` (main email service)
- `Frontend/src/pages/Login.jsx` (main login)
- `Frontend/src/pages/RegisterTwoStep.jsx` (main registration)
- `Frontend/src/context/AuthProvider.jsx` (main auth context)
- `Frontend/src/pages/AdminDashboard.jsx` (main admin dashboard)

## Testing the System

1. **Start Backend**: `cd Backend && npm start`
2. **Start Frontend**: `cd Frontend && npm run dev`
3. **Register**: Go to `/register` and follow 2-step process
4. **Check Console**: OTP will be logged in backend console for development
5. **Login**: Use registered credentials at `/login`

## Email Setup (Optional for Development)

To enable actual email sending:
1. Create Gmail App Password
2. Update `EMAIL_USER` and `EMAIL_PASS` in `.env`
3. Ensure Gmail 2FA is enabled
4. Use 16-character app password (not regular password)

The system gracefully falls back to console logging when email is not configured, making development seamless.
