const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    // Hash password with cost of 12 - matching the actual User model
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Admin user details - using your email
    const adminData = {
      name: 'Tejas Admin',
      email: 'tejastk151@gmail.com', // Using your actual email
      password: 'AdminPass@2024',
      role: 'admin',
      isActive: true,
      emailVerified: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      console.log('Updating existing user to admin role and setting new password...');
      
      // Update to admin role and set new password
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.emailVerified = true;
      existingAdmin.password = adminData.password; // This will trigger the hash pre-save hook
      await existingAdmin.save();
      
      console.log('✅ User updated to admin successfully!');
      console.log('');
      console.log('🔑 Admin Login Credentials:');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔒 Password: AdminPass@2024');
      console.log('🔑 Admin Security Code: SMART_ADMIN_2024');
      console.log('');
      console.log('🚀 Try logging in with these credentials now!');
      process.exit(0);
    }

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('📧 Email: tejastk151@gmail.com');
    console.log('🔒 Password: AdminPass@2024');
    console.log('🔑 Admin Security Code: SMART_ADMIN_2024');
    console.log('');
    console.log('🚀 You can now login to admin dashboard using these credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
