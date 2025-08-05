import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Stack,
  Divider,
  Chip,
  Paper,
  TextField,
  Badge,
  Fade,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCartOutlined,
  ArrowBack,
  LocalShipping,
  Security,
  CheckCircle
} from '@mui/icons-material';
import { useCart } from '../context/CartProvider';
import { useNotification } from '../context/NotificationProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Modern, clean styled components
const CartContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const CartCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  backdropFilter: 'none',
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
  },
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[50],
  borderRadius: 8,
  border: `1px solid ${theme.palette.grey[200]}`,
  overflow: 'hidden',
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  minWidth: 36,
  height: 36,
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
  },
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'sticky',
  top: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
}));

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processingItem, setProcessingItem] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleQuantityChange = async (item, newQuantity) => {
    setProcessingItem(item._id);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (newQuantity <= 0) {
      removeFromCart(item._id);
      showNotification(`${item.name} removed from cart`, 'info');
    } else {
      updateQuantity(item._id, newQuantity);
      showNotification(`Updated ${item.name} quantity`, 'success');
    }
    
    setProcessingItem(null);
  };

  const handleRemoveItem = async (item) => {
    setProcessingItem(item._id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeFromCart(item._id);
    showNotification(`${item.name} removed from cart`, 'info');
    setProcessingItem(null);
  };

  const handleClearCart = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    clearCart();
    showNotification('Cart cleared successfully', 'success');
    setLoading(false);
  };

  const handleCheckout = async () => {
    setLoading(true);
    
    // Brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Navigate to checkout page
    navigate('/checkout');
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <Container maxWidth="md">
          <Fade in timeout={600}>
            <Box textAlign="center" sx={{ py: { xs: 6, sm: 8 } }}>
              <Box
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                  margin: '0 auto 24px auto',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <ShoppingCartOutlined sx={{ 
                  fontSize: { xs: 50, sm: 60 }, 
                  color: 'white' 
                }} />
              </Box>
              
              <Typography 
                variant="h3" 
                fontWeight={600} 
                gutterBottom 
                sx={{ 
                  color: '#1e293b', 
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Your Cart is Empty
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Looks like you haven't made your choice yet. Browse our amazing products and add them to cart.
              </Typography>
              
              <ModernButton
                size="large"
                onClick={() => navigate('/products')}
                startIcon={<ArrowBack />}
              >
                Continue Shopping
              </ModernButton>
            </Box>
          </Fade>
        </Container>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in timeout={400}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/products')}
              sx={{
                mb: 3,
                color: '#64748b',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'transparent', color: '#475569' }
              }}
            >
              Continue Shopping
            </Button>
            
            <Typography variant="h3" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
              Shopping Cart
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={cartItems.length} color="primary">
                <ShoppingCartOutlined sx={{ color: '#64748b' }} />
              </Badge>
              <Typography variant="h6" color="text.secondary">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </Typography>
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4} justifyContent="center">
          {/* Left Side - Cart Items */}
          <Grid item xs={12} lg={7}>
            <Fade in timeout={600}>
              <CartCard>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={0}>
                    {cartItems.map((item, index) => (
                      <Fade key={item._id} in timeout={600 + index * 100}>
                        <ProductCard>
                          <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3} alignItems="center">
                              {/* Product Image - Fixed Width */}
                              <Grid item xs={12} sm={3}>
                                <Box
                                  sx={{
                                    width: 180,
                                    height: 140,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    backgroundColor: '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    mx: 'auto'
                                  }}
                                >
                                  <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.name}
                                    sx={{
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                      objectFit: 'contain',
                                    }}
                                  />
                                </Box>
                              </Grid>

                              {/* Product Details - Fixed Width */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                  <Box>
                                    <Typography 
                                      variant="h6" 
                                      fontWeight={600} 
                                      sx={{ 
                                        color: '#1e293b', 
                                        mb: 1, 
                                        lineHeight: 1.3,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                      }}
                                    >
                                      {item.name}
                                    </Typography>
                                    
                                    <Chip
                                      label={item.category}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#e0f2fe',
                                        color: '#0277bd',
                                        fontWeight: 500,
                                        mb: 2
                                      }}
                                    />
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500 }}>
                                        In Stock
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <LocalShipping sx={{ fontSize: 16, color: '#6366f1' }} />
                                      <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 500 }}>
                                        Free Delivery
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                      lineHeight: 1.4,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical'
                                    }}
                                  >
                                    {item.description}
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Quantity & Price - Fixed Width */}
                              <Grid item xs={12} sm={3}>
                                <Box sx={{ height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" fontWeight={700} sx={{ color: '#059669', mb: 0.5 }}>
                                      ₹{(item.price * item.quantity).toLocaleString()}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary">
                                      ₹{item.price?.toLocaleString()} × {item.quantity}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <QuantityControl>
                                      <QuantityButton
                                        size="small"
                                        disabled={processingItem === item._id}
                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                      >
                                        {processingItem === item._id ? (
                                          <CircularProgress size={16} />
                                        ) : (
                                          <Remove fontSize="small" />
                                        )}
                                      </QuantityButton>
                                      
                                      <Typography
                                        sx={{
                                          minWidth: 40,
                                          textAlign: 'center',
                                          fontWeight: 600,
                                          py: 1,
                                          opacity: processingItem === item._id ? 0.6 : 1
                                        }}
                                      >
                                        {item.quantity}
                                      </Typography>
                                      
                                      <QuantityButton
                                        size="small"
                                        disabled={processingItem === item._id}
                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                      >
                                        {processingItem === item._id ? (
                                          <CircularProgress size={16} />
                                        ) : (
                                          <Add fontSize="small" />
                                        )}
                                      </QuantityButton>
                                    </QuantityControl>

                                    <IconButton
                                      disabled={processingItem === item._id}
                                      onClick={() => handleRemoveItem(item)}
                                      sx={{
                                        color: '#ef4444',
                                        opacity: processingItem === item._id ? 0.6 : 1,
                                        '&:hover': {
                                          backgroundColor: '#fef2f2',
                                          color: '#dc2626'
                                        },
                                        '&:disabled': {
                                          color: '#ef4444'
                                        }
                                      }}
                                    >
                                      {processingItem === item._id ? (
                                        <CircularProgress size={20} color="inherit" />
                                      ) : (
                                        <Delete />
                                      )}
                                    </IconButton>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </ProductCard>
                      </Fade>
                    ))}
                  </Stack>
                </CardContent>
              </CartCard>
            </Fade>
          </Grid>

          {/* Right Side - Order Summary - Centered */}
          <Grid item xs={12} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Fade in timeout={800}>
                <SummaryCard>
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
                  Order Summary
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                      ₹{subtotal.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Shipping
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      sx={{ color: shipping === 0 ? '#10b981' : 'white' }}
                    >
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Tax (GST 18%)
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                      ₹{tax.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#fbbf24' }}>
                      ₹{total.toLocaleString()}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    onClick={handleCheckout}
                    sx={{
                      backgroundColor: 'white',
                      color: '#667eea',
                      borderRadius: 2,
                      py: 1.5,
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        transform: loading ? 'none' : 'translateY(-1px)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        color: '#667eea'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: '#667eea' }} />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={loading}
                    onClick={handleClearCart}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:disabled': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Clearing...
                      </>
                    ) : (
                      'Clear Cart'
                    )}
                  </Button>
                </Stack>

                {/* Additional Info */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping sx={{ fontSize: 18 }} />
                      <Typography variant="body2">Free Delivery</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security sx={{ fontSize: 18 }} />
                      <Typography variant="body2">Secure Payment</Typography>
                    </Box>
                  </Stack>
                </Box>
              </SummaryCard>
            </Fade>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </CartContainer>
  );
};

export default Cart;
