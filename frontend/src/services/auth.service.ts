import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)
    return response.data
  },

  async logout() {
    await api.post('/logout')
  },

  async me() {
    const response = await api.get('/me')
    return response.data
  },
}
