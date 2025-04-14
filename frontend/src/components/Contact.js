import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { 
  ExpandMore, 
  LocationOn, 
  Phone, 
  Email, 
  AccessTime,
  Send,
  Instagram,
  Facebook,
  Twitter
} from '@mui/icons-material';

// FAQ data
const faqData = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. We ensure all transactions are secure and encrypted.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days within the continental United States. Express shipping (1-2 business days) is also available for an additional fee. International shipping times vary by location, but generally take 7-14 business days.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached and original packaging. Some exceptions apply for personal care items and clearance products. Please refer to our Returns page for detailed information.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 40 countries worldwide. International shipping costs and delivery times vary based on location. Import duties and taxes may apply depending on your country\'s regulations.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a confirmation email with tracking information. You can also track your order by logging into your account on our website and viewing your order history.'
  },
  {
    question: 'Are my personal and payment details secure?',
    answer: 'Absolutely. We use industry-standard SSL encryption to protect your personal and payment information. We never store complete credit card details on our servers. Our website is regularly audited for security compliance.'
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer gift wrapping services for a small additional fee. You can select this option during checkout and even include a personalized message for the recipient.'
  },
  {
    question: 'What if my item arrives damaged?',
    answer: 'We\'re sorry to hear that! Please contact our customer service team within 48 hours of receiving your order and provide photos of the damaged item and packaging. We\'ll arrange a replacement or refund as quickly as possible.'
  }
];

// Store information
const storeInfo = [
  {
    icon: <LocationOn fontSize="large" color="primary" />,
    title: 'Address',
    details: [
      '123 E-Commerce Street',
      'Shopping District',
      'New York, NY 10001',
      'United States'
    ]
  },
  {
    icon: <Email fontSize="large" color="primary" />,
    title: 'Email',
    details: [
      'customer.service@eshop.com',
      'support@eshop.com',
      'orders@eshop.com'
    ]
  },
  {
    icon: <Phone fontSize="large" color="primary" />,
    title: 'Phone',
    details: [
      '+1 (555) 123-4567',
      '+1 (555) 987-6543'
    ]
  },
  {
    icon: <AccessTime fontSize="large" color="primary" />,
    title: 'Hours',
    details: [
      'Monday-Friday: 9AM - 6PM EST',
      'Saturday: 10AM - 4PM EST',
      'Sunday: Closed'
    ]
  }
];

const InfoCard = ({ info }) => (
  <Card 
    elevation={0} 
    sx={{ 
      height: '100%', 
      borderRadius: 2, 
      border: '1px solid', 
      borderColor: 'divider',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }
    }}
  >
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Box sx={{ mb: 2 }}>
        {info.icon}
      </Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {info.title}
      </Typography>
      {info.details.map((detail, index) => (
        <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {detail}
        </Typography>
      ))}
    </CardContent>
  </Card>
);

const ContactForm = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formValues.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formValues.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formValues.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formValues.message.trim().length < 20) {
      newErrors.message = 'Message should be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        setFormValues({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 1500);
    }
  };
  
  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };
  
  return (
    <>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Your Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number (Optional)"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject"
                name="subject"
                select
                value={formValues.subject}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.subject)}
                helperText={errors.subject}
              >
                <MenuItem value="general">General Inquiry</MenuItem>
                <MenuItem value="order">Order Status</MenuItem>
                <MenuItem value="returns">Returns & Refunds</MenuItem>
                <MenuItem value="product">Product Information</MenuItem>
                <MenuItem value="feedback">Feedback</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Your Message"
                name="message"
                value={formValues.message}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={6}
                error={Boolean(errors.message)}
                helperText={errors.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                disabled={isSubmitting}
                sx={{ 
                  py: 1.5,
                  fontWeight: 'bold',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </>
  );
};

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Have questions or feedback? We're here to help! Reach out to our team through any of the channels below.
        </Typography>
      </Box>
      
      {/* Contact Information Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {storeInfo.map((info, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <InfoCard info={info} />
          </Grid>
        ))}
      </Grid>
      
      {/* Contact Form Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Send Us a Message
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <ContactForm />
      </Box>
      
      {/* FAQ Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Box>
          {faqData.map((faq, index) => (
            <Accordion 
              key={index} 
              elevation={0}
              sx={{ 
                mb: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: '8px !important',
                '&:before': {
                  display: 'none'
                },
                overflow: 'hidden'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ 
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  fontWeight: 'bold'
                }}
              >
                <Typography fontWeight="medium">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
      
      {/* Social Media Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Connect With Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Follow us on social media for the latest updates, promotions, and more!
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Facebook />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Instagram />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Instagram
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Twitter />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Twitter
          </Button>
        </Box>
      </Box>
      
      {/* Map Section */}
      <Box sx={{ mb: 0 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Store Location
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Paper 
          elevation={2} 
          sx={{ 
            height: 400, 
            borderRadius: 2, 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573862687!2d-73.9910086!3d40.7518358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0x999668d0d7c3fd7d!2s123%20W%2034th%20St%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1655125257207!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="E-Shop Store Location"
          ></iframe>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contact; 