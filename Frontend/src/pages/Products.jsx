// src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/products/ProductCard';
import axios from '../api/axios'; // using axios instance

const Products = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔍 Filter products by search
  const filteredProducts = products.filter((product) =>
  product.name && product.name.toLowerCase().includes(search.toLowerCase())
);

  return (
    <Container sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        textAlign="center"
        color="primary"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        Explore Our Smart Products
      </Typography>

      {/* 🔍 Search Bar */}
      <Box mb={{ xs: 3, sm: 4 }} display="flex" justifyContent="center">
        <TextField
          variant="outlined"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: '100%', 
            maxWidth: 500,
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1.5, sm: 2 },
            },
          }}
        />
      </Box>

      {/* ⏳ Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Products;
