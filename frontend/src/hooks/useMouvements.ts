import { useState, useEffect, useCallback } from 'react'
import { catalogueService } from '../services/catalogue.service'
import type { MouvementStock } from '../types'

export function useMouvements() {
  const [mouvements, setMouvements] = useState<MouvementStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMouvements = useCallback(async () => {
    try {
      setLoading(true)
      const data = await catalogueService.getMouvementsStock()
      setMouvements(data)
      setError(null)
    } catch (err: any) {
      console.error('Erreur mouvements de stock:', err)
      setError(err.message || 'Impossible de charger l\'historique des mouvements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMouvements()
  }, [fetchMouvements])

  return { mouvements, loading, error, refetch: fetchMouvements }
}