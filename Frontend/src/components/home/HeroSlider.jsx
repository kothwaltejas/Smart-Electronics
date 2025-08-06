import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingBag } from '@mui/icons-material';
import axios from '../../api/axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '85vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #0c0c0c 0%, #2b2b2b 100%)',
  overflow: 'hidden',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  width: '100%',
  borderRadius: 'inherit', // Inherit border radius from parent
  [theme.breakpoints.down('sm')]: {
    height: '75vh',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    width: '100%'
  }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '35vh',
  },
  [theme.breakpoints.up('sm')]: {
    width: '50%',
    alignItems: 'flex-start',
    textAlign: 'left',
    marginLeft: theme.spacing(4),
    marginTop: 0,
  }
}));

const ProductImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  height: 'auto',
  width: '85%',
  maxHeight: '55%',
  right: '50%',
  top: '50%',
  transform: 'translate(50%, -50%)',
  objectFit: 'contain',
  zIndex: 2,
  opacity: 0.95,
  [theme.breakpoints.down('sm')]: {
    width: '75%', // Reduced width on mobile
    maxHeight: '35%',
    top: '25%',
    transform: 'translate(50%, -50%)',
  },
  [theme.breakpoints.up('sm')]: {
    width: '45%',
    maxHeight: '65%',
    right: '5%',
    top: '50%',
    transform: 'translateY(-50%)',
  }
}));

const HeroButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: '50px',
  textTransform: 'none',
  fontSize: '0.9rem',
  backgroundColor: '#1976d2',
  color: 'white',
  alignSelf: 'center',
  marginTop: theme.spacing(2),
  boxShadow: '0 4px 14px rgba(25,118,210,0.3)',
  '&:hover': {
    backgroundColor: '#1565c0',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.8, 2.5),
    fontSize: '0.85rem',
    marginTop: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    alignSelf: 'flex-start',
    padding: theme.spacing(1.2, 4),
    fontSize: '1rem',
  },
}));

const slides = [
  {
    title: 'GSM Based System',
    subtitle: 'Smart Home Automation',
    description: 'Control your home appliances remotely with our advanced GSM technology. Perfect for modern smart homes.',
    features: ['Remote Control via SMS', 'Real-time Status Updates', 'Easy Installation'],
    buttonText: 'Shop Now',
    image: 'https://i.ibb.co/4wxWX5kt/GSM.png',
    searchTerm: 'GSM'
  },
  {
    title: 'Single Phase Digital Starter',
    subtitle: 'SPDS Technology',
    description: 'Efficient power distribution system with smart monitoring and control capabilities.',
    features: ['Power Monitoring', 'Load Balancing', 'Energy Analytics'],
    buttonText: 'Buy Now',
    image: 'https://i.ibb.co/WvZ9Gkf3/spds.png',
    searchTerm: 'SPDS'
  },
  {
    title: 'Two Phase Digital Starter',
    subtitle: 'TPDS Solutions',
    description: 'Professional grade three-phase distribution system for industrial applications.',
    features: ['Phase Monitoring', 'Overload Protection', 'Industrial Grade'],
    buttonText: 'Buy Now',
    image: 'https://i.ibb.co/tMV0K9Bg/TPDS.png',
    searchTerm: 'TPDS'
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();

  const handleBuyNow = (slide) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    // Navigate to products page with search filter
    navigate(`/products?search=${slide.searchTerm}`);
  };
  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',
      pt: { xs: 2, md: 4 } // Add top padding for classy look
    }}>
      <Box sx={{
        width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' }, // Progressive width constraints
        mx: 'auto',
        borderRadius: { xs: '12px', md: '16px' }, // Rounded corners
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)' // Subtle shadow
      }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
          className="hero-slider"
          style={{
            width: '100%',
            height: '85vh',
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <SlideContent>
                <Container 
                  maxWidth="lg" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    position: 'relative',
                    px: { xs: 1, sm: 3, md: 4 },
                  }}
                >
                  <ContentWrapper>
                    <Typography
                      variant="overline"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                        letterSpacing: { xs: '2px', sm: '3px', md: '4px' },
                        color: '#1976d2',
                        display: 'block',
                        mb: { xs: 0.5, sm: 1 },
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '1.6rem', sm: '2.2rem', md: '2.8rem' },
                        lineHeight: 1.2,
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#ffffff',
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                        maxWidth: '600px',
                        lineHeight: 1.6,
                        opacity: 0.9,
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      {slide.description}
                    </Typography>
                    <Stack 
                      spacing={0.75} 
                      sx={{ 
                        mb: { xs: 1.5, sm: 2 },
                        alignItems: { xs: 'center', md: 'flex-start' },
                      }}
                    >
                      {slide.features.map((feature, idx) => (
                        <Typography
                          key={idx}
                          variant="body1"
                          sx={{
                            color: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                            textAlign: { xs: 'center', md: 'left' },
                            '&:before': {
                              content: '"•"',
                              color: '#1976d2',
                              marginRight: '8px',
                              fontSize: '1.2rem',
                            },
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Stack>
                    <HeroButton 
                      variant="contained"
                      startIcon={<ShoppingBag />}
                      onClick={() => handleBuyNow(slide)}
                    >
                      {slide.buttonText}
                    </HeroButton>
                  </ContentWrapper>
                  <ProductImage 
                    src={slide.image} 
                    alt={slide.title}
                    sx={{
                      filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))',
                    }} 
                  />
                </Container>
              </SlideContent>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default HeroSlider;
