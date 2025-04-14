import React, { useRef } from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { styled } from '@mui/material/styles';

// Styled container for the scrollable area
const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  WebkitOverflowScrolling: 'touch',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  padding: theme.spacing(1, 0),
  margin: theme.spacing(0, -1.5), // To align with the outer container negative margin
}));

// Styled card container to ensure consistent sizing
const CardContainer = styled(Box)(({ theme }) => ({
  flex: '0 0 auto',
  width: '100%',
  padding: theme.spacing(1.5),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
  [theme.breakpoints.up('md')]: {
    width: '25%',
  },
}));

// Navigation arrow container
const NavArrow = styled(IconButton)(({ theme, direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  color: theme.palette.primary.main,
  zIndex: 2,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  ...(direction === 'left' ? { left: 0 } : { right: 0 }),
}));

const RecentlyViewed = ({ products, onViewProduct }) => {
  const scrollContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Scroll logic
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', mt: 5, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        Recently Viewed
      </Typography>
      
      <Box sx={{ position: 'relative', mx: 1.5 }}>
        {!isMobile && (
          <>
            <NavArrow 
              direction="left" 
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ArrowBackIos fontSize="small" />
            </NavArrow>
            
            <NavArrow 
              direction="right" 
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ArrowForwardIos fontSize="small" />
            </NavArrow>
          </>
        )}
        
        <ScrollContainer ref={scrollContainerRef}>
          {products.map((product) => (
            <CardContainer key={product.id}>
              <ProductCard product={product} onViewProduct={onViewProduct} />
            </CardContainer>
          ))}
        </ScrollContainer>
      </Box>
    </Box>
  );
};

export default RecentlyViewed; 