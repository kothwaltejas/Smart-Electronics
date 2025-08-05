import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

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
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
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

const AboutPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f7',
      pt: { xs: 10, md: 12 } // Add top padding for navbar
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          align="center"
          sx={{
            mb: { xs: 3, md: 6 },
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
            color: '#333'
          }}
        >
          About Smart Electronics
        </Typography>
        
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: { xs: 4, md: 8 },
            opacity: 0.9,
            fontSize: { xs: '1.1rem', md: '1.5rem' },
            lineHeight: 1.6,
            maxWidth: '900px',
            mx: 'auto',
            color: '#666'
          }}
        >
          We are a leading provider of innovative electronic solutions, specializing in smart automation systems, 
          digital starters, and cutting-edge technology for modern homes and industries.
        </Typography>

        {/* Founder and Description Section */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <FounderCard>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#d32f2f', mb: 3, fontSize: '1.8rem' }}>
                  FOUNDER
                </Typography>
                <Box
                  sx={{
                    width: 220,
                    height: 220,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid black',
                    transition: 'transform 1s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/src/assets/images/founder.jpg"
                    alt="Founder"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#d32f2f', fontSize: '1.5rem' }}>
                  DEVIDAS PHAPALE
                </Typography>
              </Box>
            </FounderCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '16px', 
              background: '#ffffff', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '2px solid rgba(33, 150, 243, 0.1)'
            }}>
              <Typography variant="body1" sx={{ 
                fontSize: '1.3rem', 
                lineHeight: 1.6, 
                color: '#1a1a2e',
                fontWeight: 500,
                textAlign: 'justify',
                fontFamily: 'serif'
              }}>
                The founder, hailing from a modest background in Lingdev village, Akole Taluka, transitioned from humble beginnings to success in the electronics sector through perseverance and innovation. Inspired by his roots, he developed products tailored to enhance the lives of farmers and bring pride to his family and the agricultural community. Today, the company boasts a diverse product line with distinctive features aimed at revolutionizing farming practices. We believe in leveraging innovative solutions and digital tools to empower farmers, optimize processes, increase efficiency and ultimately enhance food production.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Vision Description */}
        <Paper sx={{ 
          p: 5, 
          mb: 6,
          borderRadius: '16px', 
          background: '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '2px solid rgba(33, 150, 243, 0.1)'
        }}>
          <Typography variant="body1" sx={{ 
            fontSize: '1.3rem', 
            lineHeight: 1.8, 
            color: '#1a1a2e',
            textAlign: 'justify',
            fontFamily: 'serif'
          }}>
            The vision of simplifying the hard work of farmers through technological advancements is a noble and crucial goal in today's agricultural landscape. By leveraging innovative solutions and digital tools, we can empower farmers to optimize their processes, increase efficiency, and ultimately enhance food production.
            <br /><br />
            One key aspect of this vision is the concept of streamlining agricultural practices "on one click." This implies the development of user-friendly platforms or applications that enable farmers to access information, resources, and support with ease and convenience. Through the integration of data analytics, automation, and connectivity, farmers can make informed decisions, monitor their operations in real time, and address challenges promptly.
            <br /><br />
            Furthermore, by embracing technologies such as precision agriculture, Internet of Things (IoT) devices, Automatic Starters, and Cyclic Timers farmers can revolutionize traditional farming methods and achieve higher yields with less manual labor. These tools provide valuable insights into Water consumption, crop conditions, Electricity Patterns, and pest management, allowing farmers to adopt proactive strategies and optimize resource allocation.
            <br /><br />
            In essence, the vision of simplifying the hard work of farmers through a single click embodies the commitment to harnessing innovation for the betterment of agriculture. By providing farmers with intuitive solutions that enhance productivity, sustainability, and profitability, we can support their vital role in feeding the world's population while ensuring environmental stewardship.
          </Typography>
        </Paper>

        {/* Mission and Vision Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <MissionVisionCard>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#d32f2f', mb: 3, fontSize: '1.8rem' }}>
                OUR MISSION
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box
                  component="img"
                  src="/src/assets/images/mission.png"
                  alt="Mission"
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: 'contain',
                    mx: 'auto',
                    display: 'block',
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: '1.2rem', 
                color: '#1a1a2e', 
                lineHeight: 1.6,
                fontFamily: 'serif'
              }}>
                The mission is to empower emerging farmers by providing them with cutting-edge technologies to simplify their daily operations.
              </Typography>
            </MissionVisionCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <MissionVisionCard>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#d32f2f', mb: 3, fontSize: '1.8rem' }}>
                OUR VISION
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box
                  component="img"
                  src="/src/assets/images/vision.png"
                  alt="Vision"
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: 'contain',
                    mx: 'auto',
                    display: 'block',
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: '1.2rem', 
                color: '#1a1a2e', 
                lineHeight: 1.6,
                fontFamily: 'serif'
              }}>
                The vision is to streamline agricultural tasks with the click of a button, recognizing farmers as essential food producers who deserve efficiency and ease in their work.
              </Typography>
            </MissionVisionCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;
