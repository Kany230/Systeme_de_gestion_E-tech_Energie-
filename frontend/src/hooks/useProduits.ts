import { useState, useEffect } from 'react'
import { produitService } from '../services/produit.service'
import type { Produit } from '../types'

export function useProduits() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduits = async () => {
    try {
      setLoading(true)
      const data = await produitService.getAll()
      setProduits(data)
    } catch (err) {
      setError('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduits()
  }, [])

  return { produits, loading, error, refetch: fetchProduits }
}
