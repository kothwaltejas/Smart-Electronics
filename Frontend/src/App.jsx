import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';
import './App.css';
import responsiveTheme from './theme/responsiveTheme';

import Navbar from './components/common/Navbar';
import LoadingScreen from './components/common/LoadingScreen';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import CheckoutEnhanced from './pages/CheckoutEnhanced';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import AuthForm from './pages/AuthForm';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from '@context/CartProvider';
import { NotificationProvider } from '@context/NotificationProvider';
import { AuthProvider } from '@context/AuthProvider';

// Enhance the responsive theme with additional palette settings
const theme = {
  ...responsiveTheme,
  palette: {
    ...responsiveTheme.palette,
    primary: { 
      main: '#2196F3',
    },
    secondary: {
      main: '#21CBF3',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
  },
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && (
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <Navbar />
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <CheckoutEnhanced />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order/:id" 
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/login" element={<AuthForm />} />
                <Route path="/register" element={<AuthForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
      )}
    </ThemeProvider>
  );
}

export default App;
