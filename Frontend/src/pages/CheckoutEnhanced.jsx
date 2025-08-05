import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  LocalShipping,
  Security,
  ExpandMore,
  CreditCard,
  AccountBalanceWallet,
  MonetizationOn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthProvider';
import { useNotification } from '../context/NotificationProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AddressSelector from '../components/checkout/AddressSelector';

const CheckoutContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const StepCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  background: theme.palette.background.paper,
}));

const OrderSummaryCard = styled(Card)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(10),
  boxShadow: theme.shadows[4],
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
}));

const PaymentOption = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  background: selected ? theme.palette.primary.main + '08' : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-1px)',
  },
}));

const CheckoutEnhanced = () => {
  const { cartItems, clearCart, validateAndCleanCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Address and payment states
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const steps = ['Delivery Address', 'Payment Method', 'Review & Place Order'];

  // Pricing calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
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

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedAddress) {
        showNotification('Please select a delivery address', 'warning');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const createOrder = async () => {
    try {
      setOrderLoading(true);
      setOrderProcessing(true);

      // Validate cart
      const wasCartCleaned = validateAndCleanCart();
      if (wasCartCleaned) {
        showNotification('Some invalid items were removed from your cart. Please review and try again.', 'warning');
        setOrderLoading(false);
        setOrderProcessing(false);
        return;
      }

      if (cartItems.length === 0) {
        showNotification('Your cart is empty. Please add some products to proceed.', 'warning');
        setOrderLoading(false);
        setOrderProcessing(false);
        return;
      }

      if (!selectedAddress) {
        showNotification('Please select a delivery address', 'warning');
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
        shippingAddress: selectedAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      console.log('Creating order with data:', orderData);

      const response = await axios.post('/orders', orderData);
      
      if (response.data.success) {
        const order = response.data.order;
        
        // Show success notification first
        showNotification(`🎉 Order placed successfully! Order #${order.orderNumber}. You can track your order in "Your Orders" section.`, 'success');
        
        // Navigate immediately
        navigate(`/order/${order._id}`);
        
        // Clear cart after navigation
        setTimeout(() => {
          clearCart();
        }, 100);
      }

    } catch (error) {
      console.error('Create order error:', error);
      
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

  const renderAddressStep = () => (
    <StepCard>
      <CardContent sx={{ p: 4 }}>
        <AddressSelector
          selectedAddress={selectedAddress}
          onAddressSelect={setSelectedAddress}
        />
      </CardContent>
    </StepCard>
  );

  const renderPaymentStep = () => (
    <StepCard>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Payment color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Choose Payment Method
          </Typography>
        </Box>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Grid container spacing={2}>
              {/* Cash on Delivery */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  value="cod"
                  control={<Radio sx={{ display: 'none' }} />}
                  label=""
                  sx={{ m: 0, width: '100%' }}
                />
                <PaymentOption 
                  selected={paymentMethod === 'cod'}
                  onClick={() => setPaymentMethod('cod')}
                  sx={{ p: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MonetizationOn 
                      sx={{ 
                        fontSize: 32, 
                        color: paymentMethod === 'cod' ? 'primary.main' : 'text.secondary' 
                      }} 
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Cash on Delivery
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay when your order arrives
                      </Typography>
                      <Chip label="Recommended" size="small" color="success" variant="outlined" sx={{ mt: 1 }} />
                    </Box>
                  </Box>
                </PaymentOption>
              </Grid>

              {/* Online Payment */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  value="razorpay"
                  control={<Radio sx={{ display: 'none' }} />}
                  label=""
                  sx={{ m: 0, width: '100%' }}
                />
                <PaymentOption 
                  selected={paymentMethod === 'razorpay'}
                  onClick={() => setPaymentMethod('razorpay')}
                  sx={{ p: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CreditCard 
                      sx={{ 
                        fontSize: 32, 
                        color: paymentMethod === 'razorpay' ? 'primary.main' : 'text.secondary' 
                      }} 
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Online Payment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Credit/Debit Card, UPI, Net Banking
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        <Chip label="Secure" size="small" color="primary" variant="outlined" />
                        <Chip label="Instant" size="small" color="info" variant="outlined" />
                      </Box>
                    </Box>
                  </Box>
                </PaymentOption>
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>

        {/* Payment Security Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Security color="success" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={600}>
              Secure Payment
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            All transactions are secured with 256-bit SSL encryption. Your payment information is never stored on our servers.
          </Typography>
        </Box>
      </CardContent>
    </StepCard>
  );

  const renderReviewStep = () => (
    <StepCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Review Your Order
        </Typography>

        {/* Address Review */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Delivery Address
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {selectedAddress && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {selectedAddress.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAddress.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {selectedAddress.phone}
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Payment Method Review */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Payment color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Payment Method
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Order Items Review */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Order Items ({cartItems.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item._id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      src={item.image} 
                      alt={item.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Qty: ${item.quantity}`}
                    sx={{ ml: 2 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </StepCard>
  );

  const renderOrderSummary = () => (
    <OrderSummaryCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Order Summary
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Items ({cartItems.length})</Typography>
            <Typography variant="body2">₹{itemsPrice.toLocaleString()}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Shipping</Typography>
            <Typography variant="body2" color={shippingPrice === 0 ? "success.main" : "text.primary"}>
              {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Tax (18% GST)</Typography>
            <Typography variant="body2">₹{taxPrice.toLocaleString()}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Total</Typography>
          <Typography variant="h6" fontWeight={600} color="primary">
            ₹{totalPrice.toLocaleString()}
          </Typography>
        </Box>

        {shippingPrice === 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            You're getting FREE shipping!
          </Alert>
        )}

        {itemsPrice < 500 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Add ₹{(500 - itemsPrice).toLocaleString()} more for FREE shipping
          </Alert>
        )}
      </CardContent>
    </OrderSummaryCard>
  );

  return (
    <CheckoutContainer>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/cart')}
            sx={{ mb: 2 }}
          >
            Back to Cart
          </Button>
          
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Checkout
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Review your order and complete your purchase
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

        {/* Main Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            {activeStep === 0 && renderAddressStep()}
            {activeStep === 1 && renderPaymentStep()}
            {activeStep === 2 && renderReviewStep()}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ borderRadius: 2 }}
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
                      Processing...
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

          <Grid item xs={12} lg={4}>
            {renderOrderSummary()}
          </Grid>
        </Grid>
      </Container>
    </CheckoutContainer>
  );
};

export default CheckoutEnhanced;
