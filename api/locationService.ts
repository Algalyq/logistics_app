import apiClient from './client';
import { LOCATION_ENDPOINTS } from './config';

// Interface for location data
export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

// LocationService class to interact with the locations API
class LocationService {
  // Get all locations
  public async getLocations(): Promise<Location[]> {
    return apiClient.get<Location[]>(LOCATION_ENDPOINTS.locations);
  }
  
  // Get location by name
  public async getLocationByName(name: string): Promise<Location | undefined> {
    const locations = await this.getLocations();
    return locations.find(location => location.name === name);
  }
  
  // Get location coordinates by name - similar to the function in order-tracking.tsx
  public async getCoordinates(cityName: string): Promise<{latitude: number, longitude: number, title?: string}> {
    try {
      const location = await this.getLocationByName(cityName);
      if (location) {
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          title: location.name
        };
      }
      // Return Kazakhstan center as fallback
      return { latitude: 48.019573, longitude: 66.923684, title: cityName };
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
      return { latitude: 48.019573, longitude: 66.923684, title: cityName };
    }
  }
}

// Export singleton instance
const locationService = new LocationService();
export default locationService;
