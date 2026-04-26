import { useState, useEffect } from 'react'
import { authService, LoginCredentials } from '../services/auth.service'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.me()
        .then((userData) => {
          setUser(userData)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    localStorage.setItem('token', response.token)
    setUser(response.user)
    setIsAuthenticated(true)
    return response
  }

  const logout = async () => {
    await authService.logout()
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, user, loading, login, logout }
}
