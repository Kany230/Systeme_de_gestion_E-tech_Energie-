import axiosInstance from './axios';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response data
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/connexion', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Register new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (admin, user, etc.)
 * @returns {Promise} Response data
 */
export const register = async (name, email, password, role) => {
  try {
    const response = await axiosInstance.post('/api/inscription', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Logout user
 * @returns {Promise} Response data
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.post('/api/deconnexion');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Response data
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/api/oublierpwd', {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset request failed' };
  }
};

/**
 * Get current user profile
 * @returns {Promise} Response data
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};
