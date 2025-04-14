import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

// Load wishlist from localStorage or initialize empty
const loadWishlistFromStorage = () => {
  try {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : { items: [] };
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return { items: [] };
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

const wishlistReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) {
        return state; // Item already in wishlist
      }
      newState = {
        ...state,
        items: [...state.items, action.payload],
      };
      return newState;

    case 'REMOVE_FROM_WISHLIST':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      return newState;
      
    case 'CLEAR_WISHLIST':
      newState = {
        ...state,
        items: [],
      };
      return newState;
      
    case 'INITIALIZE_WISHLIST':
      return action.payload;

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, null, loadWishlistFromStorage);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    saveWishlistToStorage(state);
  }, [state]);

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 