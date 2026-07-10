import apiClient from '../api/client';

/**
 * Dashboard API Service
 */
export const dashboardService = {
  /**
   * Fetch admin dashboard analytics and breakdown statistics
   * @returns {Promise<object>}
   */
  async getAdminDashboard() {
    const response = await apiClient.get('/dashboard/admin');
    return response.data;
  },

  /**
   * Fetch mentor dashboard analytics and assignment tracking
   * @returns {Promise<object>}
   */
  async getMentorDashboard() {
    const response = await apiClient.get('/dashboard/mentor');
    return response.data;
  },
};

