import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton, Chip, Tooltip, Zoom, CircularProgress } from '@mui/material';
import { ShoppingCart, Add, Remove, Favorite, FavoriteBorder, Visibility, BrokenImage } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductQuickView from './ProductQuickView';

const ProductCard = ({ product, onViewProduct }) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const cartItem = items.find(item => item.id === product.id);
  const inWishlist = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [addToCartClicked, setAddToCartClicked] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Check if product is on sale (we'll deterministically mark 30% of products on sale)
  const isOnSale = product.id % 3 === 0; // Every 3rd product will be on sale
  
  // Use a deterministic discount based on product ID instead of random
  // This ensures the discount doesn't change on re-renders
  const discountPercent = isOnSale ? 10 + (product.id % 30) : 0; // Discount between 10-40% based on ID
  const salePrice = isOnSale ? (product.price * (1 - discountPercent / 100)).toFixed(2) : null;

  // Handle product image loading
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  // Handle product image loading error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Fallback image for missing product images
  const fallbackImageUrl = 'https://placehold.co/600x400/e0e0e0/6e6e6e.png';

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    addToCart(product);
    
    // Animation for add to cart
    setAddToCartClicked(true);
    setTimeout(() => setAddToCartClicked(false), 500);
  };

  const handleUpdateQuantity = (e, newQuantity) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (newQuantity === 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  const handleToggleWishlist = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleCardClick = () => {
    if (onViewProduct) {
      onViewProduct(product.id);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setQuickViewOpen(true);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%', 
          height: '480px', // Increased height to fit all content
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: onViewProduct ? 'pointer' : 'default',
          overflow: 'hidden',
          flex: 1,
          minWidth: '100%',
          maxWidth: '100%',
          position: 'relative',
          borderRadius: '8px',
          '&:hover': { 
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'relative',
              height: '240px', // Fixed height for all images
              width: '100%',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {imageLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <CircularProgress size={40} />
              </Box>
            )}
            
            {imageError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                <CardMedia
                  component="img"
                  src={fallbackImageUrl}
                  alt={product.name}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '16px'
                  }}
                />
              </Box>
            ) : (
              <CardMedia
                component="img"
                src={product.image}
                alt={product.name}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '16px',
                  transition: 'all 0.5s ease',
                  display: imageLoading ? 'none' : 'block'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </Box>
          
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
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  borderRadius: 'inherit',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 0, transform: 'scale(1.2)' },
                    '100%': { opacity: 0.6, transform: 'scale(1)' }
                  }
                }
              }}
            />
          )}
          
          <Chip 
            label={product.category}
            color="primary"
            size="small"
            sx={{ 
              position: 'absolute', 
              top: isOnSale ? 45 : 10, // Move down if there's a sale badge
              right: 10,
              backgroundColor: 'rgba(25, 118, 210, 0.8)',
              fontWeight: 'medium',
              zIndex: 1,
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateY(-3px)' : 'translateY(0)'
            }}
          />
          <Tooltip title={inWishlist ? "Remove from wishlist" : "Add to wishlist"} TransitionComponent={Zoom}>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                left: 10, 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease',
                zIndex: 1
              }}
              size="small"
              color={inWishlist ? "error" : "default"}
              onClick={handleToggleWishlist}
            >
              {inWishlist ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          
          {/* Quick view button that appears on hover */}
          <Tooltip title="Quick View" TransitionComponent={Zoom}>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                left: isHovered ? 50 : -40, // Slides in from left
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease, left 0.3s ease',
                zIndex: 1
              }}
              size="small"
              onClick={handleQuickView}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        </Box>
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          p: 2,
          height: '240px', // Increased content height
          overflow: 'hidden'
        }}>
          <Box>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                height: '48px', // Fixed height for title
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                mb: 1,
                transition: 'color 0.3s ease',
                color: isHovered ? 'primary.main' : 'text.primary'
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
                mb: 2
              }}
            >
              {product.description}
            </Typography>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography 
                  variant="h6" 
                  color={isOnSale ? "error" : "primary"} 
                  sx={{ 
                    fontWeight: 'bold',
                    transition: 'transform 0.3s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  ${isOnSale ? salePrice : product.price.toFixed(2)}
                </Typography>
                
                {isOnSale && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      ml: 1, 
                      textDecoration: 'line-through',
                      transition: 'all 0.3s ease',
                      opacity: isHovered ? 0.9 : 0.7
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                In stock: {product.stock}
              </Typography>
            </Box>
            {!cartItem ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleQuickView}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    flex: '1 0 auto',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Quick View
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    flex: '1 0 auto',
                    transition: 'all 0.3s ease',
                    transform: addToCartClicked ? 'translateY(3px)' : 'translateY(0)',
                    boxShadow: addToCartClicked ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 7px 14px rgba(0,0,0,0.12)'
                    },
                    '&:active': {
                      transform: 'translateY(2px)',
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={(e) => handleUpdateQuantity(e, cartItem.quantity - 1)}
                  sx={{ 
                    border: '1px solid #1976d2',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                    }
                  }}
                >
                  <Remove />
                </IconButton>
                <Typography 
                  fontWeight="bold"
                  sx={{
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {cartItem.quantity}
                </Typography>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={(e) => handleUpdateQuantity(e, cartItem.quantity + 1)}
                  sx={{ 
                    border: '1px solid #1976d2',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                    }
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Product Quick View Dialog */}
      <ProductQuickView 
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onViewFullDetails={onViewProduct}
      />
    </>
  );
};

export default ProductCard; 