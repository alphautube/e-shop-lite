import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Divider,
  Grid,
  Rating,
  Slide,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { 
  Close, 
  ShoppingCart, 
  Add, 
  Remove, 
  Favorite, 
  FavoriteBorder,
  ArrowForwardIos
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductQuickView = ({ product, open, onClose, onViewFullDetails }) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const cartItem = product ? items.find(item => item.id === product.id) : null;
  const inWishlist = product ? isInWishlist(product.id) : false;
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Check if product is on sale (matching the same logic from ProductCard)
  const isOnSale = product ? product.id % 3 === 0 : false;
  const discountPercent = isOnSale ? Math.floor(Math.random() * 30) + 10 : 0;
  const salePrice = isOnSale && product ? (product.price * (1 - discountPercent / 100)).toFixed(2) : null;

  // Reset image loaded state when modal opens or product changes
  useEffect(() => {
    if (open && product) {
      // Pre-load the image
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error('Failed to load image:', product.image);
        setImageLoaded(true); // Show the broken image instead of spinner
      };
      img.src = product.image;

      return () => {
        // Clean up
        img.onload = null;
        img.onerror = null;
      };
    }
    return () => {};
  }, [open, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({...product, quantity});
    setQuantity(1);
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewDetails = () => {
    onClose();
    if (onViewFullDetails) {
      onViewFullDetails(product.id);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      aria-describedby="product-quick-view-dialog"
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        p: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10
      }}>
        <IconButton 
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Left side - Product Image */}
          <Grid item xs={12} md={6} sx={{ 
            backgroundColor: '#f5f5f5',
            position: 'relative',
            minHeight: { xs: '250px', md: '400px' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            {!imageLoaded ? (
              <CircularProgress />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  padding: '16px'
                }}
              />
            )}
            <Chip 
              label={product.category}
              color="primary"
              size="small"
              sx={{ 
                position: 'absolute', 
                top: isOnSale ? 50 : 16,
                left: 16,
                fontWeight: 'medium',
                zIndex: 1
              }}
            />
            {isOnSale && (
              <Chip 
                label={`${discountPercent}% OFF`}
                color="error"
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16,
                  fontWeight: 'bold',
                  zIndex: 2,
                  backgroundColor: '#e53935',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(229, 57, 53, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0)' }
                  }
                }}
              />
            )}
          </Grid>

          {/* Right side - Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviews || Math.floor(Math.random() * 50) + 10} reviews)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'baseline', my: 2 }}>
                <Typography variant="h5" color={isOnSale ? "error.main" : "primary.main"} sx={{ fontWeight: 'bold' }}>
                  ${isOnSale ? salePrice : product.price.toFixed(2)}
                </Typography>
                
                {isOnSale && (
                  <Typography variant="body1" sx={{ ml: 2, textDecoration: 'line-through', color: 'text.secondary' }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
                
                {isOnSale && (
                  <Typography variant="body2" sx={{ ml: 2, color: 'error.main', fontWeight: 'bold' }}>
                    Save {discountPercent}%
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Availability:
                </Typography>
                <Chip 
                  label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                  color={product.stock > 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'center' }}>
                {!cartItem ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${theme.palette.divider}`, borderRadius: '4px' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        sx={{ 
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 2, fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => setQuantity(quantity + 1)}
                        sx={{ 
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      sx={{ 
                        flex: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 10px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${theme.palette.divider}`, borderRadius: '4px' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                        sx={{ 
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 2, fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                        {cartItem.quantity}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                        sx={{ 
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      Added to Cart
                    </Typography>
                  </>
                )}
                
                <IconButton 
                  color={inWishlist ? "error" : "default"}
                  onClick={handleToggleWishlist}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  {inWishlist ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <Button
                variant="outlined"
                endIcon={<ArrowForwardIos />}
                onClick={handleViewDetails}
                sx={{ 
                  mt: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(5px)'
                  }
                }}
              >
                View Full Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView; 