import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Chip, 
  TextField, 
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Divider,
  Pagination,
  CircularProgress,
  Button
} from '@mui/material';
import { Search, FilterList, Home } from '@mui/icons-material';
import ProductCard from './ProductCard';
import axios from 'axios';
import RecommendedProducts from './RecommendedProducts';
import RecentlyViewed from './RecentlyViewed';

const ITEMS_PER_PAGE = 8;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const ProductList = ({ onViewProduct, filters = {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [viewedProducts, setViewedProducts] = useState([]);
  
  // Apply external filters when they change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      if (filters.searchQuery !== undefined) {
        setSearchQuery(filters.searchQuery);
      }
      if (filters.sort !== undefined) {
        // Map from filter sort values to component sort values
        const sortMap = {
          'popular': 'default',
          'price-asc': 'price-low-high',
          'price-desc': 'price-high-low',
          'name-asc': 'name-a-z',
          'name-desc': 'name-z-a'
        };
        setSortBy(sortMap[filters.sort] || 'default');
      }
      if (filters.categories && filters.categories.length > 0) {
        // Use the first category from the filters (simplification)
        setSelectedCategory(filters.categories[0]);
      }
    }
  }, [filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Load recently viewed products from localStorage
    const storedViewedProducts = localStorage.getItem('viewedProducts');
    if (storedViewedProducts) {
      setViewedProducts(JSON.parse(storedViewedProducts));
    }
  }, []);

  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Filter products by category and search query
  let filteredProducts = products.filter(product => {
    // Skip items without a valid category when filtering by category
    if (filters.categories && filters.categories.length > 0 && !product.category) {
      return false;
    }
    
    // Basic filtering from component state
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Additional filtering from external filters
    let matchesExternalCategories = true;
    if (filters.categories && filters.categories.length > 0) {
      // Strict category matching - must match one of the selected categories exactly
      const productCategory = product.category.toLowerCase().trim();
      matchesExternalCategories = filters.categories.some(category => {
        const filterCategory = category.toLowerCase().trim();
        return productCategory === filterCategory;
      });
      
      // If no match was found, this product should be filtered out
      if (!matchesExternalCategories) {
        return false;
      }
    }
    
    let matchesBrands = true;
    if (filters.brands && filters.brands.length > 0) {
      matchesBrands = filters.brands.some(brandId => 
        product.brand && product.brand.toLowerCase() === brandId.toLowerCase()
      );
    }
    
    let matchesPrice = true;
    if (filters.priceRange) {
      matchesPrice = 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1];
    }
    
    let matchesRating = true;
    if (filters.minRating && filters.minRating > 0) {
      matchesRating = (product.rating || 0) >= filters.minRating;
    }
    
    // For category filtering, we use strict equality rather than partial matches
    const categoryMatch = filters.categories && filters.categories.length > 0 ? 
                           matchesExternalCategories : matchesCategory;
    
    return categoryMatch && matchesSearch && matchesBrands && matchesPrice && matchesRating;
  });

  // Sort products based on selected sorting option
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'name-a-z':
        return a.name.localeCompare(b.name);
      case 'name-z-a':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentPageProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery, sortBy, filters]);

  // Get the most up-to-date viewed products list from localStorage
  const viewedProductIds = JSON.parse(localStorage.getItem('viewedProducts') || '[]');

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Discover Our Products
      </Typography>
      
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
          <TextField
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              }
            >
              <MenuItem value="default">Featured</MenuItem>
              <MenuItem value="price-low-high">Price: Low to High</MenuItem>
              <MenuItem value="price-high-low">Price: High to Low</MenuItem>
              <MenuItem value="name-a-z">Name: A to Z</MenuItem>
              <MenuItem value="name-z-a">Name: Z to A</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Paper>

      {filteredProducts.length === 0 ? (
        <Paper elevation={1} sx={{ p: 5, textAlign: 'center', my: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No products found matching your criteria.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or search terms to find what you're looking for.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Home />} 
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSortBy('default');
            }}
          >
            Return to All Products
          </Button>
        </Paper>
      ) : (
        <>
          {selectedCategory === 'All' ? (
            // When showing all categories, group by category
            Object.entries(
              // Group products by category
              filteredProducts.reduce((acc, product) => {
                const category = product.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
              }, {})
            ).map(([category, categoryProducts]) => (
              <Box key={category} sx={{ mb: 5 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    borderRadius: '8px'
                  }}
                >
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {category}
                  </Typography>
                </Paper>
                <Grid 
                  container 
                  spacing={0}
                  sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    mx: -1.5 // Negative margin to offset the padding
                  }}
                >
                  {categoryProducts
                    .slice(0, 4) // Limit to 4 products per category in this view
                    .map((product) => (
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
                      <ProductCard product={product} onViewProduct={onViewProduct} />
                    </Grid>
                  ))}
                  {categoryProducts.length > 4 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => setSelectedCategory(category)}
                        >
                          See all {categoryProducts.length} {category} products
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))
          ) : (
            // When filtering by category, show paginated products
            <>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  {selectedCategory}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredProducts.length} products
                </Typography>
              </Paper>
              
              <Grid 
                container 
                spacing={0}
                sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  mx: -1.5 // Negative margin to offset the padding
                }}
              >
                {currentPageProducts.map((product) => (
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
                    <ProductCard product={product} onViewProduct={onViewProduct} />
                  </Grid>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size="large"
                    showFirstButton 
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
            {selectedCategory === 'All' 
              ? `Showing products across ${Object.keys(
                  filteredProducts.reduce((acc, p) => {
                    acc[p.category] = true;
                    return acc;
                  }, {})
                ).length} categories`
              : `Showing ${Math.min(currentPageProducts.length, ITEMS_PER_PAGE)} of ${filteredProducts.length} products in ${selectedCategory}`
            }
          </Typography>
        </>
      )}
      
      {/* Personalized recommendations */}
      {products.length > 0 && (
        <RecommendedProducts limit={4} />
      )}
      
      {viewedProductIds.length > 0 && (
        <RecentlyViewed 
          products={products.filter(product => viewedProductIds.includes(product.id))} 
          onViewProduct={onViewProduct}
        />
      )}
    </Container>
  );
};

export default ProductList; 