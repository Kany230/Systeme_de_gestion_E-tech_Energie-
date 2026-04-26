/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getProfile } from '../api/auth';

const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiLogin(email, password);

      // Store token and user in state and localStorage
      const { token: newToken, user: userData } = response;
      setToken(newToken);
      setUser(userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear state and localStorage regardless of API call success
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  const updateUser = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Refresh user profile from API
   */
  const refreshProfile = async () => {
    if (!token) return;

    try {
      const response = await getProfile();
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to refresh profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Role or array of roles to check
   */
  const hasRole = (roles) => {
    if (!user || !user.role) return false;

    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   */
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
    refreshProfile,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Protected Route Component
 * Renders component only if user is authenticated, otherwise redirects to login
 */
export const ProtectedRoute = ({ children, requiredRoles = [], requiredPermissions = [] }) => {
  const { isAuthenticated, hasRole, hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && !requiredPermissions.some(perm => hasPermission(perm))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have the required permissions.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthContext;
