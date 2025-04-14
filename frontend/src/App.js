import React, { useState } from 'react';
import { 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Badge, 
  IconButton, 
  Box, 
  Container,
  Button,
  useScrollTrigger,
  Slide,
  InputBase,
  alpha,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Grid
} from '@mui/material';
import { 
  ShoppingCart, 
  Search as SearchIcon, 
  Person, 
  Favorite, 
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Home,
  Category,
  LocalOffer,
  Info,
  ContactSupport,
  Settings,
  ExitToApp,
  FilterList,
  Close
} from '@mui/icons-material';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import Wishlist from './components/Wishlist';
import ProductFilters from './components/ProductFilters';
import Banner from './components/Banner';
import BackToTop from './components/BackToTop';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import ThemeProvider, { useColorMode } from './theme/ThemeContext';

// Hide AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const ThemeToggleButton = () => {
  const { mode, toggleColorMode } = useColorMode();
  
  return (
    <IconButton color="inherit" onClick={toggleColorMode}>
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

const SideMenu = ({ open, onClose, onNavigate }) => {
  const theme = useTheme();
  const menuItems = [
    { text: 'Home', icon: <Home />, view: 'products' },
    { text: 'Categories', icon: <Category />, view: 'categories' },
    { text: 'Deals', icon: <LocalOffer />, view: 'deals' },
    { text: 'Wishlist', icon: <Favorite />, view: 'wishlist' },
    { text: 'About', icon: <Info />, view: 'about' },
    { text: 'Contact', icon: <ContactSupport />, view: 'contact' }
  ];
  
  const handleItemClick = (view) => {
    onNavigate(view);
    onClose();
  };
  
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 280 }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          E·Shop
        </Typography>
        <ThemeToggleButton />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => handleItemClick(item.view)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Sign In" />
        </ListItem>
      </List>
    </Drawer>
  );
};

const Header = ({ onCheckout, onNavigate }) => {
  const { getCartItemsCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed">
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <IconButton 
                edge="start" 
                color="inherit" 
                sx={{ mr: 2 }}
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ 
                  fontWeight: 'bold', 
                  flexGrow: { xs: 1, md: 0 },
                  mr: { md: 4 }
                }}
                onClick={() => onNavigate('products')}
                style={{ cursor: 'pointer' }}
              >
                E·Shop
              </Typography>

              {!isMobile && (
                <Box sx={{ display: 'flex', mr: 4 }}>
                  <Button 
                    color="inherit" 
                    sx={{ mr: 2 }}
                    onClick={() => onNavigate('products')}
                  >
                    Home
                  </Button>
                  <Button 
                    color="inherit" 
                    sx={{ mr: 2 }}
                    onClick={() => onNavigate('categories')}
                  >
                    Categories
                  </Button>
                  <Button 
                    color="inherit" 
                    sx={{ mr: 2 }}
                    onClick={() => onNavigate('deals')}
                  >
                    Deals
                  </Button>
                  <Button 
                    color="inherit"
                    onClick={() => onNavigate('wishlist')}
                  >
                    Wishlist
                  </Button>
                </Box>
              )}
              
              <Box sx={{ 
                flexGrow: 1, 
                position: 'relative',
                backgroundColor: alpha('#fff', 0.15),
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.25),
                },
                borderRadius: 1,
                px: 1,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center'
              }}>
                <SearchIcon sx={{ mx: 1 }} />
                <InputBase
                  placeholder="Search products…"
                  sx={{ 
                    flex: 1,
                    color: 'inherit',
                    '& .MuiInputBase-input': {
                      py: 1
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex' }}>
                <ThemeToggleButton />
                <IconButton 
                  color="inherit" 
                  sx={{ ml: 1 }}
                  onClick={() => onNavigate('wishlist')}
                >
                  <Badge 
                    badgeContent={wishlistItems.length} 
                    color="secondary"
                  >
                    <Favorite />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <Person />
                </IconButton>
                <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => setCartOpen(true)}>
                  <Badge badgeContent={getCartItemsCount()} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Toolbar /> {/* Empty toolbar for spacing */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={onCheckout} />
      <SideMenu 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        onNavigate={onNavigate} 
      />
    </>
  );
};

function AppContent() {
  const [view, setView] = useState('products'); // 'products', 'product-detail', 'checkout', 'wishlist', etc.
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [lastOrderNumber, setLastOrderNumber] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    minRating: 0,
    sort: 'popular'
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  const handleViewProduct = (productId) => {
    setSelectedProductId(productId);
    setView('product-detail');
  };
  
  const handleBackToProducts = () => {
    setView('products');
  };
  
  const handleCheckout = () => {
    setView('checkout');
  };
  
  const handleOrderComplete = (orderNumber) => {
    setLastOrderNumber(orderNumber);
    setView('products');
    // Could show a snackbar notification here if needed
  };
  
  const handleNavigate = (newView) => {
    setView(newView);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBannerButtonClick = (bannerIndex) => {
    console.log(`Banner ${bannerIndex} button clicked`);
    // You can implement specific actions based on which banner was clicked
    // For example, navigate to a specific category or promotion page
  };
  
  return (
    <>
      <CssBaseline />
      <Header 
        onCheckout={handleCheckout} 
        onNavigate={handleNavigate}
      />
      <Box component="main" sx={{ minHeight: '100vh', pb: 8 }}>
        {view === 'products' && (
          <>
            <Box sx={{ width: '100%', maxWidth: '100%', px: 0, mt: -2 }}>
              <Banner 
                onButtonClick={handleBannerButtonClick}
                height="400px"
                autoPlay={true}
                interval={6000}
              />
            </Box>
            <Container maxWidth="lg">
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" component="h1">Products</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setFilterDrawerOpen(true)}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Filters
                  </Button>
                </Box>
                
                <ProductList 
                  onViewProduct={handleViewProduct} 
                  filters={filters}
                />
                
                <Drawer
                  anchor="left"
                  open={filterDrawerOpen}
                  onClose={() => setFilterDrawerOpen(false)}
                  PaperProps={{
                    sx: { width: { xs: '85%', sm: '350px' } }
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Filters</Typography>
                    <IconButton onClick={() => setFilterDrawerOpen(false)}>
                      <Close />
                    </IconButton>
                  </Box>
                  <Divider />
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <ProductFilters 
                      onFilterChange={(newFilters) => {
                        handleFilterChange(newFilters);
                        setFilterDrawerOpen(false);
                      }} 
                    />
                  </Box>
                </Drawer>
              </Box>
            </Container>
          </>
        )}
        
        {view === 'product-detail' && (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={handleBackToProducts} 
          />
        )}
        
        {view === 'checkout' && (
          <Checkout 
            onBackToShopping={handleBackToProducts}
            onOrderComplete={handleOrderComplete}
          />
        )}
        
        {view === 'wishlist' && (
          <Wishlist 
            onBackToShopping={handleBackToProducts}
            onViewProduct={handleViewProduct}
          />
        )}
        
        {/* Additional views can be added here */}
      </Box>
      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            © {new Date().getFullYear()} E·Shop. All rights reserved.
          </Typography>
        </Container>
      </Box>
      
      {/* Back to Top Button */}
      <BackToTop threshold={300} />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
