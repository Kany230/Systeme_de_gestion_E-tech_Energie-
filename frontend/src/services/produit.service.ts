import api from './api'
import type { Produit } from '../types'

export const produitService = {
  async getAll(): Promise<Produit[]> {
    const response = await api.get<Produit[]>('/produits')
    return response.data
  },

  async getById(id: number): Promise<Produit> {
    const response = await api.get<Produit>(`/produits/${id}`)
    return response.data
  },

  async create(data: Omit<Produit, 'id'>): Promise<Produit> {
    const response = await api.post<Produit>('/produits', data)
    return response.data
  },

  async update(id: number, data: Partial<Produit>): Promise<Produit> {
    const response = await api.put<Produit>(`/produits/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/produits/${id}`)
  },
}
