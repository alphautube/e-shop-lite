import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Tooltip,
  CardActionArea,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  ShoppingCart, 
  Delete as DeleteIcon, 
  Visibility,
  DeleteSweep,
  ChevronLeft,
  ChevronRight,
  BrokenImage
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

// Maximum number of recently viewed products to store
const MAX_RECENT_PRODUCTS = 10;

// Storage key for localStorage
const STORAGE_KEY = 'recentlyViewedProducts';

const RecentlyViewedProductCard = ({ product, onViewProduct, onAddToCart, onRemove }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover .product-actions': {
          opacity: 1
        }
      }}
    >
      <CardActionArea onClick={() => onViewProduct(product.id)}>
        <Box sx={{ position: 'relative', height: 140 }}>
          {imageLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
              <CircularProgress size={30} />
            </Box>
          )}
          
          {imageError ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <BrokenImage fontSize="medium" color="disabled" />
            </Box>
          ) : (
            <CardMedia
              component="img"
              sx={{ height: 140, display: imageLoading ? 'none' : 'block' }}
              image={product.image}
              alt={product.name}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography gutterBottom variant="subtitle2" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="bold">
            ${product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <Box 
        className="product-actions"
        sx={{ 
          position: 'absolute', 
          top: 5, 
          right: 5,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'rgba(255,255,255,0.9)',
          borderRadius: 1,
          opacity: 0,
          transition: 'opacity 0.2s',
          '& > *': {
            m: 0.5
          }
        }}
      >
        <Tooltip title="View product">
          <IconButton 
            size="small" 
            onClick={() => onViewProduct(product.id)}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add to cart">
          <IconButton 
            size="small" 
            onClick={(e) => onAddToCart(e, product)}
            sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}
          >
            <ShoppingCart fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove from history">
          <IconButton 
            size="small" 
            onClick={(e) => onRemove(e, product.id)}
            sx={{ bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.main' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

const RecentlyViewedProducts = ({ onViewProduct }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  // Load recently viewed products from localStorage
  useEffect(() => {
    const loadRecentProducts = () => {
      try {
        const storedProducts = localStorage.getItem(STORAGE_KEY);
        if (storedProducts) {
          setRecentProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecentProducts();
  }, []);
  
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleRemoveFromHistory = (e, productId) => {
    e.stopPropagation();
    const updatedProducts = recentProducts.filter(p => p.id !== productId);
    setRecentProducts(updatedProducts);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error saving recently viewed products:', error);
    }
  };
  
  const handleClearHistory = () => {
    setRecentProducts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed products:', error);
    }
  };

  if (loading) {
    // Show loading skeleton
    return (
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Recently Viewed
          </Typography>
          <Skeleton variant="rectangular" width={100} height={36} />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item key={i} xs={6} sm={4} md={3} lg={2}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (recentProducts.length === 0) {
    return null; // Don't render anything if no recently viewed products
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Recently Viewed
        </Typography>
        <Tooltip title="Clear history">
          <IconButton 
            color="default" 
            size="small"
            onClick={handleClearHistory}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {recentProducts.map(product => (
          <Grid item key={product.id} xs={6} sm={4} md={3} lg={2}>
            <RecentlyViewedProductCard
              product={product}
              onViewProduct={onViewProduct}
              onAddToCart={handleAddToCart}
              onRemove={handleRemoveFromHistory}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Helper function to add a product to recently viewed
export const addToRecentlyViewed = (product) => {
  try {
    let recentProducts = [];
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    
    if (storedProducts) {
      recentProducts = JSON.parse(storedProducts);
    }
    
    // Remove the product if it already exists
    recentProducts = recentProducts.filter(p => p.id !== product.id);
    
    // Add the product to the beginning of the array
    recentProducts.unshift(product);
    
    // Limit the array to MAX_RECENT_PRODUCTS
    if (recentProducts.length > MAX_RECENT_PRODUCTS) {
      recentProducts = recentProducts.slice(0, MAX_RECENT_PRODUCTS);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentProducts));
  } catch (error) {
    console.error('Error adding to recently viewed products:', error);
  }
};

export default RecentlyViewedProducts; 