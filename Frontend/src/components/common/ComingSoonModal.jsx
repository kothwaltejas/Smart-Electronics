import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import { Close, ShoppingCart, Build, Timeline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    padding: theme.spacing(2),
    maxWidth: '500px',
    width: '90%',
    margin: 'auto',
  },
}));

const ComingSoonModal = ({ open, onClose }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="coming-soon-title"
      aria-describedby="coming-soon-description"
    >
      <DialogTitle 
        id="coming-soon-title"
        sx={{ 
          textAlign: 'center', 
          pb: 1,
          position: 'relative'
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 2,
          mt: 1
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            borderRadius: '50%',
            p: 2,
            animation: 'pulse 2s infinite'
          }}>
            <Build sx={{ fontSize: '2.5rem', color: 'white' }} />
          </Box>
        </Box>
        
        <Typography 
          variant="h5" 
          fontWeight={700}
          sx={{ 
            color: '#333',
            mb: 1
          }}
        >
          🚀 Coming Soon!
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', pt: 0 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#2196F3',
            mb: 2,
            fontWeight: 600
          }}
        >
          Add to Cart Feature
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#555',
            lineHeight: 1.6,
            mb: 2
          }}
        >
          We're working hard to bring you an enhanced shopping experience! 
          Our new cart functionality will include:
        </Typography>
        
        <Box sx={{ 
          textAlign: 'left', 
          mb: 3,
          bgcolor: '#f8f9fa',
          borderRadius: '12px',
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ShoppingCart sx={{ color: '#2196F3', mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="body2">Enhanced cart management</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Timeline sx={{ color: '#2196F3', mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="body2">Improved order tracking</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Build sx={{ color: '#2196F3', mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="body2">Better user experience</Typography>
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            fontStyle: 'italic'
          }}
        >
          You can directly contact to shop owner.
          Thank you for your patience! 🙏
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pt: 1, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            borderRadius: '25px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #1976D2 0%, #1BA5D8 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            }
          }}
        >
          Got it! 👍
        </Button>
      </DialogActions>
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </StyledDialog>
  );
};

export default ComingSoonModal;
