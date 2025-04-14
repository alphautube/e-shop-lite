import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

// Styled component for the banner container
const BannerContainer = styled(Box)(({ theme, height }) => ({
  position: 'relative',
  width: '100%',
  height: height || '300px',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    height: height ? `calc(${height} * 0.7)` : '200px',
  },
}));

// Styled component for the image
const BannerImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out',
});

// Overlay content container
const OverlayContent = styled(Box)(({ theme, alignment, gradientDirection }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: alignment === 'center' ? 'center' : 'flex-start',
  background: gradientDirection === 'left' 
    ? 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
    : gradientDirection === 'right'
      ? 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
      : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)',
  color: 'white',
  padding: theme.spacing(2),
  transition: 'opacity 0.3s ease-in-out',
}));

// Styled navigation arrows
const NavArrow = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  color: 'white',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
}));

// Styled dots for pagination
const DotContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 2,
}));

const Dot = styled(Box)(({ theme, active }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.8)',
  },
}));

// Default banner data for carousel
const DEFAULT_BANNERS = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Discover Trending Articles',
    subtitle: 'Explore our collection of fashion, electronics, home goods and more',
    buttonText: 'Shop Now',
    textAlignment: 'left',
    gradientDirection: 'left',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    buttonText: 'View Deals',
    textAlignment: 'right',
    gradientDirection: 'right',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'New Arrivals',
    subtitle: 'Check out our latest fashion collection',
    buttonText: 'Shop Collection',
    textAlignment: 'center',
    gradientDirection: 'top',
  },
];

const Banner = ({ 
  banners = DEFAULT_BANNERS,
  onButtonClick,
  height = '350px',
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const currentBanner = banners[currentIndex];
  const isTextCenter = currentBanner.textAlignment === 'center';
  
  // Function to navigate to the next slide
  const handleNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Function to navigate to the previous slide
  const handlePrev = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Function to directly navigate to a specific slide
  const handleDotClick = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex, isTransitioning]);
  
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      overflow: 'hidden',
      marginLeft: 0,
      marginRight: 0,
      px: 0,
      position: 'relative'
    }}>
      <BannerContainer height={height}>
        <BannerImage 
          src={currentBanner.imageUrl} 
          alt={currentBanner.title} 
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        />
        <OverlayContent 
          alignment={currentBanner.textAlignment} 
          gradientDirection={currentBanner.gradientDirection}
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <Container maxWidth="lg" sx={{ textAlign: isTextCenter ? 'center' : 'left' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                maxWidth: isTextCenter ? '90%' : { xs: '90%', sm: '70%', md: '60%' },
                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                mx: isTextCenter ? 'auto' : 0
              }}
            >
              {currentBanner.title}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                maxWidth: isTextCenter ? '80%' : { xs: '90%', sm: '60%', md: '50%' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
                mx: isTextCenter ? 'auto' : 0
              }}
            >
              {currentBanner.subtitle}
            </Typography>
            {currentBanner.buttonText && (
              <Button 
                variant="contained" 
                size="large"
                onClick={() => onButtonClick && onButtonClick(currentIndex)}
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  px: { xs: 2, sm: 3 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {currentBanner.buttonText}
              </Button>
            )}
          </Container>
        </OverlayContent>
      </BannerContainer>
      
      {/* Navigation Arrows */}
      <NavArrow 
        onClick={handlePrev} 
        sx={{ left: { xs: '8px', md: '16px' } }}
        aria-label="Previous banner"
      >
        <KeyboardArrowLeft />
      </NavArrow>
      
      <NavArrow 
        onClick={handleNext} 
        sx={{ right: { xs: '8px', md: '16px' } }}
        aria-label="Next banner"
      >
        <KeyboardArrowRight />
      </NavArrow>
      
      {/* Pagination Dots */}
      <DotContainer>
        {banners.map((_, index) => (
          <Dot 
            key={index} 
            active={index === currentIndex} 
            onClick={() => handleDotClick(index)}
          />
        ))}
      </DotContainer>
    </Box>
  );
};

export default Banner; 