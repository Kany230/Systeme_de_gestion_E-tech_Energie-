import axiosInstance from './axios';

/**
 * Get all clients
 * @returns {Promise} Response data with clients list
 */
export const getClients = async () => {
  try {
    const response = await axiosInstance.get('/api/clients');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch clients' };
  }
};

/**
 * Get single client by ID
 * @param {number|string} id - Client ID
 * @returns {Promise} Response data with client details
 */
export const getClient = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/clients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch client' };
  }
};

/**
 * Create new client
 * @param {Object} data - Client data
 * @returns {Promise} Response data with created client
 */
export const createClient = async (data) => {
  try {
    const response = await axiosInstance.post('/api/clients', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create client' };
  }
};

/**
 * Update existing client
 * @param {number|string} id - Client ID
 * @param {Object} data - Updated client data
 * @returns {Promise} Response data with updated client
 */
export const updateClient = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/clients/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update client' };
  }
};

/**
 * Delete client
 * @param {number|string} id - Client ID
 * @returns {Promise} Response data
 */
export const deleteClient = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/clients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete client' };
  }
};

/**
 * Get client documents
 * @param {number|string} id - Client ID
 * @returns {Promise} Response data with client documents
 */
export const getClientDocuments = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/clients/${id}/documents`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch client documents' };
  }
};

/**
 * Get client balance
 * @param {number|string} id - Client ID
 * @returns {Promise} Response data with client balance
 */
export const getClientBalance = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/clients/${id}/balance`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch client balance' };
  }
};

/**
 * Search clients
 * @param {string} query - Search query
 * @returns {Promise} Response data with search results
 */
export const searchClients = async (query) => {
  try {
    const response = await axiosInstance.get('/api/clients/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search clients' };
  }
};

/**
 * Get client orders
 * @param {number|string} id - Client ID
 * @returns {Promise} Response data with client orders
 */
export const getClientOrders = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/clients/${id}/orders`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch client orders' };
  }
};
