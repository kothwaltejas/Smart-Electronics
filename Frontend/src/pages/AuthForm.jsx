import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress, 
  Grid, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Facebook, Google, LinkedIn } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthProvider';
import axios from '@api/axios';

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    otp: '',
    adminCode: '',
    address: {
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  // Reset form when switching modes
  const toggleMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
    setError('');
    setOtpSent(false);
    setOtpVerified(false);
    setActiveStep(0);
    setForm({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      otp: '',
      adminCode: '',
      address: {
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      }
    });
    
    // Navigate to appropriate route without causing re-render conflicts
    // navigate(newIsLogin ? '/login' : '/register', { replace: true });
  };

  // Set initial mode based on current route
  useEffect(() => {
    const isRegisterRoute = location.pathname === '/register';
    setIsLogin(!isRegisterRoute);
  }, []);

  // Login Handler
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }

    if (isAdminMode && !form.adminCode) {
      setError('Admin security code is required');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = isAdminMode 
      ? await login(form.email, form.password, true, form.adminCode)
      : await login(form.email, form.password);
    
    setLoading(false);
    
    if (result.success) {
      if (isAdminMode) {
        navigate('/admin'); // Navigate to admin dashboard
      } else {
        navigate('/');
      }
    } else {
      // Check if backend says this user requires admin login
      if (result.requiresAdminLogin) {
        setIsAdminMode(true);
        setError('Admin account detected. Please enter your admin security code below.');
      } else {
        setError(result.error || 'Login failed');
      }
    }
  };

  // Registration - Send OTP (Step 1)
  const handleSendOtp = async () => {
    if (!form.email || !form.password || !form.name) {
      setError('Name, email and password are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/register', {
        email: form.email,
        password: form.password
      });
      
      if (response.data.success) {
        setOtpSent(true);
        setActiveStep(1);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Registration - Verify OTP (Step 2)
  const handleVerifyOtp = async () => {
    if (!form.otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/verify-email-otp', {
        email: form.email,
        otp: form.otp
      });
      
      if (response.data.success) {
        if (response.data.requiresProfileCompletion) {
          setOtpVerified(true);
          setActiveStep(2);
        } else {
          // User already exists, auto-login
          const loginResult = await login(form.email, form.password);
          if (loginResult.success) {
            navigate('/');
          } else {
            setError('Registration complete but login failed');
          }
        }
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Registration - Complete Profile (Step 3)
  const handleCompleteRegistration = async () => {
    if (!form.name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/complete-registration', {
        email: form.email,
        name: form.name,
        phone: form.phone,
        address: form.address
      });
      
      if (response.data.success) {
        // Set success step first
        setActiveStep(3);
        
        // Then login the user automatically using AuthContext
        setTimeout(async () => {
          const loginResult = await login(form.email, form.password);
          if (loginResult.success) {
            navigate('/');
          } else {
            setError('Registration complete but login failed');
          }
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to complete registration');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      p: 2
    }}>
      {/* Main Container with Sliding Animation */}
      <Box sx={{ 
        width: '900px',
        height: '600px',
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex'
      }}>
        {/* Left Panel - Welcome/Sign In */}
        <Box 
          sx={{
            width: '50%',
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            transform: isLogin ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
              opacity: 0.3
            }
          }}
        >
          <Box sx={{ textAlign: 'center', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              {isLogin ? 'Welcome Back!' : 'Hello, Friend!'}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.6,
                maxWidth: '280px'
              }}
            >
              {isLogin 
                ? 'To keep connected with us please login with your personal info'
                : 'Enter your personal details and start your journey with us'
              }
            </Typography>
            
            <Button 
              variant="outlined" 
              size="large"
              onClick={toggleMode}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 25,
                borderWidth: 2,
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                  color: '#2196F3',
                  borderColor: 'white',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {isLogin ? 'SIGN UP' : 'SIGN IN'}
            </Button>
          </Box>
        </Box>

        {/* Right Panel - Form */}
        <Box 
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 5,
            position: 'absolute',
            left: isLogin ? '50%' : 0,
            top: 0,
            bottom: 0,
            transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
          }}
        >
          {/* Form Header */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: isAdminMode ? '#f44336' : '#2196F3',
              fontSize: { xs: '1.8rem', md: '2.2rem' }
            }}
          >
            {isLogin ? (isAdminMode ? 'Admin Login' : 'Sign In') : 'Create Account'}
          </Typography>

          {/* Social Login Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <IconButton 
              sx={{ 
                border: '1px solid #ddd',
                width: 45,
                height: 45,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3b5998',
                  color: 'white',
                  borderColor: '#3b5998',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton 
              sx={{ 
                border: '1px solid #ddd',
                width: 45,
                height: 45,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#db4437',
                  color: 'white',
                  borderColor: '#db4437',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Google />
            </IconButton>
            <IconButton 
              sx={{ 
                border: '1px solid #ddd',
                width: 45,
                height: 45,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#0077b5',
                  color: 'white',
                  borderColor: '#0077b5',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <LinkedIn />
            </IconButton>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              mb: 3,
              fontSize: '0.9rem'
            }}
          >
            {isLogin ? (isAdminMode ? 'Admin dashboard access' : 'or use your account') : 'or use your email for registration'}
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                width: '100%',
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          )}

          {/* Registration Progress Indicator */}
          {!isLogin && (
            <Box sx={{ mb: 3, width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {[0, 1, 2].map((step, index) => (
                  <Box
                    key={step}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index <= activeStep ? '#2196F3' : '#e0e0e0',
                      mx: 0.5,
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Box>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  display: 'block',
                  fontSize: '0.8rem'
                }}
              >
                Step {activeStep + 1} of 3
              </Typography>
            </Box>
          )}

          {/* Form Container */}
          <Box sx={{ 
            width: '100%', 
            maxWidth: '320px',
            maxHeight: '420px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#2196F3',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#1976D2',
            }
          }}>
            {/* LOGIN FORM */}
            {isLogin ? (
              <Box
                sx={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'all 0.4s ease'
                }}
              >
                <TextField 
                  fullWidth 
                  placeholder="Email" 
                  type="email"
                  margin="normal" 
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 25,
                      backgroundColor: '#f5f5f5',
                      border: 'none',
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                      '& input': { py: 1.5, px: 2 }
                    }
                  }}
                />
                
                <TextField 
                  fullWidth 
                  placeholder="Password" 
                  type={showPassword ? 'text' : 'password'}
                  margin="normal" 
                  value={form.password} 
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 25,
                      backgroundColor: '#f5f5f5',
                      border: 'none',
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                      '& input': { py: 1.5, px: 2 }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Admin Code Field - Only show in admin mode */}
                {isAdminMode && (
                  <TextField 
                    fullWidth 
                    placeholder="Admin Access Code" 
                    type="password"
                    margin="normal" 
                    value={form.adminCode} 
                    onChange={e => setForm(f => ({ ...f, adminCode: e.target.value }))} 
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 25,
                        backgroundColor: '#fff3e0',
                        border: 'none',
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: '2px solid #f44336' },
                        '& input': { py: 1.5, px: 2 }
                      }
                    }}
                  />
                )}

                <Box sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/forgot-password')}
                    sx={{
                      textTransform: 'none',
                      color: '#666',
                      fontSize: '0.85rem'
                    }}
                  >
                    Forgot your password?
                  </Button>
                </Box>

                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large"
                  onClick={handleLogin}
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    borderRadius: 25,
                    background: isAdminMode 
                      ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                      : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isAdminMode
                        ? 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
                        : 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: isAdminMode
                        ? '0 8px 25px rgba(244, 67, 54, 0.4)'
                        : '0 8px 25px rgba(33, 150, 243, 0.4)'
                    }
                  }} 
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : (isAdminMode ? 'ADMIN LOGIN' : 'SIGN IN')}
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'all 0.4s ease'
                }}
              >
                {/* STEP 1: Basic Info */}
                {activeStep === 0 && (
                  <Box sx={{ width: '100%' }}>
                    <TextField 
                      fullWidth 
                      placeholder="Name" 
                      margin="normal" 
                      value={form.name} 
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.5, px: 2 }
                        }
                      }}
                    />
                    
                    <TextField 
                      fullWidth 
                      placeholder="Email" 
                      type="email"
                      margin="normal" 
                      value={form.email} 
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.5, px: 2 }
                        }
                      }}
                    />
                    
                    <TextField 
                      fullWidth 
                      placeholder="Password" 
                      type={showPassword ? 'text' : 'password'}
                      margin="normal" 
                      value={form.password} 
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.5, px: 2 }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <TextField 
                      fullWidth 
                      placeholder="Confirm Password" 
                      type="password"
                      margin="normal" 
                      value={form.confirmPassword} 
                      onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.5, px: 2 }
                        }
                      }}
                    />

                    <Button 
                      fullWidth 
                      variant="contained" 
                      size="large"
                      onClick={handleSendOtp}
                      disabled={loading}
                      sx={{ 
                        mt: 3,
                        py: 1.5,
                        borderRadius: 25,
                        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)'
                        }
                      }} 
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'SIGN UP'}
                    </Button>
                  </Box>
                )}

                {/* STEP 2: Email Verification */}
                {activeStep === 1 && (
                  <Box>
                    <Box 
                      sx={{ 
                        mb: 3, 
                        p: 3, 
                        backgroundColor: '#e3f2fd', 
                        borderRadius: 3,
                        textAlign: 'center',
                        border: '1px solid #2196F3'
                      }}
                    >
                      <Typography variant="body1" sx={{ color: '#1565C0', fontWeight: 600 }}>
                        📧 Verification code sent to
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 500 }}>
                        {form.email}
                      </Typography>
                    </Box>

                    <TextField 
                      fullWidth 
                      placeholder="Enter OTP" 
                      margin="normal" 
                      value={form.otp} 
                      onChange={e => setForm(f => ({ ...f, otp: e.target.value }))}
                      inputProps={{ maxLength: 6 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#e3f2fd',
                          fontSize: '1.2rem',
                          textAlign: 'center',
                          letterSpacing: '0.2em',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.5, px: 2, textAlign: 'center' }
                        }
                      }}
                    />

                    <Button 
                      fullWidth 
                      variant="contained" 
                      size="large"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      sx={{ 
                        mt: 3,
                        py: 1.5,
                        borderRadius: 25,
                        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)'
                        }
                      }} 
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'VERIFY & CONTINUE'}
                    </Button>
                  </Box>
                )}

                {/* STEP 3: Profile Completion */}
                {activeStep === 2 && (
                  <Box>
                    <Box 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        backgroundColor: '#e8f5e8', 
                        borderRadius: 3,
                        textAlign: 'center',
                        border: '1px solid #4caf50'
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                        ✅ Email verified! Complete your profile
                      </Typography>
                    </Box>

                    <TextField 
                      fullWidth 
                      placeholder="Phone Number (optional)" 
                      margin="dense" 
                      value={form.phone} 
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.2, px: 2 }
                        }
                      }}
                    />

                    <TextField 
                      fullWidth 
                      placeholder="Address (optional)" 
                      margin="dense" 
                      value={form.address.landmark} 
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        address: { ...f.address, landmark: e.target.value }
                      }))} 
                      multiline
                      rows={1}
                      sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 15,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& textarea': { py: 1.2, px: 2 }
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1 }}>
                      <TextField 
                        fullWidth 
                        placeholder="City" 
                        margin="dense" 
                        value={form.address.city} 
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          address: { ...f.address, city: e.target.value }
                        }))} 
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 25,
                            backgroundColor: '#f5f5f5',
                            border: 'none',
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                            '& input': { py: 1.2, px: 2 }
                          }
                        }}
                      />
                      <TextField 
                        fullWidth 
                        placeholder="State" 
                        margin="dense" 
                        value={form.address.state} 
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          address: { ...f.address, state: e.target.value }
                        }))} 
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 25,
                            backgroundColor: '#f5f5f5',
                            border: 'none',
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                            '& input': { py: 1.2, px: 2 }
                          }
                        }}
                      />
                    </Box>

                    <TextField 
                      fullWidth 
                      placeholder="Pincode" 
                      margin="dense" 
                      value={form.address.pincode} 
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        address: { ...f.address, pincode: e.target.value }
                      }))} 
                      inputProps={{ maxLength: 6 }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 25,
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: '2px solid #2196F3' },
                          '& input': { py: 1.2, px: 2 }
                        }
                      }}
                    />

                    <Button 
                      fullWidth 
                      variant="contained" 
                      size="large"
                      onClick={handleCompleteRegistration}
                      disabled={loading}
                      sx={{ 
                        mt: 1,
                        py: 1.5,
                        borderRadius: 25,
                        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)'
                        }
                      }} 
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'CREATE ACCOUNT'}
                    </Button>
                  </Box>
                )}

                {/* STEP 4: Success */}
                {activeStep === 3 && (
                  <Box 
                    textAlign="center" 
                    py={4}
                    sx={{
                      transform: activeStep === 3 ? 'scale(1)' : 'scale(0.9)',
                      opacity: activeStep === 3 ? 1 : 0,
                      transition: 'all 0.5s ease'
                    }}
                  >
                    <Box 
                      sx={{ 
                        fontSize: '4rem', 
                        mb: 2,
                        animation: 'bounce 1s ease-in-out',
                        '@keyframes bounce': {
                          '0%, 100%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-10px)' }
                        }
                      }}
                    >
                      🎉
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#2196F3', 
                        fontWeight: 700,
                        mb: 2
                      }}
                    >
                      Welcome to SmartElectronics!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                      Your account has been created successfully. Redirecting to homepage...
                    </Typography>
                    <CircularProgress size={30} sx={{ color: '#2196F3' }} />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;