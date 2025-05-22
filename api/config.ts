// API configuration
export const API_URL = 'http://172.20.6.156:8000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  login: '/api-token-auth/',
  register: '/api/register/',
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  orders: '/api/orders/',
  newOrders: '/api/new-orders/',
  myOrders: '/api/my-orders/',
  orderTracking: (orderId: string) => `/api/order-tracking/${orderId}/`,
  updateOrderStatus: (orderId: string) => `/api/update-order-status/${orderId}/`,
};

// Location endpoints
export const LOCATION_ENDPOINTS = {
  locations: '/api/locations/',
};
