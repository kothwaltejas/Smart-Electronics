// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { ShoppingCart, Info, CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartProvider';
import { useNotification } from '../../context/NotificationProvider.jsx';
import ComingSoonModal from '../common/ComingSoonModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Keep existing code intact
  const { showNotification } = useNotification();
  const [adding, setAdding] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Keep original function for future use - currently disabled
  const handleAddToCartOriginal = async () => {
    setAdding(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product, 1);
    showNotification(`${product.name} added to cart! 🛒`, 'success');
    setAdding(false);
  };

  // New handler that shows coming soon modal
  const handleAddToCart = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: { xs: 280, sm: 320, md: 360 },
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          mx: { xs: 1, sm: 0 },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            height: { xs: 160, sm: 180, md: 200 },
            objectFit: 'contain',
            p: { xs: 1, sm: 2 },
            backgroundColor: '#f5f5f5',
          }}
        />

        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 2, sm: 3 },
          '&:last-child': { pb: { xs: 2, sm: 3 } }
        }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ 
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{ 
              color: '#555', 
              mb: 1, 
              minHeight: { xs: 30, sm: 40 }, 
              flexGrow: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              lineHeight: 1.4,
            }}
          >
            {product.description}
          </Typography>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ 
              color: '#2e7d32', 
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.125rem' },
            }}
          >
            ₹{product.price?.toLocaleString()}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              fullWidth
              variant="contained"
              disabled={false} // Disabled adding state since we're showing modal instead
              onClick={handleAddToCart}
              startIcon={<ShoppingCart />} // Remove loading state since no actual processing
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-1px)',
                },
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              Add to Cart
            </Button>

            <Link
              to={`/product/${product._id}`}
              style={{ textDecoration: 'none', width: '100%' }}
            >
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 },
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    transform: 'translateY(-1px)',
                  },
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
                startIcon={<Info />}
              >
                Details
              </Button>
            </Link>
          </Stack>
        </CardContent>
      </Card>
      
      <ComingSoonModal 
        open={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
      />
    </>
  );
};

export default ProductCard;