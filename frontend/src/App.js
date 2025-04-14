import React, { useState, useEffect } from 'react';
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
  Grid,
  Snackbar,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
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
  Close,
  Clear
} from '@mui/icons-material';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import Wishlist from './components/Wishlist';
import ProductFilters from './components/ProductFilters';
import Banner from './components/Banner';
import BackToTop from './components/BackToTop';
import Categories from './components/Categories';
import Deals from './components/Deals';
import About from './components/About';
import Contact from './components/Contact';
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

// Cookie Consent Banner Component
const CookieConsent = ({ open, onAccept, onDecline, onSettings }) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ 
        width: '100%',
        maxWidth: '600px',
        bottom: '24px',
        left: { xs: '50%', sm: 'auto' },
        right: { xs: 'auto', sm: '24px' },
        transform: { xs: 'translateX(-50%)', sm: 'none' }
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          width: '100%',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h6" gutterBottom>Cookie Consent</Typography>
        <Typography variant="body2" paragraph>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" onClick={onDecline} color="inherit">Decline</Button>
          <Button size="small" onClick={onSettings} color="primary">Customize</Button>
          <Button size="small" onClick={onAccept} variant="contained" color="primary">Accept All</Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};

// Legal Disclaimer Dialog
const LegalDisclaimerDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="legal-disclaimer-title">
        <Typography variant="h5" fontWeight="bold">Legal Disclaimer & Privacy Policy</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom fontWeight="bold">1. Introduction</Typography>
        <Typography paragraph>
          Welcome to E·Shop ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. By continuing to use this website, you consent to the terms of this Privacy Policy.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">2. Information We Collect</Typography>
        <Typography paragraph>
          <strong>Personal Data:</strong> We may collect personal identification information, including but not limited to names, email addresses, phone numbers, billing addresses, shipping addresses, and payment details.
        </Typography>
        <Typography paragraph>
          <strong>Usage Data:</strong> We automatically collect information on how you access and use our website, such as your IP address, browser type, referring/exit pages, operating system, date/time stamps, and clickstream data.
        </Typography>
        <Typography paragraph>
          <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to collect information about your browsing and purchasing behavior.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">3. How We Use Your Information</Typography>
        <Typography>We use the information we collect to:</Typography>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your orders, products, and services</li>
          <li>Provide customer support</li>
          <li>Improve our website and services</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Prevent fraud and enhance security</li>
          <li>Comply with legal obligations</li>
        </ul>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">4. Your Rights Under GDPR</Typography>
        <Typography paragraph>
          If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR), including:
        </Typography>
        <ul>
          <li>Right to access your personal data</li>
          <li>Right to rectify inaccurate personal data</li>
          <li>Right to erasure of your personal data</li>
          <li>Right to restrict processing of your personal data</li>
          <li>Right to data portability</li>
          <li>Right to object to processing of your personal data</li>
          <li>Right to withdraw consent</li>
        </ul>
        <Typography paragraph>
          To exercise these rights, please contact us at privacy@eshop.com.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">5. Data Security</Typography>
        <Typography paragraph>
          We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">6. Data Retention</Typography>
        <Typography paragraph>
          We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">7. Third-Party Disclosure</Typography>
        <Typography paragraph>
          We may share your information with third-party service providers who perform services on our behalf, such as payment processing, order fulfillment, data analysis, email delivery, and customer service.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">8. Changes to This Privacy Policy</Typography>
        <Typography paragraph>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Typography>
        
        <Typography variant="h6" gutterBottom fontWeight="bold">9. Contact Us</Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy, please contact us at:
        </Typography>
        <Typography>
          E·Shop<br />
          123 E-Commerce Street<br />
          Shopping District<br />
          New York, NY 10001<br />
          Email: privacy@eshop.com<br />
          Phone: +1 (555) 123-4567
        </Typography>
        
        <Box sx={{ mt: 3, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">Last Updated: May 30, 2023</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onClose}>I Accept</Button>
      </DialogActions>
    </Dialog>
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
  const [cookieConsentOpen, setCookieConsentOpen] = useState(false);
  const [legalDisclaimerOpen, setLegalDisclaimerOpen] = useState(false);
  
  // Check if cookie consent has been given before
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setCookieConsentOpen(true);
    }
  }, []);
  
  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookieConsentOpen(false);
  };
  
  const handleCookieDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setCookieConsentOpen(false);
  };
  
  const handleCookieSettings = () => {
    // In a real app, this would open more detailed cookie settings
    // For now, we'll just show the legal disclaimer
    setLegalDisclaimerOpen(true);
  };
  
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {(filters.searchQuery || 
                      filters.priceRange[0] > 0 || 
                      filters.priceRange[1] < 1000 || 
                      filters.categories.length > 0 || 
                      filters.brands.length > 0 || 
                      filters.minRating > 0 || 
                      filters.sort !== 'popular') && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        startIcon={<Clear />}
                        onClick={() => {
                          setFilters({
                            searchQuery: '',
                            priceRange: [0, 1000],
                            categories: [],
                            brands: [],
                            minRating: 0,
                            sort: 'popular'
                          });
                        }}
                        sx={{
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={
                        <Badge 
                          color="primary" 
                          variant="dot" 
                          invisible={!filters.searchQuery && 
                                    filters.priceRange[0] === 0 && 
                                    filters.priceRange[1] === 1000 && 
                                    filters.categories.length === 0 && 
                                    filters.brands.length === 0 && 
                                    filters.minRating === 0 &&
                                    filters.sort === 'popular'}
                        >
                          <FilterList />
                        </Badge>
                      }
                      onClick={() => setFilterDrawerOpen(true)}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Filters
                      {(filters.searchQuery || 
                       filters.priceRange[0] > 0 || 
                       filters.priceRange[1] < 1000 || 
                       filters.categories.length > 0 || 
                       filters.brands.length > 0 || 
                       filters.minRating > 0 || 
                       filters.sort !== 'popular') && (
                        <Box 
                          component="span" 
                          sx={{ 
                            ml: 1, 
                            bgcolor: 'primary.main', 
                            color: 'primary.contrastText',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            py: 0.2,
                            px: 0.5,
                            borderRadius: 5,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {(filters.searchQuery ? 1 : 0) + 
                           ((filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) ? 1 : 0) + 
                           (filters.categories.length > 0 ? 1 : 0) + 
                           (filters.brands.length > 0 ? 1 : 0) + 
                           (filters.minRating > 0 ? 1 : 0) + 
                           (filters.sort !== 'popular' ? 1 : 0)}
                        </Box>
                      )}
                    </Button>
                  </Box>
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
                      initialFilters={filters}
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
        
        {view === 'categories' && (
          <Categories 
            onViewCategory={(categoryId) => {
              console.log(`Viewing category: ${categoryId}`);
              // In a real implementation, you would filter products by category
              setView('products');
            }}
            onViewProduct={handleViewProduct}
          />
        )}
        
        {view === 'deals' && (
          <Deals 
            onViewProduct={handleViewProduct}
          />
        )}
        
        {view === 'about' && (
          <About />
        )}
        
        {view === 'contact' && (
          <Contact />
        )}
        
        {/* Additional views can be added here */}
      </Box>
      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} E·Shop. All rights reserved.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => setLegalDisclaimerOpen(true)}
              underline="hover"
            >
              Privacy Policy
            </Link>
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => setLegalDisclaimerOpen(true)}
              underline="hover"
            >
              Terms of Service
            </Link>
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => setCookieConsentOpen(true)}
              underline="hover"
            >
              Cookie Settings
            </Link>
            <Link 
              href="#/contact" 
              variant="body2"
              underline="hover"
            >
              Contact Us
            </Link>
          </Box>
        </Container>
      </Box>
      
      {/* Back to Top Button */}
      <BackToTop threshold={300} />
      
      {/* Cookie Consent Banner */}
      <CookieConsent 
        open={cookieConsentOpen}
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
        onSettings={handleCookieSettings}
      />
      
      {/* Legal Disclaimer Dialog */}
      <LegalDisclaimerDialog
        open={legalDisclaimerOpen}
        onClose={() => setLegalDisclaimerOpen(false)}
      />
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
