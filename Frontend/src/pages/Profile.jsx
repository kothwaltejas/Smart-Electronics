import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Alert,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  VerifiedUser
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '@context/AuthProvider';
import { useNotification } from '@context/NotificationProvider';

const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4)
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2, 2, 0, 0),
  textAlign: 'center'
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  border: '4px solid white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  fontSize: '2rem',
  fontWeight: 'bold'
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiCardContent-root': {
    padding: theme.spacing(3)
  }
}));

const EditButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 500
}));

const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 500,
  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #43a047 30%, #5cb85c 90%)'
  }
}));

const Profile = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  const { showNotification } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profileData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (profileData.phone && !/^[0-9]{10}$/.test(profileData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (profileData.address.zipCode && !/^[0-9]{6}$/.test(profileData.address.zipCode)) {
      newErrors['address.zipCode'] = 'ZIP code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, number and special character';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    const result = await updateProfile(profileData);
    
    if (result.success) {
      setIsEditing(false);
      showNotification('Profile updated successfully! ✅', 'success');
    } else {
      showNotification(result.error || 'Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showNotification('Password changed successfully! 🔒', 'success');
    } else {
      showNotification(result.error || 'Failed to change password', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      });
    }
    setErrors({});
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <ProfileContainer maxWidth="md">
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <ProfileHeader>
          <StyledAvatar>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(user.name)
            )}
          </StyledAvatar>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {user.name}
          </Typography>
          <Box display="flex" justifyContent="center" gap={1} mb={1}>
            <Chip
              icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
              label={user.role === 'admin' ? 'Administrator' : 'User'}
              color={user.role === 'admin' ? 'warning' : 'default'}
              variant="filled"
              sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
            {user.isEmailVerified && (
              <Chip
                icon={<VerifiedUser />}
                label="Verified"
                color="success"
                variant="filled"
                sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
              />
            )}
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        </ProfileHeader>

        <Box p={3}>
          {/* Basic Information */}
          <InfoCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Basic Information
                </Typography>
                {!isEditing && (
                  <EditButton
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                  >
                    Edit
                  </EditButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing || isLoading}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={user.email}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing || isLoading}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box display="flex" gap={2} mt={3}>
                  <SaveButton
                    startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    variant="contained"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </SaveButton>
                  <Button
                    startIcon={<Cancel />}
                    onClick={handleCancelEdit}
                    variant="outlined"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </InfoCard>

          {/* Address Information */}
          <InfoCard>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Address Information
              </Typography>

              {!isEditing && (
                <Box mb={2} p={2} sx={{ backgroundColor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
                  {profileData.address.street || profileData.address.city || profileData.address.state || profileData.address.zipCode ? (
                    <Box>
                      {profileData.address.street && (
                        <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
                          {profileData.address.street}
                        </Typography>
                      )}
                      <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                        {profileData.address.city && (
                          <Typography variant="body2" color="text.secondary">
                            {profileData.address.city}
                          </Typography>
                        )}
                        {profileData.address.city && profileData.address.state && (
                          <Typography variant="body2" color="text.secondary">•</Typography>
                        )}
                        {profileData.address.state && (
                          <Typography variant="body2" color="text.secondary">
                            {profileData.address.state}
                          </Typography>
                        )}
                        {(profileData.address.city || profileData.address.state) && profileData.address.zipCode && (
                          <Typography variant="body2" color="text.secondary">•</Typography>
                        )}
                        {profileData.address.zipCode && (
                          <Typography variant="body2" color="text.secondary">
                            {profileData.address.zipCode}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No address provided
                    </Typography>
                  )}
                </Box>
              )}

              {isEditing && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Landmark / Building / Street"
                      name="address.street"
                      value={profileData.address.street}
                      onChange={handleProfileChange}
                      disabled={!isEditing || isLoading}
                      placeholder="Enter landmark, building name, or street address"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="address.city"
                      value={profileData.address.city}
                      onChange={handleProfileChange}
                      disabled={!isEditing || isLoading}
                      placeholder="Enter city"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="address.state"
                      value={profileData.address.state}
                      onChange={handleProfileChange}
                      disabled={!isEditing || isLoading}
                      placeholder="Enter state"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      name="address.zipCode"
                      value={profileData.address.zipCode}
                      onChange={handleProfileChange}
                      disabled={!isEditing || isLoading}
                      placeholder="Enter 6-digit pincode"
                      inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                      error={!!errors['address.zipCode']}
                      helperText={errors['address.zipCode'] || 'Enter 6-digit pincode'}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </InfoCard>

          {/* Password Change */}
          <InfoCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Security
                </Typography>
                {!isChangingPassword && (
                  <EditButton
                    startIcon={<Lock />}
                    onClick={() => setIsChangingPassword(true)}
                    variant="outlined"
                  >
                    Change Password
                  </EditButton>
                )}
              </Box>

              {isChangingPassword && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('current')}
                              edge="end"
                            >
                              {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('new')}
                              edge="end"
                            >
                              {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('confirm')}
                              edge="end"
                            >
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                      <SaveButton
                        startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        variant="contained"
                      >
                        {isLoading ? 'Changing...' : 'Change Password'}
                      </SaveButton>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancelPassword}
                        variant="outlined"
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {!isChangingPassword && (
                <Typography variant="body2" color="textSecondary">
                  Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                </Typography>
              )}
            </CardContent>
          </InfoCard>
        </Box>
      </Paper>
    </ProfileContainer>
  );
};

export default Profile;
