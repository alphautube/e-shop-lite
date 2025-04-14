import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Collapse,
  Paper
} from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

// Sample promo codes (in a real app, these would be validated on the server)
const VALID_PROMO_CODES = [
  { code: 'WELCOME10', discount: 0.1, type: 'percentage', description: '10% off your order' },
  { code: 'SAVE20', discount: 0.2, type: 'percentage', description: '20% off your order' },
  { code: 'FREESHIPPING', discount: 5.99, type: 'fixed', description: 'Free standard shipping' },
  { code: 'SUMMER25', discount: 0.25, type: 'percentage', description: '25% off your summer purchase' }
];

const PromoCodeInput = ({ onApplyPromo, onRemovePromo, appliedPromo }) => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPromos, setShowPromos] = useState(false);
  
  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value.toUpperCase());
    if (error) setError('');
  };
  
  const handleApplyPromoCode = () => {
    if (!promoCode) {
      setError('Please enter a promo code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call to validate promo code
    setTimeout(() => {
      const validPromo = VALID_PROMO_CODES.find(
        promo => promo.code === promoCode.trim()
      );
      
      if (validPromo) {
        onApplyPromo(validPromo);
        setPromoCode('');
      } else {
        setError('Invalid or expired promo code');
      }
      
      setLoading(false);
    }, 800);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyPromoCode();
    }
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setShowPromos(!showPromos)}
        >
          <LocalOffer fontSize="small" sx={{ mr: 1 }} />
          {appliedPromo ? 'Applied Promo Code' : 'Have a promo code?'}
        </Typography>
        
        <Button 
          size="small" 
          sx={{ ml: 'auto' }}
          onClick={() => setShowPromos(!showPromos)}
        >
          {showPromos ? 'Hide' : 'Apply'}
        </Button>
      </Box>
      
      <Collapse in={showPromos || appliedPromo}>
        {appliedPromo ? (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => onRemovePromo()}
          >
            <Typography variant="body2">
              <strong>{appliedPromo.code}</strong> - {appliedPromo.description}
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', mb: error ? 1 : 2 }}>
            <TextField
              placeholder="Enter promo code"
              value={promoCode}
              onChange={handlePromoCodeChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              fullWidth
              disabled={loading}
              error={!!error}
              helperText={error}
              inputProps={{
                style: { textTransform: 'uppercase' }
              }}
            />
            <Button
              variant="contained"
              onClick={handleApplyPromoCode}
              disabled={loading || !promoCode}
              sx={{ ml: 1, minWidth: 100 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Apply'}
            </Button>
          </Box>
        )}
        
        {!appliedPromo && showPromos && (
          <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Available Promo Codes:
            </Typography>
            {VALID_PROMO_CODES.map((promo) => (
              <Box 
                key={promo.code} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}
              >
                <Box>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold" 
                    component="span"
                    sx={{ mr: 1 }}
                  >
                    {promo.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="span">
                    {promo.description}
                  </Typography>
                </Box>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {
                    setPromoCode(promo.code);
                    handleApplyPromoCode();
                  }}
                >
                  Use
                </Button>
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Note: These are demo promo codes that you can use for testing.
            </Typography>
          </Paper>
        )}
      </Collapse>
    </Box>
  );
};

export default PromoCodeInput; 