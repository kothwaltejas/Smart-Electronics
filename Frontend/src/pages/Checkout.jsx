import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  LocalShipping,
  Security
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthProvider';
import { useNotification } from '../context/NotificationProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CheckoutContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const StepCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
}));

const OrderSummaryCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'sticky',
  top: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
}));

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const { cartItems, clearCart, validateAndCleanCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [errors, setErrors] = useState({});

  // Calculate totals
  const itemsPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = itemsPrice * 0.18; // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Don't show empty cart notification if we're processing an order
    if (cartItems.length === 0 && !orderProcessing) {
      navigate('/cart');
      showNotification('Your cart is empty', 'info');
      return;
    }
  }, [isAuthenticated, cartItems, navigate, orderProcessing]);

  const validateShippingAddress = () => {
    const newErrors = {};
    
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.pinCode.trim()) newErrors.pinCode = 'Pin code is required';
    if (!/^\d{6}$/.test(shippingAddress.pinCode)) newErrors.pinCode = 'Pin code must be 6 digits';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateShippingAddress()) return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const createOrder = async () => {
    try {
      setOrderLoading(true);
      setOrderProcessing(true);

      // Validate and clean cart items before creating order
      const wasCartCleaned = validateAndCleanCart();
      if (wasCartCleaned) {
        showNotification('Some invalid items were removed from your cart. Please review and try again.', 'warning');
        setOrderLoading(false);
        setOrderProcessing(false);
        return;
      }

      // Check if cart is empty after validation
      if (cartItems.length === 0) {
        showNotification('Your cart is empty. Please add some products to proceed.', 'warning');
        setOrderLoading(false);
        setOrderProcessing(false);
        return;
      }

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      console.log('Creating order with data:', orderData);
      console.log('Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');

      const response = await axios.post('/orders', orderData);
      
      if (response.data.success) {
        const order = response.data.order;
        
        // Show enhanced success message with order details first
        showNotification(`🎉 Order placed successfully! Order #${order.orderNumber}. You can track your order in "Your Orders" section.`, 'success');
        
        // Navigate to order confirmation immediately
        navigate(`/order/${order._id}`);
        
        // Clear cart after navigation to prevent interference with useEffect
        setTimeout(() => {
          clearCart();
        }, 100);
      }

    } catch (error) {
      console.error('Create order error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMessage = 'Error creating order';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setOrderLoading(false);
      setOrderProcessing(false);
    }
  };

  const renderShippingForm = () => (
    <StepCard>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <LocationOn color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Shipping Address
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={shippingAddress.fullName}
              onChange={(e) => handleAddressChange('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={shippingAddress.address}
              onChange={(e) => handleAddressChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={shippingAddress.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State"
              value={shippingAddress.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pin Code"
              value={shippingAddress.pinCode}
              onChange={(e) => handleAddressChange('pinCode', e.target.value)}
              error={!!errors.pinCode}
              helperText={errors.pinCode}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={shippingAddress.phone}
              onChange={(e) => handleAddressChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
        </Grid>
      </CardContent>
    </StepCard>
  );

  const renderPaymentMethod = () => (
    <StepCard>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Payment color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Payment Method
          </Typography>
        </Box>

        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Choose your payment method
          </FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="razorpay"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography>Razorpay (UPI, Card, Net Banking)</Typography>
                  <Chip label="Recommended" color="primary" size="small" />
                </Box>
              }
            />
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label="Cash on Delivery (COD)"
            />
          </RadioGroup>
        </FormControl>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            {paymentMethod === 'razorpay' 
              ? 'You will be redirected to Razorpay for secure payment processing.'
              : 'Pay when your order is delivered. Additional charges may apply.'}
          </Typography>
        </Alert>
      </CardContent>
    </StepCard>
  );

  const renderOrderReview = () => (
    <StepCard>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <CheckCircle color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Review Your Order
          </Typography>
        </Box>

        {/* Shipping Address Review */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fafc' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Shipping Address
          </Typography>
          <Typography variant="body2">
            {shippingAddress.fullName}<br />
            {shippingAddress.address}<br />
            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}<br />
            Phone: {shippingAddress.phone}
          </Typography>
        </Paper>

        {/* Payment Method Review */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fafc' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Payment Method
          </Typography>
          <Typography variant="body2">
            {paymentMethod === 'razorpay' ? 'Razorpay (Online Payment)' : 'Cash on Delivery'}
          </Typography>
        </Paper>

        {/* Order Items */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Order Items ({cartItems.length} items)
        </Typography>
        <List>
          {cartItems.map((item) => (
            <ListItem key={item._id} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar src={item.image} variant="rounded" />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body1" fontWeight={600}>
                ₹{(item.price * item.quantity).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </StepCard>
  );

  const renderOrderSummary = () => (
    <OrderSummaryCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
          Order Summary
        </Typography>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              ₹{itemsPrice.toLocaleString()}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Shipping
            </Typography>
            <Typography variant="body2" sx={{ color: shippingPrice === 0 ? '#10b981' : 'white' }}>
              {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Tax (GST 18%)
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              ₹{taxPrice.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
            Total
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fbbf24' }}>
            ₹{totalPrice.toLocaleString()}
          </Typography>
        </Box>

        {/* Additional Info */}
        <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocalShipping sx={{ fontSize: 18 }} />
            <Typography variant="body2">Free Delivery on orders above ₹1000</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Security sx={{ fontSize: 18 }} />
            <Typography variant="body2">Secure Payment</Typography>
          </Box>
        </Box>
      </CardContent>
    </OrderSummaryCard>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderOrderReview();
      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <CheckoutContainer>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/cart')}
            sx={{
              mb: 3,
              color: '#64748b',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent', color: '#475569' }
            }}
          >
            Back to Cart
          </Button>
          
          <Typography variant="h3" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
            Checkout
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Complete your order in just a few steps
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Side - Checkout Steps */}
          <Grid item xs={12} lg={8}>
            {getStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ textTransform: 'none' }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={createOrder}
                  disabled={orderLoading}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  {orderLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Grid>

          {/* Right Side - Order Summary */}
          <Grid item xs={12} lg={4}>
            {renderOrderSummary()}
          </Grid>
        </Grid>
      </Container>
    </CheckoutContainer>
  );
};

export default Checkout;
