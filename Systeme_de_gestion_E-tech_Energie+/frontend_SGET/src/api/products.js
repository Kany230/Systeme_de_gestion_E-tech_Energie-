import axiosInstance from './axios';

/**
 * Get all products
 * @returns {Promise} Response data with products list
 */
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get('/api/produits');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

/**
 * Get single product by ID
 * @param {number|string} id - Product ID
 * @returns {Promise} Response data with product details
 */
export const getProduct = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/produits/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch product' };
  }
};

/**
 * Create new product
 * @param {Object} data - Product data
 * @returns {Promise} Response data with created product
 */
export const createProduct = async (data) => {
  try {
    const response = await axiosInstance.post('/api/produits', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create product' };
  }
};

const handleSubmit = async (values) => {
  const formData = new FormData();
  formData.append('nom', values.nom);
  formData.append('prix', values.prix);
  formData.append('stock', values.stock);
  formData.append('seuilAlerte', values.seuilAlerte);
  if (values.imageFile) {
    formData.append('image', values.imageFile);
  }
  
  await createProduct(formData); // Ton service Axios gérera le reste
};

/**
 * Update existing product
 * @param {number|string} id - Product ID
 * @param {Object} data - Updated product data
 * @returns {Promise} Response data with updated product
 */
export const updateProduct = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/produits/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update product' };
  }
};

/**
 * Delete product
 * @param {number|string} id - Product ID
 * @returns {Promise} Response data
 */
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/produits/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete product' };
  }
};

/**
 * Get products with low stock
 * @param {number} threshold - Stock threshold (optional)
 * @returns {Promise} Response data with low stock products
 */
export const getLowStockProducts = async () => {
  try {
    const response = await axiosInstance.get('/api/rupture');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch low stock products' };
  }
};

/**
 * Search products
 * @param {string} query - Search query
 * @returns {Promise} Response data with search results
 */
export const searchProducts = async (query) => {
  try {
    const response = await axiosInstance.get('/api/produits/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search products' };
  }
};
