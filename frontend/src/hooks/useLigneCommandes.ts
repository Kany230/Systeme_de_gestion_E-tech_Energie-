import { useState } from 'react'
import type { LigneCommande } from '../types'
import { LigneCommandeService } from '../services/ligneCommande.service'

export function useLigneCommandes() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const modifierLigneCommande = async (id: number, quantite: number, onSucces?: (ligne: LigneCommande, newTotal: number) => void): Promise<boolean> => {
        try {
            setLoading(true)
            setError(null)
            const { ligneCommande, totalTTC} = await LigneCommandeService.UpdateQuantite(id, quantite)
            onSucces?.(ligneCommande, totalTTC)
            return true
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Erreur lors de la modification de la ligne de commande')
            return false
        } finally {
            setLoading(false)
        }   
    }

    const supprimerLigneCommande = async (id: number, onSucces?: (newTotal: number) => void): Promise<boolean> => {
        try {
            setLoading(true)
            setError(null)
            const { prix } = await LigneCommandeService.delete(id)
            onSucces?.(prix)
            return true
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Erreur lors de la suppression de la ligne de commande')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        modifierLigneCommande,
        supprimerLigneCommande
    }   
}