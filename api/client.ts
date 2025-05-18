import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
interface LoginData {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

// ApiClient class to handle API requests
class ApiClient {
  private token: string | null = null;
  
  constructor() {
    // Load token from storage on initialization
    this.loadToken();
  }
  
  // Load token from AsyncStorage
  private async loadToken() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        this.token = token;
      }
    } catch (error) {
      console.error('Error loading token from storage:', error);
    }
  }
  
  // Save token to AsyncStorage
  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving token to storage:', error);
    }
  }
  
  // Set token manually
  public setToken(token: string) {
    this.token = token;
    this.saveToken(token);
  }
  
  // Remove token (logout)
  public async clearToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
  }
  
  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.token !== null;
  }
  
  // Authentication: login
  public async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api-token-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.non_field_errors?.[0] || 'Authentication failed');
    }
    
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }
  
  // Authentication: register
  public async register(userData: any): Promise<any> {
    const response = await fetch(`${API_URL}/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Fix the TypeScript error by properly handling the array type
      const errorValues = Object.values(errorData) as Array<string[]>;
      const errorMessage = errorValues.length > 0 && errorValues[0]?.length > 0 
        ? errorValues[0][0] 
        : 'Registration failed';
      throw new Error(errorMessage);
    }
    
    return response.json();
  }
  
  // Generic GET request
  public async get<T>(endpoint: string): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Token ${this.token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API request failed');
    }
    
    return response.json();
  }
  
  // Generic POST request
  public async post<T>(endpoint: string, data: any): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API request failed');
    }
    
    return response.json();
  }
  
  // Generic PUT request
  public async put<T>(endpoint: string, data: any): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API request failed');
    }
    
    return response.json();
  }
  
  // Generic DELETE request
  public async delete(endpoint: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${this.token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API request failed');
    }
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
