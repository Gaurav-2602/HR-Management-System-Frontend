import apiClient from '../api/client';

/**
 * Progress Tracking & Training Completion API Service
 */
export const progressService = {
  /**
   * Fetch all ongoing interns for the logged-in mentor
   * @returns {Promise<object>}
   */
  async getOngoingInterns() {
    const response = await apiClient.get('/progress/interns');
    return response.data;
  },

  /**
   * Fetch full details for a single ongoing intern
   * @param {string} internId - The Intern MongoDB _id
   * @returns {Promise<object>}
   */
  async getInternDetails(internId) {
    const response = await apiClient.get(`/progress/interns/${internId}`);
    return response.data;
  },

  /**
   * Record a new progress update
   * @param {object} data - { internId, progressPercentage, remarks, performanceRating, skillsCovered, nextGoals }
   * @returns {Promise<object>}
   */
  async recordProgress(data) {
    const response = await apiClient.post('/progress', data);
    return response.data;
  },

  /**
   * Fetch progress history timeline for the intern
   * @param {string} internId - The Intern MongoDB _id
   * @returns {Promise<object>}
   */
  async getProgressHistory(internId) {
    const response = await apiClient.get(`/progress/interns/${internId}/history`);
    return response.data;
  },

  /**
   * Complete training program for the intern
   * @param {string} internId - The Intern MongoDB _id
   * @param {object} data - { finalRemarks, finalRating }
   * @returns {Promise<object>}
   */
  async completeTraining(internId, data) {
    const response = await apiClient.post(`/progress/interns/${internId}/complete`, data);
    return response.data;
  },
};
