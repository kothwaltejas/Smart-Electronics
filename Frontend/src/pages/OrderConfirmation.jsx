import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircleOutline,
  LocalShipping,
  Receipt,
  Home,
  ShoppingBag,
  Phone,
  Email
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthProvider';
import { useNotification } from '../context/NotificationProvider';
import axios from '../api/axios';

const OrderContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const SuccessCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const OrderCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
}));

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrder();
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/orders/${id}`);
      
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      setError(error.response?.data?.message || 'Error fetching order details');
      showNotification('Error loading order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusSteps = () => {
    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentStep = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1
    }[order?.orderStatus] || 0;

    return { steps, currentStep };
  };

  if (loading) {
    return (
      <OrderContainer>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Box textAlign="center">
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Loading order details...
              </Typography>
            </Box>
          </Box>
        </Container>
      </OrderContainer>
    );
  }

  if (error || !order) {
    return (
      <OrderContainer>
        <Container maxWidth="md">
          <Box textAlign="center" sx={{ py: 8 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Not Found
              </Typography>
              <Typography variant="body2">
                {error || 'The order you are looking for does not exist or you do not have permission to view it.'}
              </Typography>
            </Alert>
            
            <Button
              variant="contained"
              onClick={() => navigate('/orders')}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                mr: 2
              }}
            >
              View All Orders
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2, px: 4, py: 1.5, textTransform: 'none' }}
            >
              Go to Home
            </Button>
          </Box>
        </Container>
      </OrderContainer>
    );
  }

  const { steps, currentStep } = getStatusSteps();

  return (
    <OrderContainer>
      <Container maxWidth="lg">
        {/* Success Header */}
        <SuccessCard>
          <CardContent sx={{ p: 4 }}>
            <CheckCircleOutline sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Order Placed Successfully!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Order #{order.orderNumber}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Thank you for your order. We'll send you shipping confirmation when your item(s) are on the way!
            </Typography>
          </CardContent>
        </SuccessCard>

        <Grid container spacing={4}>
          {/* Left Column - Order Details */}
          <Grid item xs={12} lg={8}>
            {/* Order Status */}
            <OrderCard>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight={600}>
                    Order Status
                  </Typography>
                  <Chip
                    label={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    color={getStatusColor(order.orderStatus)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {order.orderStatus !== 'cancelled' && (
                  <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                )}

                <Box sx={{ backgroundColor: '#f8fafc', p: 3, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Order placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  {order.isPaid && order.paidAt && (
                    <Typography variant="body2" color="text.secondary">
                      Payment confirmed on {new Date(order.paidAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </OrderCard>

            {/* Order Items */}
            <OrderCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Order Items ({order.orderItems.length} items)
                </Typography>
                
                <List>
                  {order.orderItems.map((item, index) => (
                    <React.Fragment key={item._id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={item.image}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Quantity: {item.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Price: ₹{item.price.toLocaleString()} each
                              </Typography>
                            </Box>
                          }
                          sx={{ ml: 2 }}
                        />
                        <Typography variant="h6" fontWeight={600} color="primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </ListItem>
                      {index < order.orderItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </OrderCard>

            {/* Shipping Address */}
            <OrderCard>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <LocalShipping color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Shipping Address
                  </Typography>
                </Box>

                <Paper sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {order.shippingAddress.fullName}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress.address}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {order.shippingAddress.phone}
                  </Typography>
                </Paper>
              </CardContent>
            </OrderCard>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} lg={4}>
            <OrderCard sx={{ position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Order Summary
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Items Price
                    </Typography>
                    <Typography variant="body2">
                      ₹{order.itemsPrice.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography variant="body2" color={order.shippingPrice === 0 ? 'success.main' : 'text.primary'}>
                      {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Tax (GST 18%)
                    </Typography>
                    <Typography variant="body2">
                      ₹{order.taxPrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight={700}>
                    Total Paid
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    ₹{order.totalPrice.toLocaleString()}
                  </Typography>
                </Box>

                {/* Payment Status */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Status
                  </Typography>
                  <Chip
                    label={order.isPaid ? 'Paid' : 'Pending'}
                    color={order.isPaid ? 'success' : 'warning'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Payment Method */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body2">
                    {order.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/orders')}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    View All Orders
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/products')}
                    sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                  >
                    Continue Shopping
                  </Button>
                </Box>
              </CardContent>
            </OrderCard>
          </Grid>
        </Grid>
      </Container>
    </OrderContainer>
  );
};

export default OrderConfirmation;
