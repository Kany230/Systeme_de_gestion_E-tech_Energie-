import api from './api'
import type { LigneCommande } from '../types'

export interface ModifierQunatiteResponse {
    message: string
    ligneCommande: LigneCommande
    totalTTC: number
}

export interface SupprimerLigneResponse {
    message: string
    prix: number
}

export const LigneCommandeService = {
    //modifier la quantite d'une ligne de commande
    async UpdateQuantite(id: number, quantite: number): Promise<ModifierQunatiteResponse> {
        const response = await api.put<ModifierQunatiteResponse>(`/ligne-commandes/${id}`, { quantite })
        return response.data
    },

    //supprimer une ligne de commande
    async delete(id: number): Promise<SupprimerLigneResponse> {
        const response = await api.delete<SupprimerLigneResponse>(`/ligne-commandes/${id}`)
        return response.data
    },
}