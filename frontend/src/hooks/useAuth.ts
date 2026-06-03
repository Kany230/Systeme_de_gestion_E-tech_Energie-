import { useState, useEffect } from 'react'
import { authService, type ConnexionCredentials, type UserProfil } from '../services/auth.service'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserProfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      authService.me()
        .then((userData) => {
          setUser(userData)
          setIsAuthenticated(true)
        })
        .catch(() => {
          // Token invalide ou expiré -> Nettoyage complet
          localStorage.removeItem('auth_token')
          setIsAuthenticated(false)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: ConnexionCredentials) => {
    setError(null)
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('auth_token', response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Erreur de connexion'
      setError(message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion sur le serveur', err)
    } finally {
      localStorage.removeItem('auth_token')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // ==========================================
  // --- Zone Administration des Comptes ---
  // ==========================================

  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await authService.listUsers()
      return response.users
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Erreur lors de la récupération des utilisateurs'
      setError(message)
      throw err
    }
  }

  // Valider une inscription
  const validateUser = async (id: number) => {
    try {
      return await authService.validerCompte(id)
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Erreur lors de la validation du compte'
      setError(message)
      throw err
    }
  }

  // Bloquer un utilisateur
  const blockUser = async (id: number) => {
    try {
      return await authService.bloquerCompte(id)
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Erreur lors du blocage du compte'
      setError(message)
      throw err
    }
  }

  // Débloquer un utilisateur
  const unblockUser = async (id: number) => {
    try {
      return await authService.debloquerCompte(id)
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Erreur lors du déblocage du compte'
      setError(message)
      throw err
    }
  }

  // Supprimer définitivement un utilisateur
  const removeUser = async (id: number) => {
    try {
      return await authService.deleteUser(id)
    } catch (err: any) {
      const message = err.response?.data?.message ?? "Erreur lors de la suppression de l'utilisateur"
      setError(message)
      throw err
    }
  }

  return { 
    isAuthenticated, 
    user, 
    loading, 
    login, 
    logout, 
    error,
    // Export des nouvelles fonctions d'administration
    fetchUsers,
    validateUser,
    blockUser,
    unblockUser,
    removeUser
  }
}