import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
interface LoginData {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'driver' | 'admin';
}

// ApiClient class to handle API requests
class ApiClient {
  private token: string | null = null;
  private userData: Omit<AuthResponse, 'token'> | null = null;
  
  constructor() {
    // Load token and user data from storage on initialization
    this.loadToken();
    this.loadUserData();
  }
  
  // Load token from AsyncStorage
  private async loadToken() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        this.token = token;
      }
    } catch (error) {
      console.error('Failed to load auth token', error);
    }
  }
  
  // Load user data from AsyncStorage
  private async loadUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        this.userData = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  }
  
  // Save token to AsyncStorage
  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to save auth token', error);
    }
  }
  
  // Save user data to AsyncStorage
  private async saveUserData(userData: Omit<AuthResponse, 'token'>) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data', error);
    }
  }
  
  // Set token manually
  public setToken(token: string) {
    this.token = token;
    this.saveToken(token);
  }
  
  // Set user data
  public setUserData(userData: Omit<AuthResponse, 'token'>) {
    this.userData = userData;
    this.saveUserData(userData);
  }
  
  // Get user data
  public getUserData() {
    return this.userData;
  }
  
  // Get user role
  public getUserRole() {
    return this.userData?.role || null;
  }
  
  // Get auth token
  public getToken(): string | null {
    return this.token;
  }
  
  // Remove token and user data (logout)
  public async clearAuth() {
    this.token = null;
    this.userData = null;
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    } catch (error) {
      console.error('Failed to clear auth data', error);
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
    
    // Save user data without token
    const { token, ...userData } = data;
    this.setUserData(userData);
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
