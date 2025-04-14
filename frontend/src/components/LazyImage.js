import React, { useState, useEffect } from 'react';
import { Skeleton, Box } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';

const LazyImage = ({ 
  src, 
  alt, 
  placeholderHeight = 200, 
  style = {}, 
  effect = 'blur',
  threshold = 100,
  errorPlaceholder,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setLoaded(false);
    setError(false);
    
    // Create a new image
    const img = new Image();
    img.src = src;
    
    // When the image loads, set loaded to true
    img.onload = () => {
      setImageSrc(src);
      setLoaded(true);
    };
    
    // Handle load error
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setError(true);
      setLoaded(true); // Still set loaded to true to avoid eternal loading
    };
  }, [src]);
  
  // Styles for different loading effects
  const getEffectStyles = () => {
    if (!loaded) return {};
    
    switch (effect) {
      case 'blur':
        return {
          filter: loaded ? 'blur(0)' : 'blur(10px)',
          transition: 'filter 0.5s ease-in-out',
        };
      case 'fade':
      case 'opacity':
        return {
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        };
      case 'zoom':
        return {
          transform: loaded ? 'scale(1)' : 'scale(1.05)',
          transition: 'transform 0.5s ease-in-out',
        };
      default:
        return {};
    }
  };
  
  const imageStyles = {
    ...style,
    ...getEffectStyles()
  };

  // Show skeleton while loading
  if (!loaded) {
    return (
      <Skeleton 
        variant="rectangular" 
        height={placeholderHeight} 
        width={style.width || '100%'} 
        animation="wave"
        sx={{ 
          borderRadius: style.borderRadius || 0,
          bgcolor: 'rgba(0, 0, 0, 0.1)'
        }}
      />
    );
  }

  // Show error placeholder if image failed to load
  if (error) {
    return errorPlaceholder || (
      <Box
        sx={{
          height: placeholderHeight,
          width: style.width || '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: style.borderRadius || 0,
          color: 'text.secondary'
        }}
      >
        <BrokenImage fontSize="large" />
      </Box>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt}
      style={imageStyles}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage; 