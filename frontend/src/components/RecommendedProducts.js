import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Skeleton, 
  Chip,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  Visibility, 
  Favorite,
  ShoppingCart 
} from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import LazyImage from './LazyImage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const RecommendedProducts = ({ userId, currentProductId, category, limit = 4 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState('similar');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // In a real app, we would call a recommendation API endpoint
        // For demo purposes, we'll use the products API and filter client-side
        const response = await axios.get(`${API_URL}/api/products`);
        
        let filteredProducts;
        
        // Filter based on recommendation type
        switch (recommendationType) {
          case 'similar':
            // Products in the same category, excluding current product
            filteredProducts = response.data
              .filter(product => 
                product.category === category && 
                (!currentProductId || product.id !== currentProductId)
              )
              .slice(0, limit);
            break;
            
          case 'trending':
            // Simulate trending products by taking random products
            filteredProducts = response.data
              .sort(() => 0.5 - Math.random())
              .slice(0, limit);
            break;
            
          case 'history':
            // In a real app, we would retrieve from user's browsing history
            // For demo, use a different random selection
            filteredProducts = response.data
              .sort(() => 0.5 - Math.random())
              .slice(0, limit);
            break;
            
          default:
            filteredProducts = [];
        }
        
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category, currentProductId, recommendationType, limit]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Track viewed products in localStorage
  useEffect(() => {
    const trackViewedProduct = () => {
      if (!currentProductId) return;
      
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
      
      // Add current product to the beginning of the array if not already in first position
      if (!viewedProducts.includes(currentProductId)) {
        viewedProducts.unshift(currentProductId);
        // Keep only the last 10 viewed products
        const limitedHistory = viewedProducts.slice(0, 10);
        localStorage.setItem('viewedProducts', JSON.stringify(limitedHistory));
      }
    };
    
    trackViewedProduct();
  }, [currentProductId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Recommended For You
        </Typography>
        <Grid 
          container 
          spacing={0}
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            mx: -1.5 // Negative margin to offset the padding
          }}
        >
          {Array.from(new Array(limit)).map((_, index) => (
            <Grid 
              item 
              key={index} 
              xs={12} 
              sm={6} 
              md={3}
              sx={{ 
                padding: 1.5,
                boxSizing: 'border-box',
                width: { xs: '100%', sm: '50%', md: '25%' },
                height: '520px' // Increased to accommodate padding
              }}
            >
              <Box sx={{ 
                width: '100%', 
                height: '450px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 1
              }}>
                <Skeleton 
                  variant="rectangular" 
                  height={240} 
                  sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
                />
                <Box sx={{ p: 2, flexGrow: 1 }}>
                  <Skeleton variant="text" height={48} />
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" width="40%" height={32} />
                </Box>
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between' 
                }}>
                  <Skeleton variant="rounded" width={100} height={36} />
                  <Skeleton variant="rounded" width={120} height={36} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Recommended For You
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Similar products">
            <Chip 
              icon={<Favorite fontSize="small" />} 
              label="Similar" 
              clickable
              color={recommendationType === 'similar' ? 'primary' : 'default'}
              onClick={() => setRecommendationType('similar')}
            />
          </Tooltip>
          
          <Tooltip title="Trending products">
            <Chip 
              icon={<TrendingUp fontSize="small" />} 
              label="Trending" 
              clickable
              color={recommendationType === 'trending' ? 'primary' : 'default'}
              onClick={() => setRecommendationType('trending')}
            />
          </Tooltip>
          
          <Tooltip title="Based on your browsing history">
            <Chip 
              icon={<Visibility fontSize="small" />} 
              label="History" 
              clickable
              color={recommendationType === 'history' ? 'primary' : 'default'}
              onClick={() => setRecommendationType('history')}
            />
          </Tooltip>
        </Box>
      </Box>
      
      <Grid 
        container 
        spacing={0}
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          mx: -1.5 // Negative margin to offset the padding
        }}
      >
        {products.map((product) => {
          // Check if product is on sale (matching the same logic from ProductCard)
          const isOnSale = product.id % 3 === 0;
          const discountPercent = isOnSale ? Math.floor(Math.random() * 30) + 10 : 0;
          const salePrice = isOnSale ? (product.price * (1 - discountPercent / 100)).toFixed(2) : null;
          
          return (
            <Grid 
              item 
              key={product.id} 
              xs={12} 
              sm={6} 
              md={3}
              sx={{ 
                padding: 1.5,
                boxSizing: 'border-box',
                width: { xs: '100%', sm: '50%', md: '25%' },
                height: '520px' // Increased to accommodate padding
              }}
            >
              <Card 
                sx={{ 
                  width: '100%',
                  height: '480px', // Match ProductCard height
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s', 
                  overflow: 'hidden',
                  flex: 1,
                  minWidth: '100%',
                  maxWidth: '100%',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  } 
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: '240px', // Fixed height for all images
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '16px'
                    }}
                    placeholderHeight="100%"
                    effect="opacity"
                    threshold={200}
                  />
                  
                  {/* Sale badge */}
                  {isOnSale && (
                    <Chip 
                      label={`${discountPercent}% OFF`}
                      color="error"
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10,
                        fontWeight: 'bold',
                        zIndex: 2,
                        backgroundColor: '#e53935',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0.4)' },
                          '70%': { boxShadow: '0 0 0 7px rgba(229, 57, 53, 0)' },
                          '100%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0)' }
                        }
                      }}
                    />
                  )}
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1,
                  p: 2,
                  height: '150px', // Fixed content height
                  overflow: 'hidden'
                }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="div"
                    sx={{ 
                      height: '48px', // Fixed height for title
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis',
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      height: '60px', // Fixed height for description
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis',
                      mb: 1
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      variant="h6" 
                      color={isOnSale ? "error" : "primary"} 
                      fontWeight="bold"
                    >
                      ${isOnSale ? salePrice : product.price.toFixed(2)}
                    </Typography>
                    
                    {isOnSale && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ ml: 1, textDecoration: 'line-through' }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => window.location.href = `/product/${product.id}`}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RecommendedProducts; 