import apiClient from './client';
import { API_URL } from './config';

class AuthService {
  /**
   * Perform a logout operation by:
   * 1. Calling the server logout endpoint if available
   * 2. Clearing the local authentication data
   */
  public async logout(): Promise<boolean> {
    try {
      // If the API has a logout endpoint, call it
      // This is best practice to invalidate tokens on the server
      if (apiClient.isAuthenticated()) {
        try {
          // Try to call the server logout endpoint if it exists
          // If it fails, we'll still clear local auth data
          await fetch(`${API_URL}/api/logout/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${await this.getAuthToken()}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (serverError) {
          console.log('Server logout failed, clearing local auth data anyway');
          // Continue with local logout even if server logout fails
        }
      }
      
      // Clear local authentication data
      await apiClient.clearAuth();
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still try to clear local auth even if there was an error
      try {
        await apiClient.clearAuth();
      } catch (clearError) {
        console.error('Failed to clear auth data:', clearError);
      }
      return false;
    }
  }

  /**
   * Get the authentication token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const token = await apiClient.getToken?.();
      return token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Check if the user is currently authenticated
   */
  public isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export default new AuthService();
