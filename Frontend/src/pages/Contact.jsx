import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Email, 
  LocationOn, 
  WhatsApp,
  Send,
  Business,
  AccessTime
} from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0, 3, 0),
  marginTop: 0,
  backgroundColor: '#f8f9fa',
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  textAlign: 'center',
  background: '#ffffff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
  },
}));

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  background: '#ffffff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
}));

const CTAButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: '25px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: 'white',
  boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
    background: 'linear-gradient(135deg, #1976D2 0%, #1BA5D8 100%)',
  },
}));

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // You can implement email sending or form submission logic here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Phone sx={{ fontSize: '3rem', color: '#2196F3' }} />,
      title: 'Phone',
      info: '+91 98765 43210',
      action: () => window.open('tel:+919876543210'),
    },
    {
      icon: <WhatsApp sx={{ fontSize: '3rem', color: '#25D366' }} />,
      title: 'WhatsApp',
      info: '+91 98765 43210',
      action: () => window.open('https://wa.me/919876543210'),
    },
    {
      icon: <Email sx={{ fontSize: '3rem', color: '#2196F3' }} />,
      title: 'Email',
      info: 'info@smartelectronics.com',
      action: () => window.open('mailto:info@smartelectronics.com'),
    },
    {
      icon: <LocationOn sx={{ fontSize: '3rem', color: '#2196F3' }} />,
      title: 'Address',
      info: 'Lingdev Village, Akole Taluka, Maharashtra',
      action: () => window.open('https://maps.google.com/?q=Akole+Maharashtra'),
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
    }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              component="h1"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
                color: '#333',
              }}
            >
              Contact Us
            </Typography>
            
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
                color: '#666',
                mb: 4
              }}
            >
              Get in touch with Smart Electronics for all your agricultural electronic needs
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Contact Information Cards */}
      <Box sx={{ py: 6, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: '#333'
            }}
          >
            Get In Touch
          </Typography>
          
          <Grid container spacing={4}>
            {contactInfo.map((contact, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ContactCard onClick={contact.action} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ mb: 2 }}>
                      {contact.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                      {contact.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {contact.info}
                    </Typography>
                  </ContactCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Form and Business Info */}
      <Box sx={{ py: 6, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <FormCard>
                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{
                      mb: 3,
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '1.8rem' },
                      color: '#333'
                    }}
                  >
                    Send us a Message
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          multiline
                          rows={6}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CTAButton
                          type="submit"
                          variant="contained"
                          size="large"
                          endIcon={<Send />}
                          fullWidth
                        >
                          Send Message
                        </CTAButton>
                      </Grid>
                    </Grid>
                  </Box>
                </FormCard>
              </motion.div>
            </Grid>

            {/* Business Information */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <FormCard sx={{ height: 'fit-content' }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 3,
                      fontWeight: 700,
                      color: '#333'
                    }}
                  >
                    Business Information
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Business sx={{ color: '#2196F3', mr: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Smart Electronics
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Leading provider of agricultural electronic solutions since 2019
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ color: '#2196F3', mr: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Business Hours
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 5:00 PM
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#333',
                      fontWeight: 600,
                      mb: 1
                    }}>
                      Need Immediate Assistance?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Call us directly or message us on WhatsApp for quick support
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton 
                        onClick={() => window.open('tel:+919876543210')}
                        sx={{ 
                          backgroundColor: '#2196F3', 
                          color: 'white',
                          '&:hover': { backgroundColor: '#1976D2' }
                        }}
                      >
                        <Phone />
                      </IconButton>
                      <IconButton 
                        onClick={() => window.open('https://wa.me/919876543210')}
                        sx={{ 
                          backgroundColor: '#25D366', 
                          color: 'white',
                          '&:hover': { backgroundColor: '#1DA851' }
                        }}
                      >
                        <WhatsApp />
                      </IconButton>
                    </Box>
                  </Box>
                </FormCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;
