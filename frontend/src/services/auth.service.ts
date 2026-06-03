
import api from './api'

export interface ConnexionCredentials {
  email: string
  password: string
}

export interface AuthResponse{
  token: string,
  token_type: string,
  user: UserProfil
}

export interface  InscriptionCredentials {
  name: string, 
  email: string,
  password: string,
  password_confirmation: string
  role: 'admin'| 'secretaire'
}

export interface InscriptionResponse{
  user: UserProfil,
  message: string
}

export interface PasswordOublierCredentials {
  email: string
}

export interface ReinitialiserPasswordCredentials{
  token: string,
  email: string,
  password: string,
  password_confirmation: string
}

export interface UserProfil {
  id: number
  name: string
  email: string
  role: 'admin' | 'secretaire'
  is_validated: boolean
  statut: 'active' | 'blocked' | 'en_attente' | 'debloque'
}

export interface MessageResponse{
  message: string
}


export const authService = {

  //Connexion de l'utilisateur
  async login(credentials: ConnexionCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/connexion', credentials)
    return response.data
  },

  //Inscription de l'utilisateur
  async register(credentials: InscriptionCredentials): Promise<InscriptionResponse> {
    const response = await api.post<InscriptionResponse>('/inscription', credentials)
    return response.data
  },



async updateProfil(data: { name: string; email: string; password?: string; password_confirmation?: string }): Promise<UserProfil> {
  // Envoi d'une requête PUT vers l'API Laravel
  const response = await api.put<{ user: UserProfil; message: string }>('/user/profile', data)
  return response.data.user
},

  async logout(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/deconnexion')
    return response.data
  },

  async me(): Promise<UserProfil> {
    const response = await api.get<UserProfil>('/me')
    return response.data
  },

  async passwordOublier(credentials: PasswordOublierCredentials): Promise<MessageResponse>{
    const response = await api.post<MessageResponse>('/oublierpwd', credentials)
    return response.data
  },

  async reinitialiserPassword(credentials: ReinitialiserPasswordCredentials): Promise<MessageResponse>{
    const response = await api.post<MessageResponse>('/reinitialise', credentials)
    return response.data
  },

  // Récupérer la liste de tous les utilisateurs
  async listUsers(): Promise<{ users: UserProfil[] }> {
    const response = await api.get<{ users: UserProfil[] }>('/users')
    return response.data
  },

  // Valider une inscription en attente
  async validerCompte(id: number): Promise<MessageResponse> {
    const response = await api.put<MessageResponse>(`/users/${id}/valider`)
    return response.data
  },

  // Bloquer un compte utilisateur actif
  async bloquerCompte(id: number): Promise<MessageResponse> {
    const response = await api.put<MessageResponse>(`/users/${id}/bloquer`)
    return response.data
  },

  // Débloquer un compte utilisateur
  async debloquerCompte(id: number): Promise<MessageResponse> {
    const response = await api.put<MessageResponse>(`/users/${id}/debloquer`)
    return response.data
  },

  // Supprimer définitivement un utilisateur
  async deleteUser(id: number): Promise<MessageResponse> {
    const response = await api.delete<MessageResponse>(`/users/${id}`)
    return response.data
  }
}
