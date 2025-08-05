// Utility functions for order management

/**
 * Format order number for display with # prefix
 * @param {string} orderNumber - The order number from the database
 * @returns {string} - Formatted order number with # prefix
 */
export const formatOrderNumber = (orderNumber) => {
  return `#${orderNumber}`;
};

/**
 * Generate order number for display (short format)
 * @param {string} orderNumber - The order number from the database
 * @returns {string} - Short formatted order number
 */
export const getShortOrderNumber = (orderNumber) => {
  // For very long order numbers, show abbreviated version
  if (orderNumber && orderNumber.length > 10) {
    return `#${orderNumber.slice(-6)}`; // Show last 6 characters
  }
  return `#${orderNumber}`;
};

/**
 * Check if order can be cancelled based on status
 * @param {string} orderStatus - The current order status
 * @returns {boolean} - Whether the order can be cancelled
 */
export const canCancelOrder = (orderStatus) => {
  return ['pending', 'processing'].includes(orderStatus?.toLowerCase());
};

/**
 * Get order status color for UI components
 * @param {string} status - The order status
 * @returns {object} - Color configuration object
 */
export const getOrderStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': 
      return { bg: '#fff3cd', color: '#856404', severity: 'warning' };
    case 'processing': 
      return { bg: '#d1ecf1', color: '#0c5460', severity: 'info' };
    case 'shipped': 
      return { bg: '#d4edda', color: '#155724', severity: 'success' };
    case 'delivered': 
      return { bg: '#c3e6cb', color: '#155724', severity: 'success' };
    case 'cancelled': 
      return { bg: '#f8d7da', color: '#721c24', severity: 'error' };
    default: 
      return { bg: '#e2e3e5', color: '#383d41', severity: 'default' };
  }
};

/**
 * Format currency for display
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number') return `${currency}0`;
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date for order display
 * @param {string|Date} date - The date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatOrderDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-IN', defaultOptions);
};

/**
 * Get order priority based on status and creation date
 * @param {object} order - The order object
 * @returns {string} - Priority level (high, medium, low)
 */
export const getOrderPriority = (order) => {
  const now = new Date();
  const orderDate = new Date(order.createdAt);
  const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
  
  if (order.orderStatus === 'pending' && daysDiff > 2) return 'high';
  if (order.orderStatus === 'processing' && daysDiff > 5) return 'high';
  if (daysDiff > 1) return 'medium';
  return 'low';
};
