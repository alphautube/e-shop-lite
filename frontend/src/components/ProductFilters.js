import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Divider,
  Rating,
  Chip,
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  ExpandMore,
  Search,
  FilterList,
  Clear
} from '@mui/icons-material';

// Sample data (would come from API in a real app)
const CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing & Fashion' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'books', name: 'Books' },
  { id: 'toys', name: 'Toys & Games' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'sports', name: 'Sports & Outdoors' }
];

const BRANDS = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'sony', name: 'Sony' },
  { id: 'nike', name: 'Nike' },
  { id: 'adidas', name: 'Adidas' },
  { id: 'lg', name: 'LG' },
  { id: 'microsoft', name: 'Microsoft' }
];

const ProductFilters = ({ onFilterChange, initialFilters }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || '');
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || [0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(initialFilters?.minRating || 0);
  const [sort, setSort] = useState(initialFilters?.sort || 'popular');
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  // Convert category names to IDs when initialFilters are provided
  useEffect(() => {
    if (initialFilters?.categories?.length > 0) {
      const categoryIds = initialFilters.categories.map(categoryName => {
        const category = CATEGORIES.find(cat => cat.name === categoryName);
        return category ? category.id : null;
      }).filter(id => id !== null);
      setSelectedCategories(categoryIds);
    }
    
    if (initialFilters?.brands?.length > 0) {
      const brandIds = initialFilters.brands.map(brandName => {
        const brand = BRANDS.find(b => b.name === brandName);
        return brand ? brand.id : null;
      }).filter(id => id !== null);
      setSelectedBrands(brandIds);
    }
    
    // Set filtersApplied based on whether any filters are active
    const hasActiveFilters = 
      (initialFilters?.searchQuery && initialFilters.searchQuery !== '') ||
      (initialFilters?.priceRange && (initialFilters.priceRange[0] > 0 || initialFilters.priceRange[1] < 1000)) ||
      (initialFilters?.categories?.length > 0) ||
      (initialFilters?.brands?.length > 0) ||
      (initialFilters?.minRating > 0) ||
      (initialFilters?.sort && initialFilters.sort !== 'popular');
    
    setFiltersApplied(hasActiveFilters);
  }, [initialFilters]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };
  
  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
  };
  
  const handleApplyFilters = () => {
    // Convert category IDs to names for filtering
    const categoryNames = selectedCategories.map(categoryId => {
      const category = CATEGORIES.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    });
    
    // Convert brand IDs to names for filtering
    const brandNames = selectedBrands.map(brandId => {
      const brand = BRANDS.find(b => b.id === brandId);
      return brand ? brand.name : brandId;
    });
    
    const filters = {
      searchQuery,
      priceRange,
      categories: categoryNames,
      brands: brandNames,
      minRating,
      sort
    };
    
    onFilterChange(filters);
    setFiltersApplied(true);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinRating(0);
    setSort('popular');
    
    onFilterChange({
      searchQuery: '',
      priceRange: [0, 1000],
      categories: [],
      brands: [],
      minRating: 0,
      sort: 'popular'
    });
    
    setFiltersApplied(false);
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    count += selectedCategories.length;
    count += selectedBrands.length;
    if (minRating > 0) count++;
    if (sort !== 'popular') count++;
    return count;
  };
  
  return (
    <Paper elevation={1} sx={{ p: 2, mb: { xs: 2, md: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          <FilterList sx={{ verticalAlign: 'middle', mr: 1 }} />
          Filters
          {getActiveFilterCount() > 0 && (
            <Chip 
              size="small" 
              label={getActiveFilterCount()} 
              color="primary" 
              sx={{ ml: 1 }} 
            />
          )}
        </Typography>
        
        {filtersApplied && (
          <Button 
            size="small" 
            startIcon={<Clear />} 
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      <TextField
        placeholder="Search products"
        variant="outlined"
        fullWidth
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton 
                edge="end" 
                size="small"
                onClick={() => setSearchQuery('')}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
      
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="price-range-content"
          id="price-range-header"
        >
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">
                ${priceRange[0]}
              </Typography>
              <Typography variant="body2">
                ${priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="categories-content"
          id="categories-header"
        >
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {CATEGORIES.map(category => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox 
                    checked={selectedCategories.includes(category.id)} 
                    onChange={() => handleCategoryChange(category.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">{category.name}</Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="brands-content"
          id="brands-header"
        >
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {BRANDS.map(brand => (
              <FormControlLabel
                key={brand.id}
                control={
                  <Checkbox 
                    checked={selectedBrands.includes(brand.id)} 
                    onChange={() => handleBrandChange(brand.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">{brand.name}</Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="rating-content"
          id="rating-header"
        >
          <Typography>Customer Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" gutterBottom>
              {minRating === 0 ? 'Any rating' : `${minRating}+ stars`}
            </Typography>
            <Slider
              value={minRating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={5}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Rating value={minRating} readOnly size="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                & Up
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        
        {getActiveFilterCount() > 0 && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Reset Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ProductFilters; 