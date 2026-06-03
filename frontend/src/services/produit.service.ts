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

  async create(data: FormData): Promise<Produit> {
    const response = await api.post<Produit>('/produits', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return response.data
  },

  async update(id: number, data: Partial<Produit>): Promise<Produit> {
    const response = await api.put<Produit>(`/produits/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/produits/${id}`)
  },

  async getRupture(): Promise<Produit[]> {
    const response = await api.get<Produit[]>('/produits/rupture');
    return response.data
  },

  async modifierStock(id: number, quantite: number): Promise<{ message: string; 'new stock': number; alerte: boolean }> {
    const response = await api.put(`/produits/${id}/stock`, { quantite })
    return response.data
  },
}
