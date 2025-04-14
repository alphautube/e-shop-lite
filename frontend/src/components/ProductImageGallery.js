import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  IconButton,
  ButtonBase,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import {
  ZoomIn,
  Close,
  ArrowForwardIos,
  ArrowBackIos
} from '@mui/icons-material';

const ZoomableImage = ({ src, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);

  const handleMouseMove = (e) => {
    if (!showZoom) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setPosition({ x, y });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: showZoom ? 'zoom-out' : 'zoom-in',
        height: '100%',
        width: '100%'
      }}
      onClick={() => setShowZoom(!showZoom)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {showZoom && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${zoomLevel * 100}%`,
            zIndex: 1
          }}
        />
      )}
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 2,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          color: 'white'
        }}
      >
        <ZoomIn />
      </Box>
    </Box>
  );
};

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handleOpenModal = () => {
    setModalImageIndex(selectedImage);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePrevImage = () => {
    setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // If no images are provided, show a placeholder
  if (!images.length) {
    images = ['/placeholder-image.jpg'];
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 2,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={handleOpenModal}
      >
        <ZoomableImage
          src={images[selectedImage]}
          alt={`Product image ${selectedImage + 1}`}
        />
      </Paper>

      {images.length > 1 && (
        <Grid container spacing={1}>
          {images.map((image, index) => (
            <Grid item key={index} xs={3} sm={2} md={2}>
              <ButtonBase
                onClick={() => handleThumbnailClick(index)}
                sx={{ 
                  width: '100%',
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={selectedImage === index ? 4 : 1}
                  sx={{
                    p: 0.5,
                    width: '100%',
                    height: 80,
                    border: selectedImage === index ? '2px solid' : '1px solid',
                    borderColor: selectedImage === index ? 'primary.main' : 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Paper>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '80%', md: '70%' },
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              outline: 'none',
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: 1
              }}
            >
              <IconButton onClick={handleCloseModal} size="small">
                <Close />
              </IconButton>
            </Box>
            
            <Box
              sx={{
                position: 'relative',
                flex: 1,
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={images[modalImageIndex]}
                alt={`Product image ${modalImageIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              
              {images.length > 1 && (
                <>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      left: 10,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                    onClick={handlePrevImage}
                  >
                    <ArrowBackIos />
                  </IconButton>
                  
                  <IconButton
                    sx={{
                      position: 'absolute',
                      right: 10,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                    onClick={handleNextImage}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </>
              )}
            </Box>
            
            {images.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                  gap: 1,
                  overflowX: 'auto',
                  py: 1
                }}
              >
                {images.map((image, index) => (
                  <ButtonBase
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    sx={{
                      width: 60,
                      height: 60,
                      border: modalImageIndex === index ? '2px solid' : '1px solid',
                      borderColor: modalImageIndex === index ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </ButtonBase>
                ))}
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ProductImageGallery; 