import apiClient from './client';
import { ORDER_ENDPOINTS } from './config';

// API response interface
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Interface for order data
export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  origin_name: string; 
  destination_name: string;
  vehicle_type: string;
  product_type: string;
  weight: string;
  price: number;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  driver_name?: string;
  estimated_arrival?: string;
  delivered_on?: string;
  reason?: string;
}

// Interface for order details
export interface OrderDetail extends Omit<Order, 'origin_name' | 'destination_name' | 'customer_name' | 'driver_name'> {
  origin: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  };
  customer: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  driver?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// OrderService class to interact with the orders API
class OrderService {
  // Get all orders (handled differently based on user role)
  public async getOrders(): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(ORDER_ENDPOINTS.orders);
  }
  
  // Get new orders (available for drivers to accept)
  public async getNewOrders(): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(ORDER_ENDPOINTS.newOrders);
  }
  
  // Get my orders (orders assigned to the current user)
  public async getMyOrders(): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(ORDER_ENDPOINTS.myOrders);
  }
  
  // Get order details by ID
  public async getOrderById(id: string): Promise<OrderDetail> {
    return apiClient.get<OrderDetail>(`${ORDER_ENDPOINTS.orders}${id}/`);
  }
  
  // Create a new order
  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    return apiClient.post<Order>(ORDER_ENDPOINTS.orders, orderData);
  }
  
  // Update order status
  public async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return apiClient.post<any>(
      ORDER_ENDPOINTS.updateOrderStatus(orderId),
      { status }
    );
  }
  
  // Get latest tracking info for an order
  public async getOrderTracking(orderId: string): Promise<{
    latitude: number;
    longitude: number;
    timestamp: string;
    progress: number;
  }> {
    return apiClient.get(ORDER_ENDPOINTS.orderTracking(orderId));
  }
}

// Export singleton instance
const orderService = new OrderService();
export default orderService;
