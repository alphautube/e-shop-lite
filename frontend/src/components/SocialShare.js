import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Pinterest,
  Email,
  Link as LinkIcon,
  Close
} from '@mui/icons-material';

const SocialShare = ({ title, description, imageUrl, url }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Fallback to current URL if no URL is provided
  const shareUrl = url || window.location.href;
  
  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');
  const encodedImage = encodeURIComponent(imageUrl || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleOpenShareDialog = () => {
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  const handleShareClick = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setSnackbar({ open: true, message: 'Link copied to clipboard!' });
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Failed to copy link.' });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Share on Facebook">
          <IconButton color="primary" onClick={() => handleShareClick('facebook')}>
            <Facebook />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Share on Twitter">
          <IconButton color="primary" onClick={() => handleShareClick('twitter')}>
            <Twitter />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Share on Pinterest">
          <IconButton color="primary" onClick={() => handleShareClick('pinterest')}>
            <Pinterest />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Share via Email">
          <IconButton color="primary" onClick={() => handleShareClick('email')}>
            <Email />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Copy Link">
          <IconButton color="primary" onClick={handleCopyLink}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog open={shareDialogOpen} onClose={handleCloseShareDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Share this Product</Typography>
            <IconButton edge="end" onClick={handleCloseShareDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={shareUrl}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Button 
                    variant="contained" 
                    onClick={handleCopyLink}
                    sx={{ ml: 1 }}
                  >
                    Copy
                  </Button>
                )
              }}
            />
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Share on social media
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
            {[
              { platform: 'facebook', icon: <Facebook fontSize="large" />, color: '#1877F2' },
              { platform: 'twitter', icon: <Twitter fontSize="large" />, color: '#1DA1F2' },
              { platform: 'pinterest', icon: <Pinterest fontSize="large" />, color: '#E60023' },
              { platform: 'email', icon: <Email fontSize="large" />, color: '#D44638' }
            ].map(item => (
              <IconButton 
                key={item.platform}
                onClick={() => handleShareClick(item.platform)}
                sx={{ 
                  bgcolor: item.color, 
                  color: 'white',
                  '&:hover': {
                    bgcolor: item.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SocialShare; 