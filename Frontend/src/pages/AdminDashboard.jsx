import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Alert,
  Divider,
  Fab,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  LinearProgress,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  TrendingUp,
  Edit,
  Delete,
  Add,
  Visibility,
  Block,
  CheckCircle,
  Warning,
  PersonAdd,
  ProductionQuantityLimits,
  Notifications,
  Settings,
  Analytics,
  Security,
  Speed,
  AccountCircle,
  AdminPanelSettings,
  Timeline,
  Today,
  Refresh,
  Logout,
  CloudUpload,
  PhotoCamera,
  Image,
  Receipt,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '@context/AuthProvider';
import { useNotification } from '@context/NotificationProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
  },
}));

const MetricCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`,
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4), // Increased padding
  height: '180px', // Slightly increased height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  margin: theme.spacing(1), // Add margin between cards
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.1)',
    clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
  },
  // Better spacing for content
  '& .MuiSvgIcon-root': {
    marginBottom: theme.spacing(2),
    zIndex: 2,
    position: 'relative',
  },
  '& .metric-number': {
    zIndex: 2,
    position: 'relative',
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  '& .metric-label': {
    zIndex: 2,
    position: 'relative',
    marginBottom: theme.spacing(0.5),
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  '& .metric-subtitle': {
    zIndex: 2,
    position: 'relative',
    opacity: 0.9,
    fontSize: '0.85rem',
  },
}));

const AdminHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  color: 'white',
  padding: theme.spacing(4, 0),
  borderRadius: theme.spacing(0, 0, 3, 3),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3), // Increased padding
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  minHeight: '120px', // Add minimum height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1), // Add gap between elements
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(33, 150, 243, 0.04)',
  },
  '& .MuiSvgIcon-root': {
    marginBottom: theme.spacing(1),
  },
  '& .MuiTypography-root': {
    fontWeight: '500',
  },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1), // Add padding to the card itself
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateX(4px)',
  },
  '& .activity-time': {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
  },
  '& .MuiCardContent-root': {
    padding: `${theme.spacing(2)} !important`, // Ensure CardContent has proper padding
  },
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`admin-tabpanel-${index}`}
    aria-labelledby={`admin-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Product management state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    features: [],
    downloads: []
  });
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Product form helpers
  const [newFeature, setNewFeature] = useState('');
  const [newDownload, setNewDownload] = useState({
    label: '',
    type: '',
    link: '',
    fileSize: ''
  });

  // User management state
  const [userViewDialogOpen, setUserViewDialogOpen] = useState(false);
  const [userEditDialogOpen, setUserEditDialogOpen] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [userBlockConfirmOpen, setUserBlockConfirmOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  // Order management state
  const [ordersData, setOrdersData] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderViewDialogOpen, setOrderViewDialogOpen] = useState(false);

  // Product view state
  const [productViewDialogOpen, setProductViewDialogOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] = useState(null);

  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AdminDashboard - Auth check:', { isAuthenticated, user, userRole: user?.role, isLoading });
    
    // Don't do anything while still loading
    if (isLoading) {
      return;
    }
    
    if (!isAuthenticated || user?.role !== 'admin') {
      console.log('AdminDashboard - Access denied, redirecting...');
      navigate('/');
      showNotification('Access denied. Admin privileges required.', 'error');
      return;
    }
    console.log('AdminDashboard - Access granted, fetching data...');
    fetchDashboardData();
  }, [isAuthenticated, user, navigate, isLoading]);

  const fetchDashboardData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('Fetching dashboard data...');
      
      // Fetch real data from backend
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get('/products').catch((error) => {
          console.error('Error fetching products:', error);
          return { data: [] };
        }),
        axios.get('/admin/users').catch((error) => {
          console.error('Error fetching users:', error);
          return { data: { users: [] } };
        }),
        axios.get('/orders').catch((error) => {
          console.error('Error fetching orders:', error);
          return { data: { orders: [] } };
        })
      ]);

      console.log('Raw API responses:', { 
        productsRes: productsRes.data, 
        usersRes: usersRes.data,
        ordersRes: ordersRes.data
      });

      const products = Array.isArray(productsRes.data) ? productsRes.data : [];
      const users = Array.isArray(usersRes.data?.users) ? usersRes.data.users : [];
      const ordersFromAPI = Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders : [];
      
      console.log('Processed data:', { 
        products: products.length, 
        users: users.length, 
        orders: ordersFromAPI.length,
        usersData: users,
        productsData: products,
        ordersData: ordersFromAPI
      });
      
      setProducts(products);
      setUsers(users);
      setOrdersData(ordersFromAPI);

      // Calculate real metrics
      const totalRevenue = ordersFromAPI.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrdersCount = ordersFromAPI.filter(order => order.orderStatus === 'pending').length;
      
      const realMetrics = {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: ordersFromAPI.length,
        totalRevenue: totalRevenue.toLocaleString(),
        activeUsers: users.filter(u => u.isActive !== false).length, // Count users where isActive is not false
        pendingOrders: pendingOrdersCount,
        lowStockProducts: products.filter(p => (p.stock || 0) < 10).length,
        monthlyGrowth: 0,
      };

      console.log('Calculated metrics:', realMetrics);

      const mockActivity = [
        {
          id: 1,
          type: 'user_registration',
          description: 'New user registered',
          user: 'john.doe@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          icon: PersonAdd,
          color: '#4caf50'
        },
        {
          id: 2,
          type: 'product_updated',
          description: 'Product inventory updated',
          product: products[0]?.name || 'Smart Switch Pro',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          icon: Inventory,
          color: '#ff9800'
        },
        {
          id: 3,
          type: 'system',
          description: 'System backup completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          icon: Security,
          color: '#9c27b0'
        },
      ];
      
      setMetrics(realMetrics);
      setRecentActivity(mockActivity);
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showNotification('Some dashboard data could not be loaded', 'warning');
      
      // Fallback to mock data
      const fallbackMetrics = {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: '0',
        activeUsers: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        monthlyGrowth: 0,
      };
      setMetrics(fallbackMetrics);
      setRecentActivity([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
    showNotification('Dashboard refreshed successfully', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showNotification('Logged out successfully', 'success');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Product management functions
  const handleAddProduct = async () => {
    try {
      console.log('handleAddProduct called with:', newProduct);
      
      // Check if required fields are present
      if (!newProduct.name || !newProduct.price) {
        showNotification('Please fill in product name and price', 'error');
        return;
      }

      // Validate and clean data before sending
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || '',
        category: newProduct.category || '',
        price: parseFloat(newProduct.price),
        image: newProduct.image?.trim() || '',
        stock: parseInt(newProduct.stock) || 0,
        features: newProduct.features || [],
        downloads: newProduct.downloads || []
      };

      console.log('Sending product data:', productData);

      const response = await axios.post('/products', productData);
      console.log('Product add response:', response.data);
      
      setProducts([...products, response.data]);
      setProductDialogOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: '',
        features: [],
        downloads: []
      });
      setNewFeature('');
      setNewDownload({
        label: '',
        type: '',
        link: '',
        fileSize: ''
      });
      showNotification('Product added successfully!', 'success');
      fetchDashboardData(true);
    } catch (error) {
      console.error('Error adding product:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMessage = 'Unknown error occurred';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(`Error adding product: ${errorMessage}`, 'error');
    }
  };

  const handleEditProduct = async () => {
    try {
      console.log('handleEditProduct called with:', editProduct);
      
      // Check if required fields are present
      if (!editProduct.name || !editProduct.price) {
        showNotification('Please fill in product name and price', 'error');
        return;
      }

      const response = await axios.put(`/products/${editProduct._id}`, editProduct);
      console.log('Product update response:', response.data);
      
      setProducts(Array.isArray(products) ? products.map(p => p._id === editProduct._id ? response.data : p) : []);
      setEditProduct(null);
      showNotification('Product updated successfully!', 'success');
      fetchDashboardData(true);
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error response:', error.response?.data);
      showNotification(`Error updating product: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/products/${productToDelete._id}`);
      setProducts(Array.isArray(products) ? products.filter(p => p._id !== productToDelete._id) : []);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      showNotification('Product deleted successfully!', 'success');
      fetchDashboardData(true);
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error deleting product', 'error');
    }
  };

  // Image upload function
  const handleImageUpload = async (file, isEdit = false) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        
        if (isEdit && editProduct) {
          setEditProduct({...editProduct, image: imageUrl});
        } else {
          setNewProduct({...newProduct, image: imageUrl});
        }
        
        showNotification('Image uploaded successfully!', 'success');
        return imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Error uploading image', 'error');
      return null;
    }
  };

  const handlePdfUpload = async (file, isEdit = false) => {
    try {
      if (!newDownload.label || !newDownload.type) {
        showNotification('Please fill in document label and type first', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post('/upload/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const pdfData = {
          label: newDownload.label,
          url: response.data.data.url, // Cloudinary URL
          directDownloadUrl: response.data.data.directDownloadUrl, // Direct download URL
          backendDownloadUrl: response.data.data.backendDownloadUrl, // Backend endpoint URL
          publicId: response.data.data.publicId,
          originalName: response.data.data.originalName,
          type: newDownload.type,
          fileSize: response.data.data.fileSize,
          uploadedAt: new Date()
        };
        
        if (isEdit && editProduct) {
          const downloads = [...(editProduct.downloads || []), pdfData];
          setEditProduct({...editProduct, downloads});
        } else {
          const downloads = [...newProduct.downloads, pdfData];
          setNewProduct({...newProduct, downloads});
        }
        
        // Reset download form
        setNewDownload({
          label: '',
          type: '',
          link: '',
          fileSize: ''
        });
        
        showNotification('PDF uploaded successfully!', 'success');
        return pdfData;
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      showNotification('Error uploading PDF', 'error');
      return null;
    }
  };

  // User management functions
  const handleViewUser = (user) => {
    setSelectedUserForView(user);
    setUserViewDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUserForEdit({ ...user });
    setUserEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`/admin/users/${selectedUserForEdit._id}`, {
        name: selectedUserForEdit.name,
        email: selectedUserForEdit.email,
        phone: selectedUserForEdit.phone,
        role: selectedUserForEdit.role
      });
      
      setUsers(Array.isArray(users) ? users.map(u => u._id === selectedUserForEdit._id ? response.data.user : u) : []);
      setUserEditDialogOpen(false);
      setSelectedUserForEdit(null);
      showNotification('User updated successfully!', 'success');
      fetchDashboardData(true);
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Error updating user', 'error');
    }
  };

  const handleBlockUser = (user) => {
    setUserToBlock(user);
    setUserBlockConfirmOpen(true);
  };

  const handleConfirmBlockUser = async () => {
    try {
      const newStatus = !userToBlock.isActive;
      await axios.put(`/admin/users/${userToBlock._id}/status`, {
        isActive: newStatus
      });
      
      setUsers(Array.isArray(users) ? users.map(u => u._id === userToBlock._id ? { ...u, isActive: newStatus } : u) : []);
      setUserBlockConfirmOpen(false);
      setUserToBlock(null);
      showNotification(`User ${newStatus ? 'activated' : 'blocked'} successfully!`, 'success');
      fetchDashboardData(true);
    } catch (error) {
      console.error('Error updating user status:', error);
      showNotification('Error updating user status', 'error');
    }
  };

  // Product management functions
  const handleViewProduct = (product) => {
    setSelectedProductForView(product);
    setProductViewDialogOpen(true);
  };

  // Order management functions
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('/orders');
      if (response.data.success) {
        setOrdersData(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Error fetching orders', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus
      });
      
      if (response.data.success) {
        setOrdersData(ordersData.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        ));
        showNotification('Order status updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('Error updating order status', 'error');
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

  const renderOverview = () => (
    <>
      {/* Admin Header */}
      <AdminHeader>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    background: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)' 
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome back, {user?.name || 'Admin'}!
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    SmartElectronics Admin Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                    Last refreshed: {lastRefresh.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={handleRefresh} 
                    disabled={refreshing}
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { background: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                  <IconButton 
                    onClick={handleLogout} 
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { background: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
                <Chip
                  icon={<CheckCircle />}
                  label="System Online"
                  sx={{ 
                    background: 'rgba(76, 175, 80, 0.8)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </AdminHeader>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard color={{ primary: '#4285f4', secondary: '#0d47a1' }}>
            <People sx={{ fontSize: 50 }} />
            <Typography variant="h3" className="metric-number">
              {loading ? '...' : metrics.totalUsers}
            </Typography>
            <Typography variant="body1" className="metric-label">
              Total Users
            </Typography>
            <Typography variant="caption" className="metric-subtitle">
              {metrics.activeUsers} active
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard color={{ primary: '#34a853', secondary: '#1b5e20' }}>
            <Inventory sx={{ fontSize: 50 }} />
            <Typography variant="h3" className="metric-number">
              {loading ? '...' : metrics.totalProducts}
            </Typography>
            <Typography variant="body1" className="metric-label">
              Products
            </Typography>
            <Typography variant="caption" className="metric-subtitle">
              {metrics.lowStockProducts} low stock
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard color={{ primary: '#ea4335', secondary: '#c62828' }}>
            <ShoppingCart sx={{ fontSize: 50 }} />
            <Typography variant="h3" className="metric-number">
              {loading ? '...' : metrics.totalOrders}
            </Typography>
            <Typography variant="body1" className="metric-label">
              Orders
            </Typography>
            <Typography variant="caption" className="metric-subtitle">
              {metrics.pendingOrders} pending
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard color={{ primary: '#fbbc04', secondary: '#f57f17' }}>
            <TrendingUp sx={{ fontSize: 50 }} />
            <Typography variant="h3" className="metric-number">
              ₹{loading ? '...' : (metrics.totalRevenue || '0')}
            </Typography>
            <Typography variant="body1" className="metric-label">
              Revenue
            </Typography>
            <Typography variant="caption" className="metric-subtitle">
              {metrics.monthlyGrowth > 0 ? `+${metrics.monthlyGrowth}%` : 'No data'} this month
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '400px', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Timeline color="primary" />
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ maxHeight: '300px', overflow: 'auto', pr: 1 }}>
                {recentActivity.map((activity) => (
                  <ActivityCard key={activity.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          sx={{ 
                            background: activity.color,
                            width: 40,
                            height: 40
                          }}
                        >
                          <activity.icon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body1" fontWeight="medium">
                            {activity.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.user && `User: ${activity.user}`}
                            {activity.product && `Product: ${activity.product}`}
                            {activity.amount && ` • Amount: ${activity.amount}`}
                          </Typography>
                          <Typography variant="caption" className="activity-time">
                            {activity.timestamp.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </ActivityCard>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Speed color="primary" />
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <QuickActionCard onClick={() => setTabValue(1)}>
                    <PersonAdd color="primary" sx={{ fontSize: 30 }} />
                    <Typography variant="body2">Manage Users</Typography>
                  </QuickActionCard>
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard onClick={() => setTabValue(2)}>
                    <Add color="primary" sx={{ fontSize: 30 }} />
                    <Typography variant="body2">Add Product</Typography>
                  </QuickActionCard>
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard onClick={() => setTabValue(3)}>
                    <Analytics color="primary" sx={{ fontSize: 30 }} />
                    <Typography variant="body2">View Reports</Typography>
                  </QuickActionCard>
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard>
                    <Settings color="primary" sx={{ fontSize: 30 }} />
                    <Typography variant="body2">Settings</Typography>
                  </QuickActionCard>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <Security color="primary" />
                System Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Server Status</Typography>
                  <Chip label="Online" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Database</Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">Last Backup</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Box mt={3}>
                  <Typography variant="body2" gutterBottom>System Load</Typography>
                  <LinearProgress variant="determinate" value={35} sx={{ mb: 1, height: 8, borderRadius: 4 }} />
                  <Typography variant="caption" color="text.secondary">35% - Normal</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const renderUsers = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <People color="primary" />
            User Management
          </Typography>
          <Button startIcon={<Add />} variant="contained" disabled>
            Add User (Coming Soon)
          </Button>
        </Box>
        
        {!Array.isArray(users) || users.length === 0 ? (
          <Box textAlign="center" py={4}>
            <People sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Users Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Users will appear here when they register
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Joined</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(users) && users.map((user) => (
                  <TableRow key={user._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role || 'User'} 
                        size="small" 
                        color={user.role === 'admin' ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isActive ? 'Active' : 'Inactive'} 
                        color={user.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="View User">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => handleViewUser(user)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.isActive ? 'Block User' : 'Activate User'}>
                          <IconButton 
                            size="small" 
                            color={user.isActive ? 'warning' : 'success'}
                            onClick={() => handleBlockUser(user)}
                          >
                            {user.isActive ? <Block /> : <CheckCircle />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderUserDialogs = () => (
    <>
      {/* View User Dialog */}
      <Dialog 
        open={userViewDialogOpen} 
        onClose={() => setUserViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Visibility color="primary" />
            User Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUserForView && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {selectedUserForView.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom align="center">
                    {selectedUserForView.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{selectedUserForView.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{selectedUserForView.phone || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Role:</Typography>
                  <Chip 
                    label={selectedUserForView.role || 'User'} 
                    size="small" 
                    color={selectedUserForView.role === 'admin' ? 'secondary' : 'default'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip 
                    label={selectedUserForView.isActive ? 'Active' : 'Inactive'} 
                    color={selectedUserForView.isActive ? 'success' : 'default'} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Joined:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedUserForView.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
                {selectedUserForView.lastLogin && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Last Login:</Typography>
                    <Typography variant="body1">
                      {new Date(selectedUserForView.lastLogin).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog 
        open={userEditDialogOpen} 
        onClose={() => setUserEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Edit color="primary" />
            Edit User
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUserForEdit && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={selectedUserForEdit.name}
                  onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={selectedUserForEdit.email}
                  onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedUserForEdit.phone || ''}
                  onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, phone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={selectedUserForEdit.role || 'user'}
                    onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, role: e.target.value})}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUserEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            disabled={!selectedUserForEdit?.name || !selectedUserForEdit?.email}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock User Confirmation Dialog */}
      <Dialog
        open={userBlockConfirmOpen}
        onClose={() => setUserBlockConfirmOpen(false)}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" />
            Confirm Action
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {userToBlock?.isActive ? 'block' : 'activate'} user "{userToBlock?.name}"?
            {userToBlock?.isActive && (
              <Box component="span" sx={{ display: 'block', mt: 1, color: 'warning.main' }}>
                Blocking this user will prevent them from accessing the system.
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserBlockConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmBlockUser} 
            color={userToBlock?.isActive ? 'warning' : 'success'}
            variant="contained"
          >
            {userToBlock?.isActive ? 'Block User' : 'Activate User'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const renderProducts = () => {
    return (
      <>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <Inventory color="primary" />
                Product Management
              </Typography>
              <Button 
                startIcon={<Add />} 
                variant="contained"
                onClick={() => setProductDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  borderRadius: 2,
                  px: 3
                }}
              >
                Add Product
              </Button>
            </Box>
            
            {!Array.isArray(products) || products.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Inventory sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Products Available
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Start by adding your first product to the inventory
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setProductDialogOpen(true)}
                >
                  Add First Product
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Price</strong></TableCell>
                      <TableCell><strong>Stock</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(products) && products.map((product) => (
                      <TableRow key={product._id || product.id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar 
                              src={product.image} 
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            >
                              <Inventory />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.description?.substring(0, 50)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.category || 'Electronics'} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            ₹{product.price?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">
                              {product.stock || 0}
                            </Typography>
                            {(product.stock || 0) < 10 && (
                              <Chip 
                                label="Low Stock" 
                                size="small" 
                                color="warning"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                            color={(product.stock || 0) > 0 ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Product">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => setEditProduct(product)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Product">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => {
                                  setProductToDelete(product);
                                  setDeleteConfirmOpen(true);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Add Product Dialog */}
        <Dialog 
          open={productDialogOpen} 
          onClose={() => setProductDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Add color="primary" />
              Add New Product
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <MenuItem value="Smart Switches">Smart Switches</MenuItem>
                    <MenuItem value="Automation">Automation</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                    <MenuItem value="Lighting">Lighting</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  helperText="Enter a valid image URL or upload a file below"
                />
              </Grid>
              
              {/* File Upload Option */}
              <Grid item xs={12}>
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Or upload an image file:
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload-new"
                    type="file"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          showNotification('File size must be less than 5MB', 'error');
                          return;
                        }
                        await handleImageUpload(file, false);
                      }
                    }}
                  />
                  <label htmlFor="image-upload-new">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ mr: 2 }}
                    >
                      Upload Image
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary">
                    Max size: 5MB • Formats: JPG, PNG, WebP
                  </Typography>
                </Box>
              </Grid>
              
              {/* Features Section */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Product Features
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Add key features that make this product unique
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Add Feature"
                    placeholder="e.g., Wi-Fi Enabled, Voice Control, Smart Scheduling"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newFeature.trim()) {
                        const features = [...newProduct.features, newFeature.trim()];
                        setNewProduct({...newProduct, features});
                        setNewFeature('');
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (newFeature.trim()) {
                        const features = [...newProduct.features, newFeature.trim()];
                        setNewProduct({...newProduct, features});
                        setNewFeature('');
                      }
                    }}
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              
              {newProduct.features.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {newProduct.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        onDelete={() => {
                          const features = newProduct.features.filter((_, i) => i !== index);
                          setNewProduct({...newProduct, features});
                        }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Downloads Section */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    User Manuals & Downloads
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Upload PDF manuals, datasheets, and other downloadable resources
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Document Label"
                  placeholder="e.g., User Manual, Installation Guide, Datasheet"
                  value={newDownload.label}
                  onChange={(e) => setNewDownload({...newDownload, label: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={newDownload.type}
                    onChange={(e) => setNewDownload({...newDownload, type: e.target.value})}
                  >
                    <MenuItem value="manual">User Manual</MenuItem>
                    <MenuItem value="datasheet">Datasheet</MenuItem>
                    <MenuItem value="software">Software/Firmware</MenuItem>
                    <MenuItem value="driver">Driver</MenuItem>
                    <MenuItem value="guide">Installation Guide</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="pdf-upload-new"
                    type="file"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          showNotification('PDF file size must be less than 10MB', 'error');
                          return;
                        }
                        await handlePdfUpload(file, false);
                      }
                    }}
                  />
                  <label htmlFor="pdf-upload-new">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      disabled={!newDownload.label || !newDownload.type}
                    >
                      Upload PDF
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary">
                    Max size: 10MB • Format: PDF only
                  </Typography>
                </Box>
              </Grid>
              
              {newProduct.downloads.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Uploaded Documents:
                    </Typography>
                    {newProduct.downloads.map((download, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {download.label} ({download.type})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {download.fileSize}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            const downloads = newProduct.downloads.filter((_, i) => i !== index);
                            setNewProduct({...newProduct, downloads});
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Debug Info (Remove this in production) */}
              <Grid item xs={12}>
                <Box sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1, fontSize: '12px' }}>
                  <Typography variant="caption" color="text.secondary">
                    Debug: Name: "{newProduct.name}" | Price: "{newProduct.price}" | Features: {newProduct.features.length} | Downloads: {newProduct.downloads.length} | Button Enabled: {newProduct.name && newProduct.price ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Image Preview */}
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Image Preview:
                </Typography>
                {newProduct.image ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={newProduct.image} 
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    >
                      <Inventory sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="success.main">
                        ✓ Image loaded successfully
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Image will be displayed like this in the product list
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      variant="rounded"
                      sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}
                    >
                      <Inventory sx={{ fontSize: 30, color: 'grey.500' }} />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      No image URL provided - default icon will be shown
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              {/* Helpful Tips */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mt: 1 }}>
                  <Typography variant="subtitle2" color="info.contrastText" gutterBottom>
                    💡 Image URL Tips:
                  </Typography>
                  <Typography variant="caption" color="info.contrastText" component="div">
                    • Use free sources: Unsplash, Pexels, or product manufacturer websites<br/>
                    • Recommended size: 500x500px or larger<br/>
                    • Supported formats: JPG, PNG, WebP<br/>
                    • Example: https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('Add Product button clicked!', { newProduct });
                handleAddProduct();
              }} 
              variant="contained"
              disabled={!newProduct.name || !newProduct.price}
            >
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog 
          open={!!editProduct} 
          onClose={() => setEditProduct(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Edit color="primary" />
              Edit Product
            </Box>
          </DialogTitle>
          <DialogContent>
            {editProduct && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={editProduct.category || ''}
                      onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                    >
                      <MenuItem value="Smart Switches">Smart Switches</MenuItem>
                      <MenuItem value="Automation">Automation</MenuItem>
                      <MenuItem value="Security">Security</MenuItem>
                      <MenuItem value="Lighting">Lighting</MenuItem>
                      <MenuItem value="General">General</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={editProduct.description || ''}
                    onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Price (₹)"
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={editProduct.stock || 0}
                    onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={editProduct.image || ''}
                    onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    helperText="Enter a valid image URL or upload a file below"
                  />
                </Grid>
                
                {/* File Upload Option for Edit */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Or upload a new image file:
                    </Typography>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload-edit"
                      type="file"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            showNotification('File size must be less than 5MB', 'error');
                            return;
                          }
                          await handleImageUpload(file, true);
                        }
                      }}
                    />
                    <label htmlFor="image-upload-edit">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        sx={{ mr: 2 }}
                      >
                        Upload New Image
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary">
                      Max size: 5MB • Formats: JPG, PNG, WebP
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Image Preview for Edit */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Image Preview:
                  </Typography>
                  {editProduct.image ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        src={editProduct.image} 
                        variant="rounded"
                        sx={{ width: 80, height: 80 }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      >
                        <Inventory sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="success.main">
                          ✓ Image loaded successfully
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Updated image preview
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        variant="rounded"
                        sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}
                      >
                        <Inventory sx={{ fontSize: 30, color: 'grey.500' }} />
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        No image URL - default icon will be shown
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                {/* Features Section for Edit */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Product Features
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Add key features that make this product unique
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      label="Add Feature"
                      placeholder="e.g., Wi-Fi Enabled, Voice Control, Smart Scheduling"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newFeature.trim()) {
                          const features = [...(editProduct.features || []), newFeature.trim()];
                          setEditProduct({...editProduct, features});
                          setNewFeature('');
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (newFeature.trim()) {
                          const features = [...(editProduct.features || []), newFeature.trim()];
                          setEditProduct({...editProduct, features});
                          setNewFeature('');
                        }
                      }}
                      disabled={!newFeature.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
                
                {editProduct.features && editProduct.features.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {editProduct.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          onDelete={() => {
                            const features = editProduct.features.filter((_, i) => i !== index);
                            setEditProduct({...editProduct, features});
                          }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {/* Downloads Section for Edit */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      User Manuals & Downloads
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Upload PDF manuals, datasheets, and other downloadable resources
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Document Label"
                    placeholder="e.g., User Manual, Installation Guide, Datasheet"
                    value={newDownload.label}
                    onChange={(e) => setNewDownload({...newDownload, label: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Document Type</InputLabel>
                    <Select
                      value={newDownload.type}
                      onChange={(e) => setNewDownload({...newDownload, type: e.target.value})}
                    >
                      <MenuItem value="manual">User Manual</MenuItem>
                      <MenuItem value="datasheet">Datasheet</MenuItem>
                      <MenuItem value="software">Software/Firmware</MenuItem>
                      <MenuItem value="driver">Driver</MenuItem>
                      <MenuItem value="guide">Installation Guide</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <input
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      id="pdf-upload-edit"
                      type="file"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            showNotification('PDF file size must be less than 10MB', 'error');
                            return;
                          }
                          await handlePdfUpload(file, true);
                        }
                      }}
                    />
                    <label htmlFor="pdf-upload-edit">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        disabled={!newDownload.label || !newDownload.type}
                      >
                        Upload PDF
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary">
                      Max size: 10MB • Format: PDF only
                    </Typography>
                  </Box>
                </Grid>
                
                {editProduct.downloads && editProduct.downloads.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Uploaded Documents:
                      </Typography>
                      {editProduct.downloads.map((download, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {download.label} ({download.type})
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {download.fileSize}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              const downloads = editProduct.downloads.filter((_, i) => i !== index);
                              setEditProduct({...editProduct, downloads});
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditProduct(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditProduct} 
              variant="contained"
            >
              Update Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Warning color="error" />
              Confirm Delete
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteProduct} 
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const renderProductViewDialog = () => (
    <Dialog 
      open={productViewDialogOpen} 
      onClose={() => setProductViewDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Visibility color="primary" />
          Product Details
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedProductForView && (
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} display="flex" justifyContent="center">
                <Box textAlign="center">
                  <Avatar 
                    src={selectedProductForView.image} 
                    variant="rounded"
                    sx={{ 
                      width: 150, 
                      height: 150,
                      margin: '0 auto',
                      mb: 2
                    }}
                  >
                    <Inventory sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Chip 
                    label={selectedProductForView.category || 'Electronics'} 
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {selectedProductForView.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedProductForView.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Price:</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{selectedProductForView.price?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Stock:</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">
                        {selectedProductForView.stock || 0}
                      </Typography>
                      {(selectedProductForView.stock || 0) < 10 && (
                        <Chip 
                          label="Low Stock" 
                          size="small" 
                          color="warning"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip 
                      label={(selectedProductForView.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                      color={(selectedProductForView.stock || 0) > 0 ? "success" : "error"}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Product ID:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedProductForView._id}
                    </Typography>
                  </Grid>
                  {selectedProductForView.createdAt && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Added on:</Typography>
                      <Typography variant="body2">
                        {new Date(selectedProductForView.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Grid>
                  )}
                  
                  {/* Features Section */}
                  {selectedProductForView.features && selectedProductForView.features.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Features:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {selectedProductForView.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Downloads Section */}
                  {selectedProductForView.downloads && selectedProductForView.downloads.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Downloads:</Typography>
                      <Box sx={{ mt: 1 }}>
                        {selectedProductForView.downloads.map((download, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {download.label} ({download.type})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {download.fileSize}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              component="a"
                              href={download.backendDownloadUrl || download.directDownloadUrl || download.url || download.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setProductViewDialogOpen(false)}>
          Close
        </Button>
        <Button 
          onClick={() => {
            setProductViewDialogOpen(false);
            setEditProduct(selectedProductForView);
          }}
          variant="contained"
        >
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderOrders = () => (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <ShoppingCart color="primary" />
              Order Management
            </Typography>
            <Button
              variant="outlined"
              onClick={fetchOrders}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
          
          {ordersLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : ordersData.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Orders Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders will appear here when customers place them
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Order #</strong></TableCell>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Items</strong></TableCell>
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersData.map((order) => (
                    <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {order.user?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.user?.email || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ₹{order.totalPrice?.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            sx={{ 
                              color: getStatusColor(order.orderStatus) === 'success' ? '#2e7d32' : 
                                     getStatusColor(order.orderStatus) === 'error' ? '#d32f2f' :
                                     getStatusColor(order.orderStatus) === 'warning' ? '#ed6c02' :
                                     getStatusColor(order.orderStatus) === 'info' ? '#0288d1' : '#1976d2'
                            }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Order Details">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOrderViewDialogOpen(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Order View Dialog */}
      <Dialog 
        open={orderViewDialogOpen} 
        onClose={() => setOrderViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Receipt color="primary" />
            Order Details - {selectedOrder?.orderNumber}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Customer Information
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#f8fafc' }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Order Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Order Information
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#f8fafc' }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong> 
                      <Chip 
                        label={selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                        color={getStatusColor(selectedOrder.orderStatus)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Payment:</strong> 
                      <Chip 
                        label={selectedOrder.isPaid ? 'Paid' : 'Pending'}
                        color={selectedOrder.isPaid ? 'success' : 'warning'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total:</strong> ₹{selectedOrder.totalPrice?.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Shipping Address */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Shipping Address
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#f8fafc' }}>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress?.fullName}<br />
                      {selectedOrder.shippingAddress?.address}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pinCode}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Order Items
                  </Typography>
                  <TableContainer component={Paper}>
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
                        {selectedOrder.orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={item.image} variant="rounded" />
                                <Typography variant="body2">{item.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">₹{item.price.toLocaleString()}</TableCell>
                            <TableCell align="right">₹{(item.price * item.quantity).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  if (loading || isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <LinearProgress sx={{ mb: 2, width: 200 }} />
            <Typography>
              {isLoading ? 'Verifying authentication...' : 'Loading admin dashboard...'}
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  // Debug info for troubleshooting blank page
  if (!isAuthenticated) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h5" color="error" gutterBottom>
            Not Authenticated
          </Typography>
          <Typography variant="body1">
            Please log in to access the admin dashboard.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You need admin privileges to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current role: {user?.role || 'No role'}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Dashboard" icon={<Dashboard />} />
          <Tab label="Users" icon={<People />} />
          <Tab label="Products" icon={<Inventory />} />
          <Tab label="Orders" icon={<ShoppingCart />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderOverview()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderUsers()}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderProducts()}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderOrders()}
      </TabPanel>

      {/* User Management Dialogs */}
      {renderUserDialogs()}
      
      {/* Product View Dialog */}
      {renderProductViewDialog()}
    </Container>
  );
};

export default AdminDashboard;
