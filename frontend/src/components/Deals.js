import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Chip, 
  Paper,
  Rating,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import { ShoppingCart, Favorite, AccessTime, LocalOffer } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Sample deals data
const dealData = [
  {
    id: 101,
    name: 'Flash Sale: Wireless Headphones',
    description: 'Limited time offers with massive discounts on premium headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop',
    products: [
      {
        id: 1001,
        name: 'Sony WH-1000XM4',
        originalPrice: 349.99,
        currentPrice: 248.99,
        discountPercentage: 29,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&auto=format&fit=crop',
        rating: 4.8,
        reviewCount: 1245,
        stock: 15,
        timeRemaining: '1 day 14 hours',
        sold: 85
      },
      {
        id: 1002,
        name: 'Bose QuietComfort 35 II',
        originalPrice: 299.99,
        currentPrice: 199.99,
        discountPercentage: 33,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop',
        rating: 4.7,
        reviewCount: 987,
        stock: 8,
        timeRemaining: '2 days 6 hours',
        sold: 92
      },
      {
        id: 1003,
        name: 'Apple AirPods Pro',
        originalPrice: 249.99,
        currentPrice: 189.99,
        discountPercentage: 24,
        image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&auto=format&fit=crop',
        rating: 4.9,
        reviewCount: 2134,
        stock: 3,
        timeRemaining: '9 hours',
        sold: 97
      }
    ]
  },
  {
    id: 102,
    name: 'Clearance: Smart Home Devices',
    description: 'End-of-season discounts on top smart home products',
    image: 'https://images.unsplash.com/photo-1558002038-10058d4838c0?w=400&auto=format&fit=crop',
    products: [
      {
        id: 2001,
        name: 'Echo Dot (4th Gen)',
        originalPrice: 49.99,
        currentPrice: 29.99,
        discountPercentage: 40,
        image: 'https://images.unsplash.com/photo-1512446816042-444d641267d4?w=400&auto=format&fit=crop',
        rating: 4.6,
        reviewCount: 957,
        stock: 22,
        timeRemaining: '3 days 8 hours',
        sold: 78
      },
      {
        id: 2002,
        name: 'Google Nest Hub',
        originalPrice: 89.99,
        currentPrice: 59.99,
        discountPercentage: 33,
        image: 'https://images.unsplash.com/photo-1558203728-00f45181dd84?w=400&auto=format&fit=crop',
        rating: 4.5,
        reviewCount: 784,
        stock: 14,
        timeRemaining: '2 days 12 hours',
        sold: 86
      },
      {
        id: 2003,
        name: 'Smart Doorbell Camera',
        originalPrice: 199.99,
        currentPrice: 129.99,
        discountPercentage: 35,
        image: 'https://images.unsplash.com/photo-1607853554439-0069ec0f29b6?w=400&auto=format&fit=crop',
        rating: 4.7,
        reviewCount: 543,
        stock: 7,
        timeRemaining: '1 day 4 hours',
        sold: 93
      }
    ]
  },
  {
    id: 103,
    name: 'Weekend Special: Laptops',
    description: 'Amazing weekend deals on laptops for work and gaming',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop',
    products: [
      {
        id: 3001,
        name: 'MacBook Air M2',
        originalPrice: 1199.99,
        currentPrice: 999.99,
        discountPercentage: 17,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format&fit=crop',
        rating: 4.9,
        reviewCount: 768,
        stock: 6,
        timeRemaining: '2 days 18 hours',
        sold: 94
      },
      {
        id: 3002,
        name: 'Dell XPS 15',
        originalPrice: 1499.99,
        currentPrice: 1199.99,
        discountPercentage: 20,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop',
        rating: 4.7,
        reviewCount: 632,
        stock: 4,
        timeRemaining: '1 day 8 hours',
        sold: 96
      },
      {
        id: 3003,
        name: 'Asus ROG Gaming Laptop',
        originalPrice: 1799.99,
        currentPrice: 1399.99,
        discountPercentage: 22,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop',
        rating: 4.8,
        reviewCount: 475,
        stock: 3,
        timeRemaining: '16 hours',
        sold: 97
      }
    ]
  }
];

const ProductCard = ({ product, onViewProduct }) => {
  const theme = useTheme();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    setInWishlist(!inWishlist);
  };
  
  const soldPercentage = (product.sold / (product.sold + product.stock)) * 100;
  
  return (
    <Card 
      onClick={() => onViewProduct(product.id)}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
        },
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'contain', backgroundColor: '#f8f9fa', p: 2 }}
        />
        <Chip
          label={`${product.discountPercentage}% OFF`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 'bold',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            color: inWishlist ? 'error.main' : 'rgba(0, 0, 0, 0.54)',
            transition: 'all 0.2s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            p: 0.8,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              transform: 'scale(1.1)'
            }
          }}
          onClick={handleToggleWishlist}
        >
          <Favorite color={inWishlist ? 'error' : 'inherit'} fontSize="small" />
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>
        
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="h6" color="error.main" fontWeight="bold">
            ${product.currentPrice}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
            ${product.originalPrice}
          </Typography>
        </Stack>
        
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <AccessTime fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
            Ends in: {product.timeRemaining}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Sold: {product.sold}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available: {product.stock}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={soldPercentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: soldPercentage > 80 ? theme.palette.error.main : theme.palette.warning.main
                }
              }} 
            />
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          fullWidth
          sx={{ 
            mt: 'auto',
            fontWeight: 'medium',
            '&:hover': {
              transform: 'scale(1.03)'
            },
            transition: 'transform 0.2s ease'
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

const DealCategory = ({ deal, onViewProduct }) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocalOffer color="error" sx={{ mr: 1.5 }} />
        <Typography variant="h5" component="h2" fontWeight="bold">
          {deal.name}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {deal.description}
      </Typography>
      
      <Grid container spacing={3}>
        {deal.products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onViewProduct={onViewProduct} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const DealsHeader = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        mb: 5,
        mt: 2,
        borderRadius: 2,
        backgroundImage: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&auto=format&fit=crop) no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1, width: { xs: '100%', md: '65%' } }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Deals & Promotions
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Save big with our limited-time offers
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
          Discover incredible savings on premium products across all categories. 
          Don't miss our flash sales, clearance items, and exclusive weekend promotions!
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          sx={{ 
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Shop All Deals
        </Button>
      </Box>
    </Paper>
  );
};

const Deals = ({ onViewProduct }) => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DealsHeader />
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              minWidth: 120
            }
          }}
        >
          <Tab label="All Deals" />
          <Tab label="Flash Sales" />
          <Tab label="Clearance" />
          <Tab label="Weekend Specials" />
        </Tabs>
        <Divider sx={{ mb: 4 }} />
      </Box>
      
      {tabValue === 0 && (
        <>
          {dealData.map((deal) => (
            <DealCategory key={deal.id} deal={deal} onViewProduct={onViewProduct} />
          ))}
        </>
      )}
      
      {tabValue === 1 && (
        <DealCategory deal={dealData[0]} onViewProduct={onViewProduct} />
      )}
      
      {tabValue === 2 && (
        <DealCategory deal={dealData[1]} onViewProduct={onViewProduct} />
      )}
      
      {tabValue === 3 && (
        <DealCategory deal={dealData[2]} onViewProduct={onViewProduct} />
      )}
    </Container>
  );
};

export default Deals; 