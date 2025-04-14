import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Tooltip,
} from '@mui/material';
import { Delete, Add, Remove, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const CartSidebar = ({ open, onClose, onCheckout }) => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleToggleWishlist = (item) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: 320, sm: 400 } },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Shopping Cart
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {items.length === 0 ? (
          <Typography color="text.secondary">
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} divider sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.image}
                      sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
                      alt={item.name}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                        {item.name}
                        {item.options && (
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                            {Object.entries(item.options).map(([key, value]) => (
                              `${key}: ${value}`
                            )).join(', ')}
                          </Typography>
                        )}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="primary" fontWeight="bold" sx={{ mr: 1 }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          × {item.quantity}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={isInWishlist(item.id) ? "Remove from wishlist" : "Save for later"}>
                          <IconButton 
                            edge="end" 
                            size="small"
                            color={isInWishlist(item.id) ? "error" : "default"}
                            onClick={() => handleToggleWishlist(item)}
                          >
                            {isInWishlist(item.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove from cart">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${getCartTotal().toFixed(2)}</Typography>
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                onClose();
                if (onCheckout) onCheckout();
              }}
            >
              Checkout
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar; 