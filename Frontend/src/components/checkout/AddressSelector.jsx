import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Chip,
  Alert,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn,
  Home as HomeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from '../../api/axios';
import { useNotification } from '../../context/NotificationProvider';

const AddressCard = styled(Card)(({ theme, selected }) => ({
  position: 'relative',
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
  background: selected ? theme.palette.primary.main + '08' : theme.palette.background.paper,
}));

const AddressLabel = styled(Chip)(({ theme, label }) => {
  const getColor = () => {
    switch (label?.toLowerCase()) {
      case 'home': return { bg: '#e8f5e8', color: '#2e7d32' };
      case 'work': return { bg: '#e3f2fd', color: '#1976d2' };
      case 'office': return { bg: '#e3f2fd', color: '#1976d2' };
      default: return { bg: '#f3e5f5', color: '#7b1fa2' };
    }
  };
  
  const colors = getColor();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 500,
    fontSize: '0.75rem'
  };
});

const AddressSelector = ({ selectedAddress, onAddressSelect, onAddressChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
        // Auto-select default address or first address
        const defaultAddr = response.data.data.find(addr => addr.isDefault) || response.data.data[0];
        if (defaultAddr && !selectedAddress) {
          onAddressSelect(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showNotification('Error loading addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      label: 'Home',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India',
      isDefault: addresses.length === 0
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({ ...address });
    setErrors({});
    setDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await axios.delete(`/auth/addresses/${addressId}`);
        if (response.data.success) {
          showNotification('Address deleted successfully', 'success');
          fetchAddresses();
          // If deleted address was selected, clear selection
          if (selectedAddress && selectedAddress._id === addressId) {
            onAddressSelect(null);
          }
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        showNotification('Error deleting address', 'error');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN code is required';
    if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = 'PIN code must be 6 digits';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter valid 10-digit phone number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      let response;
      
      if (editingAddress) {
        response = await axios.put(`/auth/addresses/${editingAddress._id}`, formData);
      } else {
        response = await axios.post('/auth/addresses', formData);
      }

      if (response.data.success) {
        showNotification(
          editingAddress ? 'Address updated successfully' : 'Address added successfully',
          'success'
        );
        setDialogOpen(false);
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showNotification('Error saving address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await axios.put(`/auth/addresses/${addressId}/default`);
      if (response.data.success) {
        showNotification('Default address updated', 'success');
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      showNotification('Error updating default address', 'error');
    }
  };

  const getAddressIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'home': return <HomeIcon fontSize="small" />;
      case 'work':
      case 'office': return <BusinessIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Select Delivery Address
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          sx={{ borderRadius: 2 }}
        >
          Add New Address
        </Button>
      </Box>

      {addresses.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No addresses found. Please add a delivery address to continue.
        </Alert>
      ) : (
        <RadioGroup
          value={selectedAddress?._id || ''}
          onChange={(e) => {
            const selected = addresses.find(addr => addr._id === e.target.value);
            onAddressSelect(selected);
          }}
        >
          <Grid container spacing={2}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address._id}>
                <AddressCard selected={selectedAddress?._id === address._id}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <FormControlLabel
                        value={address._id}
                        control={<Radio size="small" />}
                        label=""
                        sx={{ m: 0, mr: 1 }}
                      />
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AddressLabel
                            label={address.label}
                            icon={getAddressIcon(address.label)}
                            size="small"
                          />
                          {address.isDefault && (
                            <Chip
                              label="Default"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                          {address.fullName}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {address.address}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {address.city}, {address.state} - {address.pinCode}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Phone: {address.phone}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditAddress(address)}
                            sx={{ minWidth: 'auto', px: 1 }}
                          >
                            Edit
                          </Button>
                          
                          {!address.isDefault && (
                            <Button
                              size="small"
                              onClick={() => handleSetDefault(address._id)}
                              sx={{ minWidth: 'auto', px: 1 }}
                            >
                              Set Default
                            </Button>
                          )}
                          
                          {addresses.length > 1 && (
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteAddress(address._id)}
                              sx={{ minWidth: 'auto', px: 1 }}
                            >
                              Delete
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </AddressCard>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Address Label</InputLabel>
                <Select
                  value={formData.label}
                  label="Address Label"
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                >
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Work">Work</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  label="State"
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  {indianStates.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {errors.state}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PIN Code"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                error={!!errors.pinCode}
                helperText={errors.pinCode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveAddress}
            disabled={loading}
          >
            {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressSelector;
