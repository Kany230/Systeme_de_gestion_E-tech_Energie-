import api from './api'
import type { Categorie, MouvementStock} from '../types'

export const catalogueService = {
  //Récupérer toutes les catégories
  async getAllCategories(): Promise<Categorie[]> {
    const response = await api.get<Categorie[]>('/categories')
    return response.data
  },

  //Créer une catégorie (Exclut l'id et le compteur de produits à la saisie)
  async createCategorie(data: Omit<Categorie, 'id' | 'produitsCount'>): Promise<Categorie> {
    const response = await api.post<Categorie>('/categories', data)
    return response.data
  },

  //Supprimer une catégorie par son ID
  async deleteCategorie(id: number): Promise<void> {
    await api.delete(`/categories/${id}`)
  },

  //Récupérer l'historique des mouvements de stock
  async getMouvementsStock(): Promise<MouvementStock[]> {
    const response = await api.get<MouvementStock[]>('/mouvements-stock')
    return response.data
  }
}