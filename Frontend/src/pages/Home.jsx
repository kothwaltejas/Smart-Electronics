import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import HeroSlider from '../components/home/HeroSlider';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  background: '#ffffff',
  backdropFilter: 'none',
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: '0 8px',
    width: '280px',
  },
  [`@media (max-width: 380px)`]: { // Very small devices
    width: '100%',
    margin: '0 0 16px 0',
  }
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none'
  },
  [`@media (max-width: 380px)`]: {
    overflowX: 'hidden'
  }
}));

const features = [
  {
    title: 'Latest Technology',
    description: 'Stay ahead with cutting-edge electronic devices',
    icon: '🚀',
  },
  {
    title: 'Best Deals',
    description: 'Unbeatable prices on premium electronics',
    icon: '💰',
  },
  {
    title: 'Expert Support',
    description: '24/7 technical assistance for all your needs',
    icon: '👨‍💻',
  },
  {
    title: 'Fast Delivery',
    description: 'Quick and secure shipping worldwide',
    icon: '🚚',
  },
];

const MotionGrid = motion(Grid);

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <HeroSlider />
      
      {/* Features Section */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: { xs: 3, sm: 6, md: 8 },
          px: { xs: 0, sm: 3, md: 4 },
          overflow: 'hidden',
          width: {
            xs: '95%', // Reduced width on mobile
            sm: '100%'
          },
          maxWidth: 'xl',
          mx: 'auto'
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            mb: { xs: 3, sm: 5, md: 6 },
            px: { xs: 2, sm: 0 },
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Why Choose Us ?
        </Typography>
        
        <ScrollContainer>
          <Grid 
            container 
            spacing={{ xs: 0, sm: 3, md: 4 }}
            sx={{
              flexWrap: { xs: 'nowrap', sm: 'wrap', lg: 'nowrap' },
              justifyContent: 'flex-start',
              px: { xs: 2, sm: 0 },
              pb: { xs: 2 },
              '& > .MuiGrid-item': {
                scrollSnapAlign: 'center',
              },
              '@media (max-width: 380px)': {
                flexDirection: 'column',
                alignItems: 'center',
                '& > .MuiGrid-item': {
                  width: '100%'
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <MotionGrid
                item
                xs='auto'
                sm={6}
                lg={3}
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                sx={{
                  display: 'flex',
                  minWidth: { xs: 'auto', lg: '250px' },
                  maxWidth: { lg: '300px' },
                  '@media (max-width: 380px)': {
                    width: '100%',
                    maxWidth: '100%'
                  }
                }}
              >
                <FeatureCard elevation={3}>
                  <Typography variant="h2" sx={{ 
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}>
                    {feature.icon}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.85rem', sm: '1rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </MotionGrid>
            ))}
          </Grid>
        </ScrollContainer>
      </Container>
    </Box>
  );
};

export default HomePage;
