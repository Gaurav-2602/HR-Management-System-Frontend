import apiClient from '../api/client';

/**
 * Mentor Management API Service
 */
export const mentorService = {
  /**
   * Fetch paginated list of mentors
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<object>}
   */
  async getMentors(page = 1, limit = 10) {
    const response = await apiClient.get('/mentors', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Create a new mentor account
   * @param {object} data - { fullName, email, password }
   * @returns {Promise<object>}
   */
  async createMentor(data) {
    const response = await apiClient.post('/mentors', data);
    return response.data;
  },

  /**
   * Update mentor details
   * @param {string} id 
   * @param {object} data - { fullName, email }
   * @returns {Promise<object>}
   */
  async updateMentor(id, data) {
    const response = await apiClient.put(`/mentors/${id}`, data);
    return response.data;
  },

  /**
   * Activate or deactivate mentor account
   * @param {string} id 
   * @param {boolean} isActive 
   * @returns {Promise<object>}
   */
  async updateMentorStatus(id, isActive) {
    const response = await apiClient.patch(`/mentors/${id}/status`, { isActive });
    return response.data;
  },
};
