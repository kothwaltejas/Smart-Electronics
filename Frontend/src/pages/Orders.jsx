import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
} from '@mui/material';
import { formatOrderNumber, formatCurrency, formatOrderDate, canCancelOrder } from '../utils/orderUtils';
import axios from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders/myorders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setNotification({ message: 'Error fetching orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, orderNumber) => {
    setOrderToCancel({ id: orderId, number: orderNumber });
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axios.put(`/orders/${orderToCancel.id}/cancel`);
      setNotification({ 
        message: `Order ${formatOrderNumber(orderToCancel.number)} cancelled successfully!`, 
        type: 'success' 
      });
      fetchOrders(); // Refresh the orders list
      setCancelDialogOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      setNotification({ 
        message: error.response?.data?.message || 'Failed to cancel order', 
        type: 'error' 
      });
      setCancelDialogOpen(false);
      setOrderToCancel(null);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return statusColors[status] || 'default';
  };

  const getOrderStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStep = steps.indexOf(status);
    return currentStep === -1 ? -1 : currentStep;
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Centered Header */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 600,
          }}
        >
          My Orders
        </Typography>
      </Box>

      {notification.message && (
        <Alert 
          severity={notification.type} 
          sx={{ mb: 2 }}
          onClose={() => setNotification({ message: '', type: '' })}
        >
          {notification.message}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            No orders found
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Start shopping to see your orders here
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '1200px' }}>
            <Grid container spacing={3} justifyContent="center">
              {/* Mobile View - Centered Cards */}
              <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {orders.map((order) => (
                    <Card key={order._id} sx={{ 
                      width: '100%', 
                      maxWidth: '500px',
                      mx: { xs: 1, sm: 2 },
                    }}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Typography 
                              variant="h6" 
                              component="div"
                              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                            >
                              {formatOrderNumber(order.orderNumber)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              {formatOrderDate(order.createdAt)}
                            </Typography>
                          </Box>
                          <Chip 
                            label={order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Unknown'} 
                            color={getStatusColor(order.orderStatus)}
                            size="small"
                            sx={{ 
                              fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                              height: { xs: '20px', sm: '24px' }
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          fontWeight="bold" 
                          mb={1}
                          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                          {formatCurrency(order.totalPrice)}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          mb={2}
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
                        </Typography>

                        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleViewDetails(order)}
                            sx={{ 
                              fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                              px: { xs: 1, sm: 2 }
                            }}
                          >
                            View Details
                          </Button>
                          {canCancelOrder(order.orderStatus) && (
                            <Button 
                              variant="outlined" 
                              color="error" 
                              size="small"
                              onClick={() => handleCancelOrder(order._id, order.orderNumber)}
                              sx={{ 
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                px: { xs: 1, sm: 2 }
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>

              {/* Desktop View - Centered Table */}
              <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TableContainer component={Paper} sx={{ maxWidth: '1200px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Order</TableCell>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Items</TableCell>
                          <TableCell align="center">Total</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell align="center">
                              <Typography variant="subtitle2">
                                {formatOrderNumber(order.orderNumber)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">{formatOrderDate(order.createdAt)}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Unknown'} 
                                color={getStatusColor(order.orderStatus)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">{order.orderItems?.length || 0}</TableCell>
                            <TableCell align="center">
                              <Typography variant="subtitle2">
                                {formatCurrency(order.totalPrice)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" gap={1} justifyContent="center">
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  View
                                </Button>
                                {canCancelOrder(order.orderStatus) && (
                                  <Button 
                                    variant="outlined" 
                                    color="error" 
                                    size="small"
                                    onClick={() => handleCancelOrder(order._id, order.orderNumber)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Order Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            backdropFilter: 'none',
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }}
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Order Number:</strong> {formatOrderNumber(selectedOrder.orderNumber)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Date:</strong> {formatOrderDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Status:</strong>
                    <Chip 
                      label={selectedOrder.orderStatus?.charAt(0).toUpperCase() + selectedOrder.orderStatus?.slice(1) || 'Unknown'} 
                      color={getStatusColor(selectedOrder.orderStatus)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total:</strong> {formatCurrency(selectedOrder.totalPrice)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Items:</strong> {selectedOrder.orderItems?.length || 0}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {selectedOrder.orderStatus !== 'cancelled' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Order Progress
                  </Typography>
                  <Stepper activeStep={getOrderStep(selectedOrder.orderStatus)} sx={{ mb: 3 }}>
                    <Step>
                      <StepLabel>Order Placed</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Processing</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Shipped</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Delivered</StepLabel>
                    </Step>
                  </Stepper>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderItems?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src={item.image} variant="rounded" />
                            <Typography variant="body2">{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    )) || []}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedOrder && canCancelOrder(selectedOrder.orderStatus) && (
            <Button
              color="error"
              onClick={() => handleCancelOrder(selectedOrder._id, selectedOrder.orderNumber)}
            >
              Cancel Order
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            backdropFilter: 'none',
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          Cancel Order
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order <strong>{orderToCancel ? formatOrderNumber(orderToCancel.number) : ''}</strong>?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Please note:</strong>
              <br />
              • This action cannot be undone
              <br />
              • Your order will be cancelled immediately
              <br />
              • Refund (if applicable) will be processed within 3-5 business days
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Order
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmCancelOrder}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
