import apiClient from './client';
import { API_URL, ORDER_ENDPOINTS } from './config';

// Location types for GPS coordinates (latitude, longitude)
export type GeoLocation = {
  latitude: number;
  longitude: number;
  title?: string;
};

// Type definitions for delivery tracking data
export interface DeliveryTracking {
  id: number;
  order: number;
  current_location: string;
  latitude: number;
  longitude: number;
  progress_percentage: number;
  status: string;
  timestamp: string;
}

class TrackingService {
  // Get the latest tracking data for an order
  public async getOrderTracking(orderId: number): Promise<DeliveryTracking> {
    return apiClient.get<DeliveryTracking>(ORDER_ENDPOINTS.orderTracking(orderId.toString()));
  }

  // Update tracking data for an order
  public async updateTracking(trackingId: number, data: Partial<DeliveryTracking>): Promise<DeliveryTracking> {
    return apiClient.put<DeliveryTracking>(ORDER_ENDPOINTS.orderTracking(trackingId.toString()), data);
  }

  // Get city coordinates from backend instead of using mock data
  public async getCityCoordinates(cityName: string): Promise<GeoLocation> {
    try {
      const response = await apiClient.get<{name: string, latitude: number, longitude: number}>(`/api/locations/${encodeURIComponent(cityName)}/`);
      return {
        latitude: response.latitude,
        longitude: response.longitude,
        title: response.name
      };
    } catch (error) {
      console.error(`Error fetching coordinates for ${cityName}:`, error);
      // Fallback to centered coordinates in Kazakhstan
      return { latitude: 48.019573, longitude: 66.923684, title: cityName };
    }
  }

  // Get all available locations
  public async getAllLocations(): Promise<GeoLocation[]> {
    try {
      const locations = await apiClient.get<Array<{name: string, latitude: number, longitude: number}>>('/api/locations/');
      return locations.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        title: loc.name
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  }
}

const trackingService = new TrackingService();
export default trackingService;
