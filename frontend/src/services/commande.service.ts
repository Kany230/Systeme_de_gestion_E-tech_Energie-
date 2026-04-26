import api from './api'
import type { Commande } from '../types'

export const commandeService = {
  async getAll(): Promise<Commande[]> {
    const response = await api.get<Commande[]>('/commandes')
    return response.data
  },

  async getById(id: number): Promise<Commande> {
    const response = await api.get<Commande>(`/commandes/${id}`)
    return response.data
  },

  async create(data: Omit<Commande, 'id'>): Promise<Commande> {
    const response = await api.post<Commande>('/commandes', data)
    return response.data
  },

  async update(id: number, data: Partial<Commande>): Promise<Commande> {
    const response = await api.put<Commande>(`/commandes/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/commandes/${id}`)
  },
}
