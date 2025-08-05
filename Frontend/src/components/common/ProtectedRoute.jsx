import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthProvider';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Container 
} from '@mui/material';

const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Verifying authentication...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check if admin access is required
  if (adminOnly && user?.role !== 'admin') {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Admin privileges are required.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Check if user account is active
  if (user && !user.isActive) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="warning.main" gutterBottom>
            Account Suspended
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your account has been temporarily suspended.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please contact support for assistance.
          </Typography>
        </Box>
      </Container>
    );
  }

  // User is authenticated and authorized, render the protected content
  return children;
};

export default ProtectedRoute;
