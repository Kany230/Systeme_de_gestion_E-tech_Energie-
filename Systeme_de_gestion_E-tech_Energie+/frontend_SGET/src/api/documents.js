import axiosInstance from './axios';

/**
 * Get all documents with optional filters
 * @param {Object} filters - Filter parameters (type)
 * @returns {Promise} Response data with documents list
 */
export const getDocuments = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/api/documents', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch documents' };
  }
};

/**
 * Get single document by ID
 * @param {number|string} id - Document ID
 * @returns {Promise} Response data with document details
 */
export const getDocument = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch document' };
  }
};

/**
 * Create new document
 * @param {Object} data - Document data
 * @returns {Promise} Response data with created document
 */
export const createDocument = async (data) => {
  try {
    const response = await axiosInstance.post('/api/documents', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create document' };
  }
};

/**
 * Update existing document
 * @param {number|string} id - Document ID
 * @param {Object} data - Updated document data
 * @returns {Promise} Response data with updated document
 */
export const updateDocument = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/documents/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update document' };
  }
};

/**
 * Delete document
 * @param {number|string} id - Document ID
 * @returns {Promise} Response data
 */
export const deleteDocument = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete document' };
  }
};

/**
 * Validate document
 * @param {number|string} id - Document ID
 * @returns {Promise} Response data with validated document
 */
export const validateDocument = async (id) => {
  try {
    const response = await axiosInstance.post(`/api/documents/${id}/valider`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to validate document' };
  }
};

/**
 * Convert devis to invoice
 * @param {number|string} id - Document ID (devis)
 * @returns {Promise} Response data with created invoice
 */
export const convertToInvoice = async (id) => {
  try {
    const response = await axiosInstance.post(`/api/documents/${id}/convertir-en-facture`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to convert to invoice' };
  }
};

/**
 * Convert facture to BL
 * @param {number|string} id - Document ID (facture)
 * @returns {Promise} Response data with created BL
 */
export const convertToBL = async (id) => {
  try {
    const response = await axiosInstance.post(`/api/documents/${id}/convertir-en-bl`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to convert to BL' };
  }
};

/**
 * Generate PDF for document
 * @param {number|string} id - Document ID
 * @returns {Promise} Response with PDF blob
 */
export const generatePDF = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/documents/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate PDF' };
  }
};
