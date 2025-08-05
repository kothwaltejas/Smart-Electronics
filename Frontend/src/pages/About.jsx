import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Timeline,
  Visibility,
  Flag,
  Lightbulb,
  FavoriteOutlined,
  Security,
  Nature,
  ShoppingCart,
  ArrowForward,
  Business,
  TrendingUp,
  EmojiEvents,
  Computer
} from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0, 3, 0),
  marginTop: 0,
  backgroundColor: '#f8f9fa',
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: '#ffffff',
}));

const StoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
  height: '100%',
}));

const FounderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: '#ffffff',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '2px solid rgba(33, 150, 243, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
  },
}));

const MissionVisionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '20px',
  textAlign: 'center',
  minHeight: '350px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
  }
}));

const ValueCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
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

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #E0E0E0 0%, #BDBDBD 100%)',
    transform: 'translateY(-50%)',
    zIndex: 1,
  },
}));

const TimelineItem = styled(Box)(({ theme, position }) => ({
  position: 'absolute',
  left: position === 'first' ? '15%' : position === 'second' ? '35%' : position === 'third' ? '65%' : '85%',
  transform: 'translateX(-50%)',
  zIndex: 2,
}));

const YearBox = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: color || '#E0E0E0',
  color: color === '#E0E0E0' ? '#666' : color === '#FFB74D' ? '#FFF' : '#333',
  padding: theme.spacing(1, 3),
  borderRadius: '20px',
  fontWeight: 700,
  fontSize: '1.2rem',
  border: '3px solid white',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  zIndex: 3,
}));

const MilestoneCircle = styled(Box)(({ theme, color }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: color || '#E0E0E0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 12px',
  border: '3px solid white',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  '& svg': {
    fontSize: '2rem',
    color: 'white',
  },
}));

const MilestoneContent = styled(Box)(({ theme, isTop }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 250,
  [isTop ? 'bottom' : 'top']: '100%',
  marginBottom: isTop ? theme.spacing(4) : 0,
  marginTop: isTop ? 0 : theme.spacing(4),
}));

const MilestoneCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  textAlign: 'center',
  position: 'relative',
  minHeight: '170px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
  },
}));

const MilestoneCardTop = styled(MilestoneCard)(({ theme }) => ({
  '&::after': {
    bottom: '-10px',
    borderTop: '10px solid white',
  },
}));

const MilestoneCardBottom = styled(MilestoneCard)(({ theme }) => ({
  '&::after': {
    top: '-10px',
    borderBottom: '10px solid white',
  },
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

// Core values data
const coreValues = [
  {
    icon: <Lightbulb sx={{ fontSize: '3rem', color: '#2196F3' }} />,
    title: 'Innovation',
    description: 'Continuously developing cutting-edge agricultural technology solutions'
  },
  {
    icon: <FavoriteOutlined sx={{ fontSize: '3rem', color: '#2196F3' }} />,
    title: 'Farmer-First',
    description: 'Putting farmers\' needs and success at the center of everything we do'
  },
  {
    icon: <Security sx={{ fontSize: '3rem', color: '#2196F3' }} />,
    title: 'Trust',
    description: 'Building lasting relationships through reliability and exceptional service'
  },
  {
    icon: <Nature sx={{ fontSize: '3rem', color: '#2196F3' }} />,
    title: 'Sustainability',
    description: 'Promoting eco-friendly practices for a better agricultural future'
  },
];

// Timeline data with icons and colors
const milestones = [
  {
    year: '2019',
    title: 'Company Founded',
    description: 'Started with a vision to revolutionize farming through technology in Akole, Maharashtra',
    icon: <Business />,
    color: '#FF7043',
    position: 'first',
    isTop: false
  },
  {
    year: '2021',
    title: 'Market Expansion',
    description: 'Expanded across Maharashtra serving 1000+ satisfied farming customers',
    icon: <TrendingUp />,
    color: '#FFB74D',
    position: 'second',
    isTop: true
  },
  {
    year: '2024',
    title: 'Industry Leadership',
    description: 'Recognized as leading provider of agricultural electronics in Maharashtra',
    icon: <EmojiEvents />,
    color: '#78909C',
    position: 'third',
    isTop: false
  },
  {
    year: '2025',
    title: 'Digital Transformation',
    description: 'Launched e-commerce platform for seamless customer experience',
    icon: <Computer />,
    color: '#90A4AE',
    position: 'fourth',
    isTop: true
  },
];

const AboutPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path === '/contact') {
      // Scroll to top first
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      // Navigate to home page contact section
      navigate('/', { replace: true });
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Scroll to top before navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      // Use React Router navigation to avoid page reload and loading screen
      navigate(path);
    }
  };

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
              About Smart Enterprises
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
              Leading provider of agricultural electronic solutions since 2019
            </Typography>

            <Box sx={{ textAlign: 'center' }}>
              <CTAButton 
                variant="contained"
                size="medium"
                endIcon={<ShoppingCart />}
                onClick={() => handleNavigation('/products')}
              >
                Explore Our Products
              </CTAButton>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Our Story Section */}
      <Box sx={{ py: 4, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: '#333'
                  }}
                >
                  Our Story
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.8, 
                  color: '#555',
                  mb: 3
                }}>
                  Founded in 2019 with a simple yet powerful vision: to bridge the gap between 
                  traditional farming practices and modern technology. Smart Enterprises emerged 
                  from the rural heartlands of Maharashtra, where we witnessed firsthand the 
                  daily challenges faced by farmers.
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.8, 
                  color: '#555',
                  mb: 3
                }}>
                  What started as a local initiative to help farming communities has grown into 
                  a trusted name across Maharashtra, serving thousands of customers with 
                  innovative electronic solutions that transform agricultural operations.
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.8, 
                  color: '#555'
                }}>
                  Today, we continue to honor our roots while embracing cutting-edge technology 
                  to create products that make farming more efficient, profitable, and sustainable.
                </Typography>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <StoryCard>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: '#2196F3',
                      fontSize: '1.1rem'
                    }}
                  >
                    Empowering Maharashtra's Farmers Since 2019
                  </Typography>
                </StoryCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Meet Our Founder Section */}
      <ContentSection>
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
            Meet Our Founder
          </Typography>
          
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <FounderCard>
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      mx: 'auto',
                      mb: 3,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '4px solid #2196F3',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/src/assets/images/founder.jpg"
                      alt="Devidas Phapale - Founder"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                    DEVIDAS PHAPALE
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2196F3', fontWeight: 600 }}>
                    Founder & CEO
                  </Typography>
                </FounderCard>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="body1" sx={{ 
                  fontSize: '1.2rem', 
                  lineHeight: 1.8, 
                  color: '#555',
                  mb: 3
                }}>
                  <strong>Devidas Phapale</strong>, hailing from the village of Lingdev in Akole Taluka, 
                  represents the true spirit of rural entrepreneurship. His journey from modest rural 
                  beginnings to becoming a technology innovator is a testament to determination and vision.
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  fontSize: '1.2rem', 
                  lineHeight: 1.8, 
                  color: '#555',
                  mb: 3
                }}>
                  With deep roots in agriculture and a passion for technology, Devidas identified the 
                  unique challenges faced by farmers and dedicated himself to developing practical, 
                  innovative solutions that would make their lives easier and more productive.
                </Typography>
                
                <Box sx={{ 
                  p: 3, 
                  borderLeft: '4px solid #2196F3', 
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  fontStyle: 'italic'
                }}>
                  <Typography variant="body1" sx={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8, 
                    color: '#333'
                  }}>
                    "Technology should serve humanity, not the other way around. Our mission is to make 
                    farming easier, more productive, and more sustainable for every farmer in Maharashtra."
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mt: 2, 
                    color: '#2196F3',
                    fontWeight: 600
                  }}>
                    - Devidas Phapale, Founder & CEO
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </ContentSection>

      {/* Mission and Vision */}
      <ContentSection sx={{ backgroundColor: '#f8f9fa' }}>
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
            Our Mission & Vision
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch' }}>
            <Box sx={{ flex: 1, display: 'flex' }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ width: '100%', display: 'flex' }}
              >
                <MissionVisionCard sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  width: '100%'
                }}>
                  <Flag sx={{ fontSize: '4rem', mb: 3, mx: 'auto' }} />
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    OUR MISSION
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    opacity: 0.95
                  }}>
                    To empower farmers with innovative, reliable electronic solutions that 
                    simplify agricultural operations and increase productivity while maintaining 
                    affordability and exceptional customer support.
                  </Typography>
                </MissionVisionCard>
              </motion.div>
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex' }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ width: '100%', display: 'flex' }}
              >
                <MissionVisionCard sx={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                  color: 'white',
                  width: '100%'
                }}>
                  <Visibility sx={{ fontSize: '4rem', mb: 3, mx: 'auto' }} />
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    OUR VISION
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    opacity: 0.95
                  }}>
                    To become India's most trusted agricultural technology partner, enabling 
                    farmers to achieve maximum efficiency with minimal effort - making complex 
                    operations as simple as "one click."
                  </Typography>
                </MissionVisionCard>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </ContentSection>

      {/* Timeline / Milestones */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa', pb: -10 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 40,
              fontWeight: 700,
              fontSize: { xs: '2.2rem', md: '2.8rem' },
              color: '#333'
            }}
          >
            Our Journey
          </Typography>
          
          <Box sx={{ position: 'relative', height: '650px', mx: 'auto', maxWidth: '1200px' }}>
            <TimelineContainer>
              {milestones.map((milestone, index) => (
                <TimelineItem key={index} position={milestone.position}>
                  <YearBox color={milestone.color}>
                    {milestone.year}
                  </YearBox>
                  
                  <MilestoneContent isTop={milestone.isTop}>
                    {milestone.isTop ? (
                      <MilestoneCardTop>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: milestone.color,
                            mb: 2,
                            fontSize: '1rem',
                            textTransform: 'uppercase'
                          }}
                        >
                          MILESTONE {String(index + 1).padStart(2, '0')}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            lineHeight: 1.5,
                            fontSize: '0.9rem',
                            mb: 3
                          }}
                        >
                          {milestone.description}
                        </Typography>
                        
                        <MilestoneCircle color={milestone.color}>
                          {milestone.icon}
                        </MilestoneCircle>
                      </MilestoneCardTop>
                    ) : (
                      <MilestoneCardBottom>
                        <MilestoneCircle color={milestone.color}>
                          {milestone.icon}
                        </MilestoneCircle>
                        
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: milestone.color,
                            mb: 2,
                            fontSize: '1rem',
                            textTransform: 'uppercase'
                          }}
                        >
                          MILESTONE {String(index + 1).padStart(2, '0')}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            lineHeight: 1.5,
                            fontSize: '0.9rem'
                          }}
                        >
                          {milestone.description}
                        </Typography>
                      </MilestoneCardBottom>
                    )}
                  </MilestoneContent>
                </TimelineItem>
              ))}
            </TimelineContainer>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <ContentSection sx={{ textAlign: 'center', backgroundColor: '#ffffff', py: 4, mt: -15 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                color: '#333'
              }}
            >
              Ready to Transform Your Farm?
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: '#666',
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Discover our innovative agricultural electronic solutions and join thousands of 
              satisfied farmers across Maharashtra.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <CTAButton 
                variant="contained"
                size="medium"
                endIcon={<ShoppingCart />}
                onClick={() => handleNavigation('/products')}
              >
                Explore Products
              </CTAButton>
              
              <CTAButton 
                variant="outlined"
                size="medium"
                endIcon={<ArrowForward />}
                onClick={() => handleNavigation('/contact')}
                sx={{
                  color: '#2196F3',
                  borderColor: '#2196F3',
                  background: 'transparent',
                  '&:hover': {
                    background: '#2196F3',
                    color: 'white',
                  }
                }}
              >
                Contact Us
              </CTAButton>
            </Box>
          </motion.div>
        </Container>
      </ContentSection>
    </Box>
  );
};

export default AboutPage;
