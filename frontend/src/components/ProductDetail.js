import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Rating, 
  Avatar, 
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  TextField,
  CircularProgress,
  ImageList,
  ImageListItem,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Share, 
  ArrowBack,
  Add,
  Remove,
  StarBorder
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import LazyImage from './LazyImage';
import SocialShare from './SocialShare';
import RecommendedProducts from './RecommendedProducts';
import ProductVariants from './ProductVariants';

// Dummy reviews data
const REVIEWS = [
  {
    id: 1,
    user: 'John D.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&auto=format&fit=crop',
    rating: 5,
    date: '2023-10-15',
    title: 'Excellent product!',
    comment: 'This exceeded my expectations. The quality is amazing and it works perfectly.',
  },
  {
    id: 2,
    user: 'Sarah M.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&auto=format&fit=crop',
    rating: 4,
    date: '2023-09-28',
    title: 'Great value for money',
    comment: 'Really happy with this purchase. It\'s well made and functions as described.',
  },
  {
    id: 3,
    user: 'Mike T.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&auto=format&fit=crop',
    rating: 3,
    date: '2023-08-05',
    title: 'Good but could be better',
    comment: 'The product is good overall, but there are a few minor issues that could be improved.',
  }
];

// Dummy related products
const RELATED_PRODUCTS = [
  {
    id: 101,
    name: 'Related Product 1',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=200&auto=format&fit=crop'
  },
  {
    id: 102,
    name: 'Related Product 2',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200&auto=format&fit=crop'
  },
  {
    id: 103,
    name: 'Related Product 3',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1631281956016-3cbc6dd85e21?w=200&auto=format&fit=crop'
  }
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Product detail component
const ProductDetail = ({ productId, onBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, items } = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // State for product variants
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [variantErrors, setVariantErrors] = useState({});
  
  const cartItem = items.find(item => {
    // Check for variant match too if applicable
    if (selectedVariant) {
      return item.id === selectedVariant.id;
    }
    return product && item.id === product.id;
  });

  // Additional product images
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In real app, fetch the specific product by ID
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        setProduct(response.data);
        
        // Set product images (main + additional)
        if (response.data) {
          setProductImages([
            response.data.image,
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop'
          ]);
          
          // For demo purposes, create some product variants
          // In a real app, these would come from the API
          if (response.data.category === 'Clothing' || response.data.category === 'Shoes') {
            const demoVariants = [
              {
                id: `${response.data.id}-1`,
                options: { color: 'Black', size: 'S' },
                price: response.data.price,
                stock: 10,
                image: response.data.image
              },
              {
                id: `${response.data.id}-2`,
                options: { color: 'Black', size: 'M' },
                price: response.data.price,
                stock: 5,
                image: response.data.image
              },
              {
                id: `${response.data.id}-3`,
                options: { color: 'Black', size: 'L' },
                price: response.data.price,
                stock: 2,
                image: response.data.image
              },
              {
                id: `${response.data.id}-4`,
                options: { color: 'Blue', size: 'S' },
                price: response.data.price,
                stock: 7,
                image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop'
              },
              {
                id: `${response.data.id}-5`,
                options: { color: 'Blue', size: 'M' },
                price: response.data.price,
                stock: 8,
                image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop'
              },
              {
                id: `${response.data.id}-6`,
                options: { color: 'Red', size: 'S' },
                price: response.data.price * 1.1, // 10% more expensive
                stock: 0, // Out of stock
                image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop'
              },
              {
                id: `${response.data.id}-7`,
                options: { color: 'Red', size: 'L' },
                price: response.data.price * 1.1,
                stock: 3,
                image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop'
              },
            ];
            setVariants(demoVariants);
          } else if (response.data.category === 'Electronics') {
            const demoVariants = [
              {
                id: `${response.data.id}-1`,
                options: { color: 'Black', storage: '128GB' },
                price: response.data.price,
                stock: 15,
                image: response.data.image
              },
              {
                id: `${response.data.id}-2`,
                options: { color: 'Black', storage: '256GB' },
                price: response.data.price * 1.2,
                stock: 8,
                image: response.data.image
              },
              {
                id: `${response.data.id}-3`,
                options: { color: 'White', storage: '128GB' },
                price: response.data.price,
                stock: 6,
                image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop'
              },
              {
                id: `${response.data.id}-4`,
                options: { color: 'White', storage: '256GB' },
                price: response.data.price * 1.2,
                stock: 3,
                image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop'
              }
            ];
            setVariants(demoVariants);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Update the add to cart handler to include variant
  const handleAddToCart = () => {
    // Validate variant selections if there are variants
    if (variants.length > 0) {
      // Get all option types that should be selected
      const optionTypes = new Set();
      variants.forEach(variant => {
        if (variant.options) {
          Object.keys(variant.options).forEach(type => optionTypes.add(type));
        }
      });
      
      // Check if all required options are selected
      const errors = {};
      optionTypes.forEach(type => {
        if (!selectedOptions[type]) {
          errors[type] = `Please select a ${type}`;
        }
      });
      
      if (Object.keys(errors).length > 0) {
        setVariantErrors(errors);
        return;
      }
      
      // Clear errors if there were any
      if (Object.keys(variantErrors).length > 0) {
        setVariantErrors({});
      }
      
      if (selectedVariant) {
        // Check if variant is in stock
        if (selectedVariant.stock <= 0) {
          setVariantErrors({ general: 'This variant is out of stock' });
          return;
        }
        
        // Create a product with variant info
        const productWithVariant = {
          ...product,
          id: selectedVariant.id,
          price: selectedVariant.price,
          stock: selectedVariant.stock,
          image: selectedVariant.image,
          options: selectedVariant.options
        };
        
        // Add variant to cart with quantity
        for (let i = 0; i < quantity; i++) {
          addToCart(productWithVariant);
        }
        return;
      }
    }
    
    // Regular product without variants
    if (product) {
      // Add quantity times
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };
  
  // Handler for variant change
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    
    // Update the displayed image to match the variant
    if (variant.image) {
      const imageIndex = productImages.findIndex(img => img === variant.image);
      if (imageIndex >= 0) {
        setSelectedImage(imageIndex);
      }
    }
  };
  
  // Handler for option change
  const handleOptionChange = (options) => {
    setSelectedOptions(options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">Product not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  // Calculate average rating
  const avgRating = REVIEWS.reduce((sum, review) => sum + review.rating, 0) / REVIEWS.length;
  
  // Determine price to display (original or variant price)
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  
  // Determine stock to display
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 3 }}>
        Back to Products
      </Button>
      
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Left: Product Images */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                mb: 2, 
                position: 'relative',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                minHeight: '400px'
              }}
            >
              <LazyImage
                src={productImages[selectedImage]}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  maxHeight: '360px',
                  objectFit: 'contain'
                }}
                placeholderHeight={400}
                effect="opacity"
                threshold={200}
              />
              <Chip 
                label={product.category}
                color="primary"
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10,
                  fontWeight: 'bold',
                  zIndex: 1
                }}
              />
            </Box>
            <Grid container spacing={1}>
              {productImages.map((img, index) => (
                <Grid item key={index} xs={3}>
                  <Box
                    onClick={() => setSelectedImage(index)}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #1976d2' : '2px solid transparent',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      height: '80px',
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <LazyImage 
                      src={img} 
                      alt={`${product.name} view ${index + 1}`} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '70px',
                        objectFit: 'contain'
                      }}
                      placeholderHeight={70}
                      effect="opacity"
                      threshold={100}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Right: Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={avgRating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({REVIEWS.length} reviews)
              </Typography>
            </Box>
            
            <Chip 
              label={product.category}
              color="primary"
              size="small"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
              ${displayPrice.toFixed(2)}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Availability:
              </Typography>
              <Chip 
                label={displayStock > 0 ? 'In Stock' : 'Out of Stock'} 
                color={displayStock > 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
            
            {/* Display variant options if available */}
            {variants.length > 0 && (
              <Box sx={{ my: 3 }}>
                <ProductVariants
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                  selectedOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  errors={variantErrors}
                />
              </Box>
            )}
            
            {variantErrors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {variantErrors.general}
              </Alert>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1, mr: 2 }}>
                <IconButton 
                  size="small" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2 }}>{quantity}</Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={(displayStock <= 0) || (cartItem && cartItem.quantity >= displayStock)}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Tooltip title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                <Button
                  color={isInWishlist(product.id) ? 'error' : 'secondary'}
                  variant={isInWishlist(product.id) ? 'contained' : 'outlined'}
                  startIcon={isInWishlist(product.id) ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => {
                    if (isInWishlist(product.id)) {
                      removeFromWishlist(product.id);
                    } else {
                      // If we have a selected variant, use that for the wishlist
                      if (selectedVariant) {
                        const productWithVariant = {
                          ...product,
                          id: selectedVariant.id,
                          price: selectedVariant.price,
                          image: selectedVariant.image,
                          options: selectedVariant.options
                        };
                        addToWishlist(productWithVariant);
                      } else {
                        addToWishlist(product);
                      }
                    }
                  }}
                >
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </Tooltip>
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Share:</Typography>
                <SocialShare 
                  title={product.name}
                  description={product.description}
                  imageUrl={product.image}
                  url={window.location.href}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for Details, Reviews, etc. */}
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Product Description</Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui.
              </Typography>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Technical Specifications</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Model', value: `${product.name}-2023` },
                  { label: 'Category', value: product.category },
                  { label: 'Stock', value: product.stock },
                  { label: 'Weight', value: '1.2 kg' },
                  { label: 'Dimensions', value: '10 x 15 x 5 cm' },
                  { label: 'Warranty', value: '1 Year' }
                ].map((spec, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontWeight="bold">{spec.label}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2">{spec.value}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Customer Reviews</Typography>
                <Button variant="outlined" startIcon={<StarBorder />}>
                  Write a Review
                </Button>
              </Box>
              
              {REVIEWS.map(review => (
                <Paper key={review.id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar src={review.avatar} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {review.user}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {review.title}
                      </Typography>
                      <Typography variant="body2">
                        {review.comment}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Recommended Products */}
      <RecommendedProducts 
        currentProductId={product.id} 
        category={product.category}
        limit={4}
      />
    </Container>
  );
};

export default ProductDetail; 