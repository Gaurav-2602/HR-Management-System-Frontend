import apiClient from '../api/client';

/**
 * Assignment Workflow API Service
 */
export const assignmentService = {
  /**
   * Match an intern to a mentor (HR Admin action)
   * @param {object} data - { internId, mentorId }
   * @returns {Promise<object>}
   */
  async createAssignment(data) {
    const response = await apiClient.post('/assignments', data);
    return response.data;
  },

  /**
   * Fetch assignments assigned to the logged-in mentor
   * @param {string} status - PENDING | ACCEPTED | REJECTED | ALL
   * @returns {Promise<object>}
   */
  async getMyAssignments(status) {
    const params = {};
    if (status && status !== 'ALL') {
      params.status = status;
    }
    const response = await apiClient.get('/assignments/mine', { params });
    return response.data;
  },

  /**
   * Fetch single assignment details for the logged-in mentor
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async getAssignmentById(id) {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  /**
   * Accept an assignment (Mentor action)
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async acceptAssignment(id) {
    const response = await apiClient.post(`/assignments/${id}/accept`);
    return response.data;
  },

  /**
   * Reject an assignment (Mentor action)
   * @param {string} id 
   * @param {object} data - { rejectionRemarks, suggestedMentorId }
   * @returns {Promise<object>}
   */
  async rejectAssignment(id, data) {
    const response = await apiClient.post(`/assignments/${id}/reject`, data);
    return response.data;
  },
};
