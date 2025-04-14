import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button, Card, CardMedia, CardContent, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Latest gadgets and tech innovations',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop',
    itemCount: 42
  },
  {
    id: 2,
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop',
    itemCount: 36
  },
  {
    id: 3,
    name: 'Home',
    description: 'Furniture and home decor',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&auto=format&fit=crop',
    itemCount: 29
  },
  {
    id: 4,
    name: 'Books',
    description: 'Bestsellers and literary classics',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop',
    itemCount: 24
  },
  {
    id: 5,
    name: 'Sports',
    description: 'Equipment and activewear',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop',
    itemCount: 31
  },
  {
    id: 6,
    name: 'Beauty',
    description: 'Skincare and cosmetics',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop',
    itemCount: 27
  },
  {
    id: 7,
    name: 'Toys',
    description: 'Games and entertainment for all ages',
    image: 'https://images.unsplash.com/photo-1558060370-d644485927b2?w=400&auto=format&fit=crop',
    itemCount: 19
  },
  {
    id: 8,
    name: 'Furniture',
    description: 'Modern and classic furniture pieces',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop',
    itemCount: 22
  }
];

const FeaturedCategory = ({ category, onViewCategory }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
        },
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <Box sx={{ position: 'relative', pt: '60%' }}>
        <CardMedia
          component="img"
          image={category.image}
          alt={category.name}
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 0,
            width: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            p: 2,
            color: 'white'
          }}
        >
          <Typography variant="h5" component="div" fontWeight="bold">
            {category.name}
          </Typography>
          <Typography variant="body2">
            {category.itemCount} products
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {category.description}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          endIcon={<ArrowForward />}
          onClick={() => onViewCategory(category.id)}
          sx={{ 
            mt: 'auto',
            alignSelf: 'flex-start',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(5px)'
            }
          }}
        >
          Browse Products
        </Button>
      </CardContent>
    </Card>
  );
};

const Categories = ({ onViewCategory, onViewProduct }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Product Categories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Browse our wide selection of products by category
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 5, 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, #5465ff 0%, #788bff 100%)',
            color: 'white'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Summer Collection
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Discover our latest summer essentials with up to 40% off on selected items.
                Limited time offer!
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                sx={{ fontWeight: 'bold' }}
              >
                Shop Now
              </Button>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=300&auto=format&fit=crop"
                alt="Summer Collection"
                sx={{ 
                  width: '100%',
                  maxHeight: '150px',
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <FeaturedCategory 
              category={category} 
              onViewCategory={onViewCategory} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Categories; 