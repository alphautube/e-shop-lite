import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

const BackToTop = ({ threshold = 200, size = 'medium', color = 'primary' }) => {
  const [scrolled, setScrolled] = useState(false);
  
  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > threshold);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Zoom in={scrolled}>
      <Fab
        color={color}
        size={size}
        aria-label="scroll back to top"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export default BackToTop; 