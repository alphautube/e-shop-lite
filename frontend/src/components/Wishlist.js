import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Divider,
  Paper,
  Alert,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { Delete, ShoppingCart, BrokenImage } from '@mui/icons-material';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistItem = ({ product, onRemove, onAddToCart }) => {
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', height: 200 }}>
        {imageLoading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        )}
        
        {imageError ? (
          <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.05)' }}>
            <BrokenImage fontSize="large" color="disabled" />
          </Box>
        ) : (
          <CardMedia
            component="img"
            src={product.image}
            alt={product.name}
            height={200}
            style={{ objectFit: 'cover' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{ display: imageLoading ? 'none' : 'block' }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description && product.description.length > 120 
            ? `${product.description.substring(0, 120)}...` 
            : product.description}
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          size="small"
          onClick={() => onAddToCart(product)}
          sx={{ mr: 'auto' }}
        >
          Add to Cart
        </Button>
        <IconButton 
          color="error" 
          onClick={() => onRemove(product.id)}
          aria-label="remove from wishlist"
        >
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const Wishlist = ({ onBackToShopping }) => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const handleAddToCart = (product) => {
    addToCart(product);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Wishlist
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              onClick={onBackToShopping}
              sx={{ mr: 2 }}
            >
              Continue Shopping
            </Button>
            {items.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={clearWishlist}
              >
                Clear Wishlist
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {items.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            Your wishlist is empty. Browse products and add items to your wishlist!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {items.map(item => (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                <WishlistItem 
                  product={item} 
                  onRemove={removeFromWishlist}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Wishlist; 