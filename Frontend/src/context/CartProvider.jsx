import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial cart state
const initialState = {
  cartItems: [],
};

// Reducer function to handle cart actions
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload }],
        };
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item._id !== action.payload),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    case 'LOAD_CART':
      return {
        ...state,
        cartItems: action.payload,
      };

    default:
      return state;
  }
}

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('smartElectronicsCart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('smartElectronicsCart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Utility function to validate and clean cart items
  const validateAndCleanCart = () => {
    const validItems = state.cartItems.filter(item => {
      // Check if item has a valid MongoDB ObjectId format (24 hex characters)
      const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(item._id);
      if (!isValidObjectId) {
        console.warn('Removing invalid cart item:', item.name, 'ID:', item._id);
        return false;
      }
      return true;
    });

    if (validItems.length !== state.cartItems.length) {
      // Update cart with only valid items
      dispatch({ type: 'CLEAR_CART' });
      validItems.forEach(item => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      });
      return true; // Indicates cleaning was performed
    }
    return false; // No cleaning needed
  };

  // Get total items count
  const getTotalItems = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        validateAndCleanCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart
export const useCart = () => useContext(CartContext);
