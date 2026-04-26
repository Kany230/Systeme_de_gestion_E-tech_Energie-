import { useState, useEffect } from 'react'
import { commandeService } from '../services/commande.service'
import type { Commande } from '../types'

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCommandes = async () => {
    try {
      setLoading(true)
      const data = await commandeService.getAll()
      setCommandes(data)
    } catch (err) {
      setError('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommandes()
  }, [])

  return { commandes, loading, error, refetch: fetchCommandes }
}
