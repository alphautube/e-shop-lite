import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  ShoppingCart, 
  LocalShipping, 
  Payment, 
  Check, 
  ArrowBack, 
  CreditCard,
  AccountBalance,
  CreditCardOff
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const steps = ['Shopping Cart', 'Shipping', 'Payment', 'Confirmation'];

const PaymentMethods = [
  { 
    id: 'credit-card',
    title: 'Credit Card',
    icon: <CreditCard />,
    description: 'Pay with Visa, Mastercard, or American Express'
  },
  { 
    id: 'bank-transfer',
    title: 'Bank Transfer',
    icon: <AccountBalance />,
    description: 'Direct bank transfer'
  },
  { 
    id: 'cash-on-delivery',
    title: 'Cash on Delivery',
    icon: <CreditCardOff />,
    description: 'Pay when you receive your order'
  }
];

const ShippingMethods = [
  { id: 'standard', title: 'Standard Shipping', price: 5.99, days: '3-5' },
  { id: 'express', title: 'Express Shipping', price: 12.99, days: '1-2' },
  { id: 'free', title: 'Free Shipping', price: 0, days: '5-7' }
];

const Checkout = ({ onBackToShopping, onOrderComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: ''
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { items, getCartTotal, clearCart } = useCart();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Handle order completion
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onBackToShopping();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInfoChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateShippingInfo = () => {
    // Basic validation for demo purposes
    return Object.values(shippingInfo).every(value => value.trim() !== '');
  };

  const validatePaymentInfo = () => {
    // For demo purposes, only validate if credit card is selected
    if (paymentMethod === 'credit-card') {
      return Object.values(cardInfo).every(value => value.trim() !== '');
    }
    return true;
  };
  
  const handlePlaceOrder = () => {
    setOrderProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setOrderProcessing(false);
      setOrderComplete(true);
      
      // Generate a random order number
      const orderNum = Math.floor(100000000 + Math.random() * 900000000).toString();
      setOrderNumber(orderNum);
      
      // Clear the cart
      clearCart();
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Your order has been placed successfully!',
        severity: 'success'
      });
      
      // Move to confirmation step
      setActiveStep(steps.length - 1);
      
      // Notify parent component of order completion after a delay
      setTimeout(() => {
        if (onOrderComplete) {
          onOrderComplete(orderNum);
        }
      }, 3000);
    }, 2000);
  };

  const getShippingFee = () => {
    const selectedMethod = ShippingMethods.find(method => method.id === shippingMethod);
    return selectedMethod ? selectedMethod.price : 0;
  };

  const getTotal = () => {
    return getCartTotal() + getShippingFee();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: // Shopping Cart
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Cart
            </Typography>
            {items.length === 0 ? (
              <Alert severity="info" sx={{ my: 2 }}>
                Your cart is empty
              </Alert>
            ) : (
              <>
                <List>
                  {items.map(item => (
                    <ListItem key={item.id} divider>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} sm={2}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '100%', borderRadius: 4 }}
                          />
                        </Grid>
                        <Grid item xs={5} sm={6}>
                          <ListItemText 
                            primary={item.name} 
                            secondary={`Quantity: ${item.quantity}`}
                          />
                        </Grid>
                        <Grid item xs={4} sm={4} sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" fontWeight="bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="body1">Subtotal</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1">${getCartTotal().toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Continue Shopping
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<LocalShipping />}
                onClick={handleNext}
                disabled={items.length === 0}
              >
                Proceed to Shipping
              </Button>
            </Box>
          </Box>
        );
        
      case 1: // Shipping
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First name"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="state"
                  name="state"
                  label="State/Province/Region"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zip"
                  name="zip"
                  label="Zip / Postal code"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.zip}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Shipping Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="shipping-method"
                name="shipping-method"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                {ShippingMethods.map((method) => (
                  <Paper 
                    key={method.id}
                    elevation={shippingMethod === method.id ? 3 : 1}
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: shippingMethod === method.id ? '1px solid #1976d2' : '1px solid transparent',
                      borderRadius: 1
                    }}
                  >
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1">{method.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Delivery in {method.days} business days
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="primary">
                            {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<Payment />}
                onClick={handleNext}
                disabled={!validateShippingInfo()}
              >
                Proceed to Payment
              </Button>
            </Box>
          </Box>
        );
        
      case 2: // Payment
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PaymentMethods.map((method) => (
                  <Paper 
                    key={method.id}
                    elevation={paymentMethod === method.id ? 3 : 1}
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: paymentMethod === method.id ? '1px solid #1976d2' : '1px solid transparent',
                      borderRadius: 1
                    }}
                  >
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 2 }}>
                            {method.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">{method.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'credit-card' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Card Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardName"
                      name="cardName"
                      label="Name on Card"
                      fullWidth
                      variant="outlined"
                      value={cardInfo.cardName}
                      onChange={handlePaymentInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardNumber"
                      name="cardNumber"
                      label="Card Number"
                      fullWidth
                      variant="outlined"
                      placeholder="**** **** **** ****"
                      value={cardInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="expiry"
                      name="expiry"
                      label="Expiry Date"
                      fullWidth
                      variant="outlined"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={handlePaymentInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={cardInfo.cvv}
                      onChange={handlePaymentInfoChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography>Subtotal:</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <Typography>${getCartTotal().toFixed(2)}</Typography>
                </Grid>
                
                <Grid item xs={8}>
                  <Typography>Shipping:</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <Typography>
                    {getShippingFee() === 0 ? 'FREE' : `$${getShippingFee().toFixed(2)}`}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={8}>
                  <Typography variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary">
                    ${getTotal().toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Shipping
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                disabled={!validatePaymentInfo() || orderProcessing}
                startIcon={orderProcessing ? <CircularProgress size={20} color="inherit" /> : <Check />}
              >
                {orderProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </Box>
          </Box>
        );
        
      case 3: // Confirmation
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Check sx={{ fontSize: 60, color: 'success.main' }} />
            </Box>
            <Typography variant="h4" gutterBottom>
              Thank You For Your Order!
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Order #{orderNumber}
            </Typography>
            <Typography variant="body1" paragraph>
              We've received your order and will begin processing it right away.
              You will receive an email confirmation shortly.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Expected delivery: 
              {ShippingMethods.find(m => m.id === shippingMethod)?.days} business days
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => onOrderComplete(orderNumber)}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {getStepContent(activeStep)}
        </Box>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout; 