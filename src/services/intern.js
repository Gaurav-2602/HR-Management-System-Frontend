import apiClient from '../api/client';

/**
 * Intern Management API Service
 */
export const internService = {
  /**
   * Fetch paginated list of active interns with server-side filters and search
   * @param {object} params - { page, limit, status, search }
   * @returns {Promise<object>}
   */
  async getInterns({ page = 1, limit = 10, status = 'ALL', search = '' }) {
    const params = { page, limit };
    
    // Omit status when it is ALL
    if (status && status !== 'ALL') {
      params.status = status;
    }
    
    // Omit search query when empty
    const trimmedSearch = (search || '').trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    const response = await apiClient.get('/interns', { params });
    return response.data;
  },

  /**
   * Fetch full details for a single intern
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async getInternById(id) {
    const response = await apiClient.get(`/interns/${id}`);
    return response.data;
  },

  /**
   * Register a new intern record
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async createIntern(data) {
    const response = await apiClient.post('/interns', data);
    return response.data;
  },

  /**
   * Update details of an existing intern
   * @param {string} id 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async updateIntern(id, data) {
    const response = await apiClient.put(`/interns/${id}`, data);
    return response.data;
  },

  /**
   * Soft-delete/deactivate an intern record
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async deleteIntern(id) {
    const response = await apiClient.delete(`/interns/${id}`);
    return response.data;
  },

  /**
   * Fetch certificate details or eligibility for a completed/issued intern
   * @param {string} id - Intern MongoDB ObjectId
   * @returns {Promise<object>}
   */
  async getIssuanceDetails(id) {
    const response = await apiClient.get(`/interns/${id}/issuance`);
    return response.data;
  },

  /**
   * Issue a certificate to an eligible completed intern
   * @param {string} id - Intern MongoDB ObjectId
   * @param {object} data - { certificateNumber, finalHrRemarks }
   * @returns {Promise<object>}
   */
  async issueCertificate(id, data) {
    const response = await apiClient.post(`/interns/${id}/issue`, data);
    return response.data;
  },
};
