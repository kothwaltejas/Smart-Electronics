// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Rating,
  Breadcrumbs,
  Link as MUILink,
  Stack,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { ShoppingCart, LocalShipping, Security, Add, Remove, FileDownload } from '@mui/icons-material';
import { useCart } from '../context/CartProvider';
import ComingSoonModal from '../components/common/ComingSoonModal';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Keep existing code intact
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'inc' ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" mt={5}>Loading...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h5" mt={5}>Product not found.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5 }}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none' }}
      >
        ← Back to Products
      </Button>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MUILink underline="hover" color="inherit" onClick={() => navigate('/')}>Home</MUILink>
        <MUILink underline="hover" color="inherit" onClick={() => navigate('/products')}>Products</MUILink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 500,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '400px',
                  height: '300px',
                  objectFit: 'contain',
                  p: 2,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3} alignItems="flex-start">
              <Typography variant="h4" fontWeight={700}>{product.name}</Typography>
              <Chip label={product.category} sx={{ backgroundColor: '#e3f2fd', color: '#1565c0', width: 'fit-content' }} />

              <Box display="flex" alignItems="center">
                <Rating value={product.rating || 0} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>({product.reviews || 0} reviews)</Typography>
              </Box>

              <Typography variant="body1" sx={{ color: '#555' }}>
                {product.description ? 
                  product.description.split(' ').slice(0, 11).join(' ') + 
                  (product.description.split(' ').length > 11 ? '...' : '') 
                  : 'No description available'
                }
              </Typography>

              <Typography variant="h5" fontWeight={600} color="success.main">
                ₹{product.price?.toLocaleString()}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton onClick={() => handleQuantityChange('dec')}><Remove /></IconButton>
                  <TextField
                    value={quantity}
                    size="small"
                    inputProps={{ readOnly: true, style: { textAlign: 'center', width: '40px' } }}
                  />
                  <IconButton onClick={() => handleQuantityChange('inc')}><Add /></IconButton>
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                  onClick={() => {
                    // Keep original code for future use - currently disabled
                    // addToCart(product, quantity);
                    // Show coming soon modal instead
                    setShowComingSoon(true);
                  }}
                >
                  Add to Cart
                </Button>
              </Stack>

              <Stack direction="row" spacing={4} mt={2}>
                <Box display="flex" alignItems="center">
                  <LocalShipping sx={{ mr: 1, color: '#2e7d32' }} />
                  <Typography variant="body2">Free Delivery</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Security sx={{ mr: 1, color: '#2e7d32' }} />
                  <Typography variant="body2">1 Year Warranty</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 6 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Description" />
          <Tab label="Key Features" />
          <Tab label="Downloads" />
        </Tabs>

        {tabIndex === 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#2e7d32' }}>
              Product Description
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#555', 
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                textAlign: 'justify'
              }}
            >
              {product.description || 'No detailed description available for this product.'}
            </Typography>
          </Box>
        )}

        {tabIndex === 1 && (
          <Stack spacing={1} alignItems="flex-start">
            {product.features && product.features.length > 0 ? (
              product.features.map((feature, index) => (
                <Typography key={index} variant="body1">
                  ✔ {feature}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No features listed for this product.
              </Typography>
            )}
          </Stack>
        )}

        {tabIndex === 2 && (
          <Stack spacing={2} alignItems="flex-start">
            {product.downloads && product.downloads.length > 0 ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📄 Available downloads for this product:
                </Typography>
                {product.downloads.map((download, index) => {
                  console.log('Rendering download:', download); // Debug log
                  
                  const handleDownload = async (e) => {
                    e.preventDefault();
                    console.log('Download button clicked:', download);
                    
                    try {
                      // Use the download URL if available, otherwise use regular URL
                      let downloadUrl = download.downloadUrl || download.url || download.link;
                      
                      // If it's a Cloudinary URL, ensure it has the right parameters for download
                      if (downloadUrl && downloadUrl.includes('cloudinary.com')) {
                        // For Cloudinary, use fetch and blob approach for proper PDF download
                        const response = await fetch(downloadUrl);
                        
                        if (!response.ok) {
                          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        
                        const blob = await response.blob();
                        
                        // Create a proper filename with .pdf extension
                        const filename = `${download.label || 'document'}.pdf`;
                        
                        // Create blob URL and download
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = filename;
                        link.style.display = 'none';
                        
                        // Add to DOM, click, and cleanup
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Clean up the blob URL
                        setTimeout(() => {
                          window.URL.revokeObjectURL(blobUrl);
                        }, 100);
                        
                        console.log(`Download initiated successfully: ${filename}`);
                      } else {
                        // Fallback for non-Cloudinary URLs
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = `${download.label || 'document'}.pdf`;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        console.log('Download initiated with fallback method');
                      }
                      
                    } catch (error) {
                      console.error('Download error:', error);
                      
                      // Ultimate fallback: open in new tab
                      try {
                        const fallbackUrl = download.downloadUrl || download.url || download.link;
                        if (fallbackUrl) {
                          window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
                          console.log('Opened in new tab as fallback');
                        }
                      } catch (fallbackError) {
                        alert(`Download failed: ${error.message}. Please try again or contact support.`);
                      }
                    }
                  };
                  
                  return (
                    <Button
                      key={index}
                      variant="outlined"
                      startIcon={<FileDownload />}
                      onClick={handleDownload}
                      sx={{ 
                        borderColor: 'black', 
                        color: 'black',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          borderColor: 'black'
                        }
                      }}
                    >
                      Download {download.label} {download.type && `(${download.type})`} 
                      {download.fileSize && ` - ${download.fileSize}`}
                    </Button>
                  );
                })}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  📄 No downloads available for this product.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User manuals and datasheets will appear here when available.
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Container>
    
    <ComingSoonModal 
      open={showComingSoon} 
      onClose={() => setShowComingSoon(false)} 
    />
    </>
  );
};

export default ProductDetails;
