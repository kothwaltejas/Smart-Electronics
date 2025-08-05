import React, { useState } from 'react';
import {
  Box, Container, Paper, TextField, Button, Typography, Alert, CircularProgress, 
  Stepper, Step, StepLabel, Grid, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '@api/axios';

const steps = ['Verify Email', 'Basic Info', 'Complete'];

const RegisterTwoStep = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    name: '',
    phone: '',
    address: {
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!form.email || !form.password) {
      setError('Email and password are required');
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
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send OTP');
    } finally { 
      setLoading(false); 
    }
  };

  // Step 1: Verify OTP
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
          setActiveStep(1);
        } else {
          // User was already complete, redirect to home
          navigate('/');
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

  // Step 2: Complete registration
  const handleComplete = async (e) => {
    e.preventDefault(); 
    
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
        setActiveStep(2);
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Left Panel - Welcome/Branding */}
      <Box 
        sx={{ 
          flex: 1,
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 50%, #388e3c 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          display: { xs: 'none', md: 'flex' } // Hide on mobile
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Content */}
        <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
          {/* Logo/Brand */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                fontSize: '2.5rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                mb: 1
              }}
            >
              SmartElectronics
            </Typography>
            <Box 
              sx={{ 
                width: 60, 
                height: 4, 
                background: 'rgba(255,255,255,0.8)', 
                mx: 'auto',
                borderRadius: 2
              }} 
            />
          </Box>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              fontSize: '2.2rem',
              mb: 2,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            Welcome Back!
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              mb: 4,
              opacity: 0.9,
              maxWidth: 300,
              lineHeight: 1.6
            }}
          >
            To keep connected with us please login with your personal info
          </Typography>
          
          {/* Sign In Button */}
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.7)',
              borderWidth: 2,
              borderRadius: 25,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }
            }}
          >
            SIGN IN
          </Button>
        </Box>
      </Box>

      {/* Right Panel - Registration Form */}
      <Box 
        sx={{ 
          flex: 1,
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 4 },
          minWidth: { xs: '100vw', md: 'auto' }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#4caf50',
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Create Account
            </Typography>
            
            {/* Social Login Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <IconButton 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '1px solid #ddd',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Box sx={{ fontSize: '1.2rem' }}>📘</Box>
              </IconButton>
              <IconButton 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '1px solid #ddd',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Box sx={{ fontSize: '1.2rem' }}>🔍</Box>
              </IconButton>
              <IconButton 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '1px solid #ddd',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Box sx={{ fontSize: '1.2rem' }}>💼</Box>
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              or use your email for registration:
            </Typography>
          </Box>
          
          {/* Progress Indicator */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {[1, 2, 3].map((step, index) => (
                <Box
                  key={step}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index <= activeStep ? '#4caf50' : '#e0e0e0',
                    mx: 0.5,
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Step {activeStep + 1} of 3
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Step 1: Email Verification */}
          {activeStep === 0 && (
            <Box>
              <TextField 
                fullWidth 
                label="Name" 
                margin="normal" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                disabled={otpSent}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#4caf50' },
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                  }
                }}
              />
              
              <TextField 
                fullWidth 
                label="Email" 
                type="email"
                margin="normal" 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                disabled={otpSent}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#4caf50' },
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                  }
                }}
              />
              
              <TextField 
                fullWidth 
                label="Password" 
                type={showPassword ? 'text' : 'password'}
                margin="normal" 
                value={form.password} 
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                disabled={otpSent}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#4caf50' },
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={otpSent}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {otpSent && (
                <TextField 
                  fullWidth 
                  label="Enter OTP" 
                  margin="normal" 
                  value={form.otp} 
                  onChange={e => setForm(f => ({ ...f, otp: e.target.value }))}
                  placeholder="6-digit verification code"
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#e8f5e8',
                      '&:hover fieldset': { borderColor: '#4caf50' },
                      '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                    }
                  }}
                />
              )}
              
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 25,
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
                    transform: 'translateY(-1px)'
                  }
                }} 
                onClick={otpSent ? handleVerifyOtp : handleSendOtp} 
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  otpSent ? 'VERIFY & CONTINUE' : 'SEND VERIFICATION'
                )}
              </Button>
              
              {otpSent && (
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    backgroundColor: '#e8f5e8', 
                    borderRadius: 2,
                    border: '1px solid #c8e6c9',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                    📧 Verification code sent to {form.email}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Step 2: Profile Completion */}
          {activeStep === 1 && (
            <Box component="form" onSubmit={handleComplete}>
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  ✅ Email verified! Complete your profile
                </Typography>
              </Box>

              <TextField 
                fullWidth 
                label="Phone Number" 
                margin="normal" 
                value={form.phone} 
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Enter phone number (optional)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#4caf50' },
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                  }
                }}
              />

              <TextField 
                fullWidth 
                label="Address" 
                margin="normal" 
                value={form.address.landmark} 
                onChange={e => setForm(f => ({ 
                  ...f, 
                  address: { ...f.address, landmark: e.target.value }
                }))} 
                placeholder="Street address (optional)"
                multiline
                rows={2}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#4caf50' },
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                  }
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="City" 
                    margin="normal" 
                    value={form.address.city} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      address: { ...f.address, city: e.target.value }
                    }))} 
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#4caf50' },
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="State" 
                    margin="normal" 
                    value={form.address.state} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      address: { ...f.address, state: e.target.value }
                    }))} 
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#4caf50' },
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <TextField 
                fullWidth 
                label="Pincode" 
                margin="normal" 
                value={form.address.pincode} 
                onChange={e => setForm(f => ({ 
                  ...f, 
                  address: { ...f.address, pincode: e.target.value }
                }))} 
                placeholder="6-digit pincode"
                inputProps={{ maxLength: 6 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#4caf50' },
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                  }
                }}
              />

              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                type="submit"
                sx={{ 
                  mt: 3, 
                  py: 1.5,
                  borderRadius: 25,
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
                    transform: 'translateY(-1px)'
                  }
                }} 
                disabled={loading}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Creating account...
                  </Box>
                ) : (
                  'CREATE ACCOUNT'
                )}
              </Button>
            </Box>
          )}

          {/* Step 3: Success */}
          {activeStep === 2 && (
            <Box textAlign="center" py={3}>
              <Box sx={{ fontSize: '3rem', mb: 2 }}>🎉</Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#4caf50', 
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Welcome to SmartElectronics!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Your account has been created successfully. Redirecting to homepage...
              </Typography>
              <CircularProgress size={30} sx={{ color: '#4caf50' }} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterTwoStep;
