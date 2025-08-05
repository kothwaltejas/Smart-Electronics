import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from '../api/axios';

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null };
    
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null
      };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.LOGOUT:
      return { ...initialState, isLoading: false };
    
    case actionTypes.UPDATE_PROFILE:
      return { ...state, user: { ...state.user, ...action.payload } };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount and validate with server
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Set axios header and validate token with server
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Validate token by making a request to the server
          const response = await axios.get('/auth/me').catch(() => null);
          
          if (response && response.data.user) {
            // Token is valid, update user data from server
            dispatch({
              type: actionTypes.SET_USER,
              payload: { user: response.data.user, token }
            });
          } else {
            // Token is invalid, clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            dispatch({ type: actionTypes.LOGOUT });
          }
        } catch (error) {
          console.error('Error validating auth token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          dispatch({ type: actionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password, isAdmin = false, adminCode = null) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      let endpoint, requestData;
      
      if (isAdmin) {
        endpoint = '/auth/admin/login';
        requestData = { email, password, adminCode: adminCode || 'SMART_ADMIN_2024' };
      } else {
        endpoint = '/auth/login';
        requestData = { email, password };
      }
      
      const response = await axios.post(endpoint, requestData);

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: actionTypes.SET_USER,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const requiresAdminLogin = error.response?.data?.requiresAdminLogin || false;
      
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage
      });
      return { 
        success: false, 
        error: errorMessage,
        requiresAdminLogin
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: actionTypes.SET_USER,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: actionTypes.LOGOUT });
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const response = await axios.put('/auth/profile', profileData);
      const updatedUser = response.data.user;

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      dispatch({
        type: actionTypes.UPDATE_PROFILE,
        payload: updatedUser
      });

      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Admin login with code
  const adminLogin = async (email, password, adminCode) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const response = await axios.post('/admin/login', {
        email,
        password,
        adminCode
      });

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: actionTypes.SET_USER,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    adminLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
