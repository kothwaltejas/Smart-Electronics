import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Box, 
  useMediaQuery, 
  useTheme, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Container, 
  ListItemIcon, 
  Divider,
  Menu as MuiMenu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { 
  ShoppingCart, 
  Menu, 
  Person, 
  Close, 
  Home, 
  Inventory, 
  Info, 
  ContactSupport,
  AccountCircle,
  ExitToApp,
  AdminPanelSettings,
  Dashboard,
  KeyboardArrowDown,
  Assignment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useCart } from '@context/CartProvider';
import { useAuth } from '@context/AuthProvider';
import smartLogo from '../../assets/images/Smart.png';

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  background: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff',
  backdropFilter: scrolled ? 'blur(10px)' : 'none',
  boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  zIndex: theme.zIndex.appBar,
  transition: 'all 0.3s ease-in-out',
  transform: scrolled ? 'translateY(-10px)' : 'translateY(0px)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#333',
  margin: '0 8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const Logo = styled('img')(({ theme }) => ({
  height: '40px',
  marginRight: '12px',
  [theme.breakpoints.down('sm')]: {
    height: '32px',
    marginRight: '8px',
  },
  [theme.breakpoints.down('xs')]: {
    height: '28px',
    marginRight: '6px',
  },
}));

const BrandName = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontWeight: 600,
  fontSize: '1.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '1rem',
  },
}));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scrolling to sections
  const handleNavigateToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
    { text: 'About', icon: <Info />, path: '/about' },
    { text: 'Contact', icon: <ContactSupport />, action: () => handleNavigateToSection('contact') },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleYourOrders = () => {
    handleUserMenuClose();
    navigate('/orders');
  };

  const handleAdminPanel = () => {
    handleUserMenuClose();
    navigate('/admin');
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <>
          <Button
            onClick={handleUserMenuOpen}
            startIcon={
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: user?.role === 'admin' ? '#f44336' : '#1976d2',
                  fontSize: '0.875rem'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            }
            endIcon={<KeyboardArrowDown />}
            sx={{ 
              color: '#333', 
              textTransform: 'none',
              ml: 1
            }}
          >
            {user?.name || 'User'}
            {user?.role === 'admin' && (
              <Chip 
                label="Admin" 
                size="small" 
                color="error" 
                sx={{ ml: 1, fontSize: '0.7rem' }}
              />
            )}
          </Button>
          <MuiMenu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleYourOrders}>
              <Assignment sx={{ mr: 1 }} />
              Your Orders
            </MenuItem>
            {user?.role === 'admin' && (
              <MenuItem onClick={handleAdminPanel}>
                <AdminPanelSettings sx={{ mr: 1 }} />
                Admin Panel
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </MuiMenu>
        </>
      );
    } else {
      return (
        <IconButton 
          color="inherit" 
          sx={{ 
            color: '#333',
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.08)',
            }
          }}
          onClick={() => handleNavigation('/login')}
        >
          <Person />
        </IconButton>
      );
    }
  };

  const renderMobileAuthItems = () => {
    if (isAuthenticated) {
      return (
        <>
          <ListItem 
            button 
            onClick={handleProfile}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Profile
                  {user?.role === 'admin' && (
                    <Chip 
                      label="Admin" 
                      size="small" 
                      color="error" 
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              } 
            />
          </ListItem>
          <ListItem 
            button 
            onClick={handleYourOrders}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Your Orders" />
          </ListItem>
          {user?.role === 'admin' && (
            <ListItem 
              button 
              onClick={handleAdminPanel}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItem>
          )}
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      );
    } else {
      return (
        <ListItem 
          button 
          onClick={() => handleNavigation('/login')}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
      );
    }
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'center' }}>
        <Logo src={smartLogo} alt="Smart Enterprise" sx={{ height: 30 }} />
        <BrandName variant="h6" sx={{ ml: 1 }}>
          Smart Enterprise
        </BrandName>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => item.action ? item.action() : handleNavigation(item.path)}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          button 
          onClick={() => handleNavigation('/cart')}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#333' }}>
            <Badge badgeContent={getTotalItems()} color="error">
              <ShoppingCart />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Cart" />
        </ListItem>
        {renderMobileAuthItems()}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed" scrolled={scrolled}>
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation('/')}
            >
              <Logo src={smartLogo} alt="Smart Enterprise" />
              <BrandName variant="h6">
                Smart Enterprise
              </BrandName>
            </Box>

            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    color: '#333',
                    mr: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    }
                  }}
                  onClick={() => handleNavigation('/cart')}
                >
                  <Badge badgeContent={getTotalItems()} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: '#333',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    }
                  }}
                >
                  <Menu />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <NavButton key={item.text} onClick={() => item.action ? item.action() : handleNavigation(item.path)}>
                    {item.text}
                  </NavButton>
                ))}
                <IconButton 
                  color="inherit" 
                  sx={{ color: '#333' }}
                  onClick={() => handleNavigation('/cart')}
                >
                  <Badge badgeContent={getTotalItems()} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
                {renderAuthButtons()}
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            invisible: false,
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'none',
            }
          }
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: '#ffffff',
            zIndex: (theme) => theme.zIndex.drawer,
          },
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        {drawer}
      </Drawer>
      <Toolbar />
    </>
  );
};

export default Navbar;
