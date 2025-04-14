import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider, 
  Avatar, 
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  CheckCircleOutline, 
  StorefrontOutlined, 
  LocalShippingOutlined, 
  HeadsetMicOutlined, 
  SecurityOutlined,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn
} from '@mui/icons-material';

// Team members data
const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Sarah founded E-Shop in 2015 with a vision to create a seamless online shopping experience.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop'
  },
  {
    name: 'David Chen',
    role: 'Chief Technology Officer',
    bio: 'David leads our tech team and ensures the website provides a smooth user experience.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop'
  },
  {
    name: 'Priya Patel',
    role: 'Head of Customer Experience',
    bio: 'Priya works tirelessly to make sure every customer has a positive shopping experience.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop'
  },
  {
    name: 'Marcus Williams',
    role: 'Product Manager',
    bio: 'Marcus ensures our catalog features only the best products from trusted suppliers.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop'
  }
];

// Company milestones
const milestones = [
  {
    year: '2015',
    title: 'E-Shop Founded',
    description: 'Started as a small online store with just 50 products.'
  },
  {
    year: '2017',
    title: 'Expansion',
    description: 'Expanded our product catalog to include over 1,000 items across multiple categories.'
  },
  {
    year: '2019',
    title: 'Mobile App Launch',
    description: 'Launched our mobile app for iOS and Android, making shopping on-the-go even easier.'
  },
  {
    year: '2020',
    title: 'International Shipping',
    description: 'Started shipping to international customers in over 40 countries worldwide.'
  },
  {
    year: '2022',
    title: 'Customer Milestone',
    description: 'Reached 1 million happy customers and expanded our team to 100 employees.'
  },
  {
    year: '2023',
    title: 'AI Recommendations',
    description: 'Implemented AI-powered product recommendations for a personalized shopping experience.'
  }
];

// Values list
const companyValues = [
  {
    title: 'Customer First',
    description: 'Our customers are at the heart of everything we do.',
    icon: <HeadsetMicOutlined fontSize="large" color="primary" />
  },
  {
    title: 'Quality Products',
    description: 'We rigorously test and curate our product selection.',
    icon: <CheckCircleOutline fontSize="large" color="primary" />
  },
  {
    title: 'Fast & Reliable Shipping',
    description: 'We ensure your purchases arrive safely and on time.',
    icon: <LocalShippingOutlined fontSize="large" color="primary" />
  },
  {
    title: 'Secure Transactions',
    description: 'Your payment and personal information are always protected.',
    icon: <SecurityOutlined fontSize="large" color="primary" />
  }
];

const TeamMember = ({ member }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    borderRadius: 2,
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
    }
  }}>
    <CardMedia
      component="img"
      height="250"
      image={member.image}
      alt={member.name}
      sx={{ objectFit: 'cover' }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
        {member.name}
      </Typography>
      <Typography variant="subtitle1" color="primary" gutterBottom>
        {member.role}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {member.bio}
      </Typography>
    </CardContent>
  </Card>
);

const Milestone = ({ milestone, isLast }) => (
  <Box sx={{ mb: isLast ? 0 : 4, display: 'flex' }}>
    <Box sx={{ 
      mr: 3, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <Avatar 
        sx={{ 
          bgcolor: 'primary.main', 
          width: 60, 
          height: 60, 
          fontSize: '1.2rem',
          fontWeight: 'bold' 
        }}
      >
        {milestone.year}
      </Avatar>
      {!isLast && (
        <Box 
          sx={{ 
            width: 2, 
            bgcolor: 'divider', 
            flexGrow: 1, 
            mt: 1 
          }} 
        />
      )}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight="bold">
        {milestone.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {milestone.description}
      </Typography>
    </Box>
  </Box>
);

const CompanyValue = ({ value }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          {value.icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {value.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value.description}
        </Typography>
      </Box>
    </Paper>
  </Grid>
);

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 8,
          position: 'relative'
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          About E·Shop
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          We're on a mission to make shopping simple, enjoyable, and accessible to everyone.
        </Typography>
        <Box 
          component="img" 
          src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=1200&auto=format&fit=crop" 
          alt="E-Shop Team"
          sx={{ 
            width: '100%', 
            height: 400, 
            objectFit: 'cover', 
            borderRadius: 4,
            mb: 2 
          }}
        />
      </Box>

      {/* Our Story Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Story
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              E-Shop was founded in 2015 with a simple idea: to create an online marketplace where customers could find quality products at competitive prices, all while enjoying a seamless shopping experience.
            </Typography>
            <Typography variant="body1" paragraph>
              What started as a small operation has grown into a thriving e-commerce platform with thousands of products across multiple categories. Our journey has been driven by our passion for connecting customers with products they love.
            </Typography>
            <Typography variant="body1">
              Today, we serve customers worldwide, offering fast shipping, secure payments, and exceptional customer service. We continue to innovate and expand our offerings to meet the evolving needs of our growing customer base.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              component="img" 
              src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=600&auto=format&fit=crop" 
              alt="Team Working"
              sx={{ 
                width: '100%', 
                borderRadius: 2,
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Our Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Values
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          {companyValues.map((value, index) => (
            <CompanyValue key={index} value={value} />
          ))}
        </Grid>
      </Box>

      {/* Milestones Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Journey
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ pl: 2 }}>
          {milestones.map((milestone, index) => (
            <Milestone 
              key={index} 
              milestone={milestone} 
              isLast={index === milestones.length - 1} 
            />
          ))}
        </Box>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Meet Our Team
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TeamMember member={member} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact CTA Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          bgcolor: 'primary.light', 
          color: 'primary.contrastText',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Want to know more about us?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
          Whether you have questions about our products, shipping, or just want to say hello, we'd love to hear from you!
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          href="#/contact"
          sx={{ 
            px: 4, 
            py: 1,
            fontWeight: 'bold'
          }}
        >
          Contact Us
        </Button>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <Facebook />
          </Avatar>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <Instagram />
          </Avatar>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <Twitter />
          </Avatar>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <LinkedIn />
          </Avatar>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 