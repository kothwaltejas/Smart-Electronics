import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import axios from '@api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.post('/auth/forgot-password', { email });
      setSuccess('If this email is registered, a password reset link has been sent.');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" mb={2}>Forgot Password</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} required margin="normal" />
          <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={20} /> : 'Send Reset Link'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
