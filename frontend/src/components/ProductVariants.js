import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  Grid,
  Button,
  Chip,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled color swatch
const ColorSwatch = styled(Box)(({ theme, selected, available }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  cursor: available ? 'pointer' : 'default',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid #ddd',
  opacity: available ? 1 : 0.4,
  boxShadow: selected ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}` : 'none',
  transition: 'all 0.2s',
  '&:hover': {
    transform: available ? 'scale(1.05)' : 'none',
  }
}));

// Styled size button
const SizeButton = styled(Button)(({ theme, selected, available }) => ({
  minWidth: 50,
  height: 36,
  padding: theme.spacing(0, 1),
  marginRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #ddd',
  color: selected ? theme.palette.primary.contrastText : (available ? theme.palette.text.primary : theme.palette.text.disabled),
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  opacity: available ? 1 : 0.5,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : (available ? '#f5f5f5' : 'transparent'),
  },
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
    backgroundColor: 'transparent',
    borderColor: '#eee',
    cursor: 'not-allowed',
  }
}));

const ProductVariants = ({ 
  variants = [], 
  selectedVariant, 
  onVariantChange, 
  selectedOptions = {}, 
  onOptionChange, 
  errors = {} 
}) => {
  // Group options by type (e.g. color, size)
  const optionsByType = useMemo(() => {
    const result = {};
    
    variants.forEach(variant => {
      if (variant.options) {
        Object.entries(variant.options).forEach(([type, value]) => {
          if (!result[type]) {
            result[type] = new Set();
          }
          result[type].add(value);
        });
      }
    });
    
    // Convert sets to arrays
    return Object.entries(result).reduce((acc, [type, values]) => {
      acc[type] = Array.from(values);
      return acc;
    }, {});
  }, [variants]);
  
  // Find variants that match current selection
  const findMatchingVariants = (options) => {
    return variants.filter(variant => {
      // Check if all selected options match this variant
      return Object.entries(options).every(([type, value]) => {
        return variant.options[type] === value;
      });
    });
  };
  
  // Check if an option is available with current selections
  const isOptionAvailable = (type, value) => {
    // Create a copy of selected options and set the new option
    const optionsCopy = { ...selectedOptions };
    
    // Remove the current type being checked to avoid circular dependency
    const currentTypeValue = optionsCopy[type];
    delete optionsCopy[type];
    
    // Find variants that match these options
    const matchingVariants = variants.filter(variant => {
      // Check if this variant has the option value we're testing
      if (variant.options[type] !== value) return false;
      
      // Check if all other selected options match this variant
      return Object.entries(optionsCopy).every(([t, v]) => {
        return variant.options[t] === v;
      });
    });
    
    // If any matching variants exist, this option is available
    return matchingVariants.length > 0;
  };
  
  // Handle option selection
  const handleSelectOption = (type, value) => {
    // Skip if option is not available
    if (!isOptionAvailable(type, value)) return;
    
    // Update selected options
    const newOptions = { ...selectedOptions, [type]: value };
    onOptionChange(newOptions);
    
    // Find matching variant based on selected options
    const matchingVariants = findMatchingVariants(newOptions);
    
    // If we have an exact match with all options selected, update the selected variant
    const optionCount = Object.keys(optionsByType).length;
    const selectedOptionCount = Object.keys(newOptions).length;
    
    if (matchingVariants.length === 1 && selectedOptionCount === optionCount) {
      onVariantChange(matchingVariants[0]);
    } else if (selectedVariant && matchingVariants.length !== 1) {
      // If we had a selected variant but no longer have a unique match, clear it
      onVariantChange(null);
    }
  };
  
  // Reset options if variants change
  useEffect(() => {
    if (variants.length === 0) {
      onOptionChange({});
      onVariantChange(null);
    }
  }, [variants, onOptionChange, onVariantChange]);
  
  // Render color options
  const renderColorOptions = () => {
    const colors = optionsByType['color'];
    if (!colors) return null;
    
    // Color name to CSS color map
    const colorMap = {
      'Black': '#000000',
      'White': '#ffffff',
      'Red': '#ff0000',
      'Blue': '#0066cc',
      'Green': '#00cc66',
      'Yellow': '#ffcc00',
      'Purple': '#9900cc',
      'Pink': '#ff66cc',
      'Orange': '#ff6600',
      'Gray': '#999999',
    };
    
    return (
      <FormControl 
        fullWidth 
        error={Boolean(errors['color'])} 
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Color
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {colors.map(color => {
            const available = isOptionAvailable('color', color);
            const selected = selectedOptions['color'] === color;
            
            return (
              <Box key={color} sx={{ textAlign: 'center' }}>
                <ColorSwatch
                  sx={{ 
                    backgroundColor: colorMap[color] || color,
                    border: color === 'White' ? '1px solid #ddd' : undefined,
                    mb: 0.5
                  }}
                  onClick={() => available && handleSelectOption('color', color)}
                  selected={selected}
                  available={available}
                />
                <Typography variant="caption" display="block">
                  {color}
                </Typography>
              </Box>
            );
          })}
        </Box>
        {errors['color'] && <FormHelperText>{errors['color']}</FormHelperText>}
      </FormControl>
    );
  };
  
  // Render size options
  const renderSizeOptions = () => {
    const sizes = optionsByType['size'];
    if (!sizes) return null;
    
    return (
      <FormControl 
        fullWidth 
        error={Boolean(errors['size'])} 
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Size
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sizes.map(size => {
            const available = isOptionAvailable('size', size);
            const selected = selectedOptions['size'] === size;
            
            return (
              <SizeButton
                key={size}
                onClick={() => available && handleSelectOption('size', size)}
                selected={selected}
                available={available}
                disabled={!available}
                sx={{ mb: 1 }}
              >
                {size}
              </SizeButton>
            );
          })}
        </Box>
        {errors['size'] && <FormHelperText>{errors['size']}</FormHelperText>}
      </FormControl>
    );
  };
  
  // Render other option types (storage, material, etc.)
  const renderOtherOptions = () => {
    return Object.entries(optionsByType).map(([type, values]) => {
      // Skip color and size which are handled separately
      if (type === 'color' || type === 'size') return null;
      
      return (
        <FormControl 
          key={type} 
          fullWidth 
          error={Boolean(errors[type])} 
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {values.map(value => {
              const available = isOptionAvailable(type, value);
              const selected = selectedOptions[type] === value;
              
              return (
                <Chip
                  key={value}
                  label={value}
                  onClick={() => available && handleSelectOption(type, value)}
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'filled' : 'outlined'}
                  disabled={!available}
                  sx={{ mb: 1 }}
                />
              );
            })}
          </Box>
          {errors[type] && <FormHelperText>{errors[type]}</FormHelperText>}
        </FormControl>
      );
    });
  };
  
  // If no variants, return null
  if (variants.length === 0) return null;
  
  // Show stock level alerts for selected variant
  const renderStockAlert = () => {
    if (!selectedVariant) return null;
    
    if (selectedVariant.stock === 0) {
      return (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          Out of stock
        </Alert>
      );
    } else if (selectedVariant.stock <= 3) {
      return (
        <Alert severity="warning" sx={{ mt: 1, mb: 2 }}>
          Low stock: Only {selectedVariant.stock} left
        </Alert>
      );
    }
    
    return null;
  };
  
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderColorOptions()}
          {renderSizeOptions()}
          {renderOtherOptions()}
          {renderStockAlert()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductVariants; 