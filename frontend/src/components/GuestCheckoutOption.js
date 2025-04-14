import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Collapse,
  Alert
} from '@mui/material';
import { AccountCircle, Person, PersonOutline } from '@mui/icons-material';

const GuestCheckoutOption = ({ onContinue }) => {
  const [checkoutMethod, setCheckoutMethod] = useState('guest');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };
  
  const handleContinue = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (!termsAccepted) {
      return;
    }
    
    onContinue({
      email,
      method: checkoutMethod
    });
  };
  
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Continue as Guest or Sign In
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            mb: 2,
            p: 2,
            border: '1px solid',
            borderColor: checkoutMethod === 'guest' ? 'primary.main' : 'divider',
            borderRadius: 1,
            bgcolor: checkoutMethod === 'guest' ? 'primary.light' : 'background.paper',
            cursor: 'pointer'
          }}
          onClick={() => setCheckoutMethod('guest')}
        >
          <PersonOutline fontSize="large" sx={{ mr: 2, color: checkoutMethod === 'guest' ? 'primary.dark' : 'text.secondary' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color={checkoutMethod === 'guest' ? 'primary.dark' : 'text.primary'}>
              Guest Checkout
            </Typography>
            <Typography variant="body2" color={checkoutMethod === 'guest' ? 'primary.dark' : 'text.secondary'}>
              No account needed. You can create an account later if you wish.
            </Typography>
          </Box>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            p: 2,
            border: '1px solid',
            borderColor: checkoutMethod === 'login' ? 'primary.main' : 'divider',
            borderRadius: 1,
            bgcolor: checkoutMethod === 'login' ? 'primary.light' : 'background.paper',
            cursor: 'pointer'
          }}
          onClick={() => setCheckoutMethod('login')}
        >
          <AccountCircle fontSize="large" sx={{ mr: 2, color: checkoutMethod === 'login' ? 'primary.dark' : 'text.secondary' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color={checkoutMethod === 'login' ? 'primary.dark' : 'text.primary'}>
              Sign In
            </Typography>
            <Typography variant="body2" color={checkoutMethod === 'login' ? 'primary.dark' : 'text.secondary'}>
              Use your account for faster checkout and access to order history.
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Collapse in={checkoutMethod === 'guest'}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Enter your email to continue
          </Typography>
          <TextField 
            fullWidth
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 2 }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            We'll use this email address to send your order confirmation and updates.
          </Alert>
          <FormControlLabel
            control={
              <Checkbox 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)} 
              />
            }
            label="I agree to the Terms of Service and Privacy Policy"
          />
        </Box>
      </Collapse>
      
      <Collapse in={checkoutMethod === 'login'}>
        <Alert severity="info" sx={{ mb: 2 }}>
          This is a demo app. Sign in functionality is not implemented yet.
          Please use the Guest Checkout option to continue.
        </Alert>
      </Collapse>
      
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleContinue}
        disabled={(checkoutMethod === 'guest' && (!email || !termsAccepted)) || checkoutMethod === 'login'}
      >
        Continue to Checkout
      </Button>
    </Paper>
  );
};

export default GuestCheckoutOption; 