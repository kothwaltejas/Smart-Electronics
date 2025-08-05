import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import smartLogo from '../../assets/images/Smart.png';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
});

const LogoContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
});

const Logo = styled('img')({
  width: '120px',
  height: 'auto',
  animation: `${pulse} 2s ease-in-out infinite`,
});

const LoadingRing = styled(CircularProgress)({
  position: 'absolute',
  color: '#2196F3',
  animation: `${rotate} 1.5s linear infinite`,
});

const LoadingScreen = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <LoadingContainer>
      <LogoContainer>
        <LoadingRing size={140} thickness={2} />
        <Logo src={smartLogo} alt="Smart Enterprises" />
      </LogoContainer>
    </LoadingContainer>
  );
};

export default LoadingScreen;
