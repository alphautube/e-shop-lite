import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Grid,
  Paper,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

// Sample review data (would come from backend in real app)
const SAMPLE_REVIEWS = [
  {
    id: 1,
    userName: 'John Smith',
    rating: 5,
    title: 'Excellent product!',
    comment: 'This product exceeded my expectations. The quality is outstanding and the delivery was super fast.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    userName: 'Sarah Johnson',
    rating: 4,
    title: 'Very good but could be better',
    comment: 'Overall I am happy with this purchase. The quality is good but there are a few minor issues with the design.',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    helpful: 5,
    verified: true
  },
  {
    id: 3,
    userName: 'Robert Brown',
    rating: 3,
    title: 'Decent product',
    comment: 'It works as advertised but the quality could be better for the price. Delivery was quick though.',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    helpful: 2,
    verified: false
  }
];

const ReviewItem = ({ review, onMarkHelpful }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar src={review.avatar} alt={review.userName} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
                {review.userName}
              </Typography>
              {review.verified && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: 'success.light', 
                    color: 'success.contrastText', 
                    px: 1, 
                    borderRadius: 1 
                  }}
                >
                  Verified Purchase
                </Typography>
              )}
            </Box>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, fontWeight: 'medium' }}>
              {review.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {review.comment}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Posted {formatDistanceToNow(review.date, { addSuffix: true })}
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => onMarkHelpful(review.id)}
              >
                Helpful ({review.helpful})
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RatingsSummary = ({ reviews }) => {
  // Calculate average rating
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Calculate count by rating
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });
  
  // Calculate percentages
  const ratingPercentages = ratingCounts.map(count => 
    (count / reviews.length) * 100
  );
  
  return (
    <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.paper' }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h3" component="div" color="primary" fontWeight="bold">
          {avgRating.toFixed(1)}
        </Typography>
        <Rating value={avgRating} precision={0.1} readOnly size="large" sx={{ mb: 1 }} />
        <Typography variant="subtitle2" color="text.secondary">
          Based on {reviews.length} reviews
        </Typography>
      </Box>
      
      <Box>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 20 }}>
              {rating}
            </Typography>
            <Rating value={rating} max={1} readOnly size="small" sx={{ mx: 1 }} />
            <Box sx={{ 
              flex: 1, 
              height: 10, 
              bgcolor: 'grey.200', 
              borderRadius: 5,
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  width: `${ratingPercentages[rating-1]}%`, 
                  height: '100%', 
                  bgcolor: 'primary.main' 
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ ml: 1, minWidth: 30 }}>
              {ratingCounts[rating-1]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const WriteReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    onSubmit({
      rating,
      title,
      comment
    });
    
    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Your Rating*
        </Typography>
        <Rating
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          size="large"
        />
      </Box>
      
      <TextField
        fullWidth
        label="Review Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Review Comment"
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        required
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 2 }}
        disabled={rating === 0}
      >
        Submit Review
      </Button>
    </Box>
  );
};

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const handleSubmitReview = (reviewData) => {
    const newReview = {
      id: reviews.length + 1,
      userName: 'You', // In a real app, this would come from auth
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
      date: new Date(),
      helpful: 0,
      verified: true,
      ...reviewData
    };
    
    setReviews([newReview, ...reviews]);
    setSnackbar({
      open: true,
      message: 'Your review has been submitted!',
      severity: 'success'
    });
  };
  
  const handleMarkHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 } 
        : review
    ));
    
    setSnackbar({
      open: true,
      message: 'Thanks for your feedback!',
      severity: 'success'
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <RatingsSummary reviews={reviews} />
            <WriteReviewForm onSubmit={handleSubmitReview} />
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">{reviews.length} Reviews</Typography>
            </Box>
            
            {reviews.map(review => (
              <ReviewItem 
                key={review.id} 
                review={review} 
                onMarkHelpful={handleMarkHelpful} 
              />
            ))}
          </Box>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductReviews; 