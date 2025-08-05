import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, IconButton } from '@mui/material';
import HeroSlider from '../components/home/HeroSlider';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Phone, Email, LocationOn, Build, People, Security, TrendingUp, Speed, Support, Star, CheckCircle } from '@mui/icons-material';

const MotionGrid = motion(Grid);

const AboutCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    borderColor: '#2196F3',
  },
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'left',
  height: '100%',
  background: '#ffffff',
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
  },
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  paddingTop: theme.spacing(6),
  textAlign: 'left',
  height: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minWidth: '400px',
  maxWidth: '450px',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    borderColor: '#2196F3',
  },
}));

const UserAvatar = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  border: '3px solid #ffffff',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  color: 'white',
  fontWeight: 600,
  position: 'absolute',
  left: '50%',
  top: -30,
  transform: 'translateX(-50%)',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  color: 'white',
  padding: theme.spacing(4, 0),
  textAlign: 'center',
}));

const HorizontalScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(3),
  padding: theme.spacing(2, 0),
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#2196F3',
    borderRadius: '10px',
    '&:hover': {
      background: '#1976d2',
    },
  },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: '1.5rem',
  margin: theme.spacing(0, 1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
  },
  '&.instagram': {
    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    '&:hover': {
      background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      backgroundColor: 'rgba(240, 148, 51, 0.1)',
      transform: 'scale(1.2)',
      filter: 'drop-shadow(2px 2px 4px rgba(188, 24, 136, 0.4))',
    },
  },
  '&.youtube': {
    color: '#FF0000',
    '&:hover': {
      color: '#CC0000',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
  },
  '&.facebook': {
    color: '#1877F2',
    '&:hover': {
      color: '#166FE5',
      backgroundColor: 'rgba(24, 119, 242, 0.1)',
    },
  },
  '&.email': {
    color: '#EA4335',
    '&:hover': {
      color: '#D33B2C',
      backgroundColor: 'rgba(234, 67, 53, 0.1)',
    },
  },
}));

const homeFeatures = [
  {
    title: 'Professional Excellence',
    description: 'Our team of experienced engineers ensures top-quality electronic solutions',
    icon: <Build sx={{ fontSize: '3rem', color: '#2196F3' }} />,
  },
  {
    title: 'Customer First',
    description: 'We prioritize customer satisfaction with dedicated support and service',
    icon: <People sx={{ fontSize: '3rem', color: '#2196F3' }} />,
  },
  {
    title: 'Quality Assurance',
    description: 'Every product undergoes rigorous testing to meet industry standards',
    icon: <Security sx={{ fontSize: '3rem', color: '#2196F3' }} />,
  },
];

const statistics = [
  {
    number: '5K+',
    label: 'Happy Customers',
    icon: <People sx={{ fontSize: '2.5rem', mb: 1 }} />,
  },
  {
    number: '25+',
    label: 'Products Available',
    icon: <Build sx={{ fontSize: '2.5rem', mb: 1 }} />,
  },
  {
    number: '24/7',
    label: 'Customer Support',
    icon: <Support sx={{ fontSize: '2.5rem', mb: 1 }} />,
  },
  {
    number: '5+',
    label: 'Years Experience',
    icon: <TrendingUp sx={{ fontSize: '2.5rem', mb: 1 }} />,
  },
];

const testimonials = [
  {
    name: 'Ramesh  Patil',
    location: 'Farmer, Sangamner',
    review: 'Smart Electronics has revolutionized my farming operations. Their automatic starters have saved me countless hours and improved my productivity significantly.',
    rating: 5,
    initials: 'RP',
  },
  {
    name: 'Suresh Kumar',
    location: 'Engineer, Ahmednagar',
    review: 'Excellent quality products and outstanding customer service. Their technical support team is very knowledgeable and always ready to help.',
    rating: 5,
    initials: 'SK',
  },
  {
    name: 'Prakash Jadhav',
    location: 'Business Owner, Akole',
    review: 'I have been using Smart Electronics products for my business for years. Reliable, durable, and cost-effective solutions every time.',
    rating: 5,
    initials: 'PJ',
  },
  {
    name: 'Anita Sharma',
    location: 'Home Owner, Pune',
    review: 'The smart home automation system they installed is fantastic. Easy to use and has made our daily life so much more convenient.',
    rating: 5,
    initials: 'AS',
  },
];

const achievements = [
  'ISO Certified Quality Products',
  'Expert Technical Support Team',
  'Fast Delivery Across Maharashtra',
  'Warranty on All Products',
  'Custom Solutions Available',
  'Competitive Pricing',
];

const contactInfo = [
  {
    title: 'Address',
    detail: 'Smart Enterprise Kasara Dhumala, Bholenathnagar, Akole Road Post.Chikali, Tal.Sangmner, Dist.Ahmednagar Maharashtra-422605',
    icon: <LocationOn sx={{ fontSize: '2rem', color: '#2196F3' }} />,
  },
  {
    title: 'Email',
    detail: 'smartenterprisesservices@gmail.com',
    icon: <Email sx={{ fontSize: '2rem', color: '#2196F3' }} />,
  },
  {
    title: 'Phone',
    detail: '+91 7720008780',
    icon: <Phone sx={{ fontSize: '2rem', color: '#2196F3' }} />,
  },
];

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-change testimonials every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev >= testimonials.length - 2 ? 0 : prev + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      overflowX: 'hidden',
      backgroundColor: '#f5f5f7'
    }}>
      <Box sx={{ marginTop: { xs: '25px', md: '-35px' }, pt: { xs: 2, md: 3 } }}>
        <HeroSlider />
      </Box>
      
      {/* Features Section */}
      <Box 
        id="features"
        sx={{ 
          py: { xs: 6, md: 10 },
          backgroundColor: '#f5f5f7',
          color: '#333'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: { xs: 3, md: 6 },
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            }}
          >
            Why Choose Smart Electronics
          </Typography>
          
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: { xs: 4, md: 8 },
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            We are committed to delivering excellence in every aspect of our service, 
            from innovative solutions to exceptional customer support.
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {homeFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  style={{ width: '100%' }}
                >
                  <AboutCard elevation={0} sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '280px',
                    maxWidth: '350px',
                    mx: 'auto'
                  }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#333',
                        textAlign: 'center',
                        mb: 2,
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#666',
                        textAlign: 'center',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        px: 2
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </AboutCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: { xs: 4, md: 6 },
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Our Impact in Numbers
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StatsCard elevation={0}>
                    {stat.icon}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        mb: 1
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        opacity: 0.9
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </StatsCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 8 },
          backgroundColor: '#f5f5f7'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: { xs: 4, md: 6 },
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: '#333'
            }}
          >
            Why Customers Choose Us
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: '12px',
                      background: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateX(10px)',
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.2)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CheckCircle sx={{ color: '#4CAF50', mr: 2, fontSize: '1.5rem' }} />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#333',
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      {achievement}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 10 },
          backgroundColor: '#f8f9fa'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: '#333'
            }}
          >
            What Our Customers Say
          </Typography>
          
          {/* Carousel Container */}
          <CarouselContainer>
            {/* Testimonials Grid - Show 2 cards */}
            <Box sx={{ px: { xs: 4, md: 6 }, py: 4 }}>
              <Grid container spacing={4} justifyContent="center">
                {testimonials.slice(currentTestimonial, currentTestimonial + 2).map((testimonial, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    md={6} 
                    key={currentTestimonial + index}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ height: '100%' }}
                    >
                      <Box sx={{ position: 'relative', mt: 4, height: '100%' }}>
                        <TestimonialCard elevation={0} sx={{ 
                          height: '320px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}>
                          {/* User Avatar with Initials - Top Border */}
                          <UserAvatar>
                            {testimonial.initials}
                          </UserAvatar>

                          {/* Customer Name */}
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#333',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.25rem' },
                              textAlign: 'center'
                            }}
                          >
                            {testimonial.name}
                          </Typography>

                          {/* Star Rating */}
                          <Box sx={{ mb: 2, textAlign: 'center' }}>
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star 
                                key={i} 
                                sx={{ 
                                  color: '#FFD700', 
                                  fontSize: '1.2rem',
                                  mr: 0.2
                                }} 
                              />
                            ))}
                          </Box>

                          {/* Review Text */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666',
                              lineHeight: 1.6,
                              fontSize: { xs: '0.9rem', md: '0.95rem' },
                              flexGrow: 1,
                              fontStyle: 'italic',
                              mb: 2,
                              textAlign: 'center'
                            }}
                          >
                            "{testimonial.review}"
                          </Typography>

                          {/* Location */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#2196F3',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              textAlign: 'center'
                            }}
                          >
                            {testimonial.location}
                          </Typography>
                        </TestimonialCard>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Dots Indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              {Array.from({ length: testimonials.length - 1 }).map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: currentTestimonial === index ? '#2196F3' : '#ddd',
                    mx: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: currentTestimonial === index ? '#1976d2' : '#bbb',
                      transform: 'scale(1.2)',
                    },
                  }}
                />
              ))}
            </Box>
          </CarouselContainer>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box 
        id="contact"
        sx={{ 
          py: { xs: 6, md: 10 },
          backgroundColor: '#f5f5f7' // Consistent background color
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: { xs: 3, md: 6 },
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              color: '#333'
            }}
          >
            Contact Us
          </Typography>
          
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: { xs: 4, md: 8 },
              color: '#666',
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Get in touch with us for any inquiries, support, or business opportunities. 
            We're here to help you with all your electronic needs.
          </Typography>
          
          <Grid container spacing={4} sx={{ justifyContent: 'center', mb: 6 }}>
            <Grid item xs={12} md={5}>
              {/* Contact Information - Left Side */}
              <ContactCard elevation={1} sx={{ 
                padding: 4, 
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                background: '#ffffff'
              }}>
                {/* Address */}
                <Box sx={{ mb: 3 }}>
                  <LocationOn sx={{ fontSize: '2.5rem', color: '#2196F3', mb: 1 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      mb: 0.5,
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    Smart Enterprise Kasara Dhumala,
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      mb: 0.5,
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    Bholenathnagar, Akole Road
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      mb: 0.5,
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    Post.Chikali , Tal.Sangmner ,
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    Dist.Ahmednagar Maharashtra-422605
                  </Typography>
                </Box>

                {/* Email */}
                <Box sx={{ mb: 3 }}>
                  <Email sx={{ fontSize: '2.5rem', color: '#2196F3', mb: 1 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    smartenterprisesservices@gmail.com
                  </Typography>
                </Box>

                {/* Phone */}
                <Box>
                  <Phone sx={{ fontSize: '2.5rem', color: '#2196F3', mb: 1 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.9rem',
                      lineHeight: 1.3
                    }}
                  >
                    7720008780
                  </Typography>
                </Box>
              </ContactCard>
            </Grid>
            
            <Grid item xs={12} md={5}>
              {/* Google Map - Right Side */}
              <ContactCard elevation={1} sx={{ 
                padding: 3, 
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff'
              }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: '2.5rem', color: '#2196F3' }} />
                </Box>
                <Box 
                  sx={{ 
                    flexGrow: 1,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '2px solid rgba(33, 150, 243, 0.1)'
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d939.8592917349622!2d74.19046399525331!3d19.56576296492069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd01007059b9cf%3A0xe4d8bbf27567edf6!2sSmart%20Enterprises!5e0!3m2!1sen!2sin!4v1750307453674!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Smart Enterprises Location"
                  />
                </Box>
              </ContactCard>
            </Grid>
          </Grid>

          {/* Social Media Icons - Below both cards and centered */}
          <Box sx={{ textAlign: 'center' }}>
            <SocialIconButton 
              className="instagram"
              onClick={() => window.open('https://instagram.com/smaet_enterprises2011?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D', '_blank')}
              sx={{ fontSize: '2.5rem' }}
            >
              <i className="fab fa-instagram" />
            </SocialIconButton>
            
            <SocialIconButton 
              className="youtube"
              onClick={() => window.open('https://youtube.com/@smartenterprisesservices', '_blank')}
              sx={{ fontSize: '2.5rem' }}
            >
              <i className="fab fa-youtube" />
            </SocialIconButton>
            
            <SocialIconButton 
              className="facebook"
              onClick={() => window.open('https://www.facebook.com/profile.php?id=100083190129063&mibextid=9R9pXO', '_blank')}
              sx={{ fontSize: '2.5rem' }}
            >
              <i className="fab fa-facebook" />
            </SocialIconButton>
            
            <SocialIconButton 
              className="email"
              onClick={() => window.open('mailto:smartenterprisesservices@gmail.com', '_blank')}
              sx={{ fontSize: '2.5rem' }}
            >
              <i className="fas fa-envelope" />
            </SocialIconButton>
          </Box>
        </Container>
      </Box>

      {/* Footer - Developed By */}
      <FooterSection>
        <Container maxWidth="lg">
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1rem',
              opacity: 0.9,
              mb: 1
            }}
          >
            © 2025 Smart Electronics. All rights reserved.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.9rem',
              opacity: 0.8
            }}
          >
            Developed with ❤️ by{' '}
            <Typography 
              component="span" 
              sx={{ 
                fontWeight: 600,
                color: '#FFD700'
              }}
            >
              TechCrafters Solutions
            </Typography>
          </Typography>
        </Container>
      </FooterSection>
    </Box>
  );
};

export default HomePage;
