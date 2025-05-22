import apiClient from './client';

export interface ProfileData {
  id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  rating?: number;
  total_orders?: number;
  completed_orders?: number;
  cancelled_orders?: number;
  vehicle_type?: string; // For drivers
  license_number?: string; // For drivers
  company_name?: string; // For customers
  address?: string;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields from the actual API response
  assigned_truck?: any;
  documents?: any[];
  experience_years?: number;
  total_kilometers?: number;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: string;
    username: string;
  };
}

export interface ApiResponse<T> {
  results?: T;
  result?: T;
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

const PROFILE_ENDPOINTS = {
  profile: '/api/profile/',
  profileDriver: '/api/driver/profile/',
  updateProfile: '/api/profile/update/',
  uploadAvatar: '/api/profile/avatar/upload/',
};

class ProfileService {
  public async getProfile(): Promise<ProfileData> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(PROFILE_ENDPOINTS.profile);
      
      // The response could be in different formats depending on the API
      let rawData = response.results || response.result || response.data || response;
      
      // Check if we have nested data or direct response
      if (!rawData) {
        throw new Error('Invalid profile data format');
      }
      
      // Map the API response to our ProfileData interface
      const profileData: ProfileData = this.mapApiResponseToProfileData(rawData);
      
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  public async getProfileDriver(): Promise<ProfileData> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(PROFILE_ENDPOINTS.profileDriver);
      
      // The response could be in different formats depending on the API
      let rawData = response.results || response.result || response.data || response;
      
      // Check if we have nested data or direct response
      if (!rawData) {
        throw new Error('Invalid profile data format');
      }
      
      // Map the API response to our ProfileData interface
      const profileData: ProfileData = this.mapApiResponseToProfileData(rawData);
      
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
  
  // Helper method to map API response to our ProfileData interface
  private mapApiResponseToProfileData(data: any): ProfileData {
    // If user data is nested under a 'user' field
    if (data.user) {
      return {
        // Spread user data for basic info
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        phone: data.user.phone || data.phone,
        role: data.user.role || data.role,
        
        // Include other profile-specific data
        avatar: data.avatar,
        rating: data.rating,
        total_orders: data.total_orders,
        completed_orders: data.completed_orders,
        cancelled_orders: data.cancelled_orders,
        vehicle_type: data.vehicle_type,
        license_number: data.license_number,
        company_name: data.company_name,
        address: data.address,
        assigned_truck: data.assigned_truck,
        documents: data.documents,
        experience_years: data.experience_years,
        total_kilometers: data.total_kilometers,
        
        // Store the original user object for reference
        user: data.user
      };
    }
    
    // If data is already in the expected format
    return data;
  }

  public async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const response = await apiClient.put<ApiResponse<ProfileData>>(
        PROFILE_ENDPOINTS.updateProfile,
        profileData
      );
      
      const updatedProfile = response.results || response.result || response.data;
      
      if (!updatedProfile) {
        throw new Error('Invalid profile data format');
      }
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  public async uploadAvatar(formData: FormData): Promise<{ avatar_url: string }> {
    try {
      // Using apiClient with the correct number of arguments
      const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>(
        PROFILE_ENDPOINTS.uploadAvatar,
        formData
      );
      
      const result = response.results || response.result || response.data;
      
      if (!result) {
        throw new Error('Invalid avatar upload response');
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
}

export default new ProfileService();
