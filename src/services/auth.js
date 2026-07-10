import apiClient from '../api/client';

/**
 * Authentication API Service
 */
export const authService = {
  /**
   * Log in user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>}
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Fetch current user details via token validation
   * @returns {Promise<object>}
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
