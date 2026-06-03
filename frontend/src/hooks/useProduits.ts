import { useState, useEffect, useCallback } from 'react'
import { produitService } from '../services/produit.service'
import type { Produit } from '../types'

export function useProduits() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await produitService.getAll()
      setProduits(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }, [])

  // useProduits.ts (Extrait de la fonction addProduit)
const addProduit = async (productData: {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  seuilAlerte: number;
  id_categorie: number; // Modifié pour correspondre à la clé Laravel
  image?: File | null;
}) => {
  try {
    const formData = new FormData()
    
    formData.append('nom', productData.nom)
    formData.append('description', productData.description || '')
    formData.append('prix', String(productData.prix))
    formData.append('stock', String(productData.stock))
    formData.append('seuilAlerte', String(productData.seuilAlerte))
    formData.append('id_categorie', String(productData.id_categorie)) 
    
    if (productData.image) {
      formData.append('image', productData.image)
    }

    
    const newProd = await produitService.create(formData)
    
    await fetchProduits() 
    return newProd
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur lors de l'ajout du produit")
  }
}

  useEffect(() => {
    fetchProduits()
  }, [fetchProduits])

  return { produits, loading, error, refetch: fetchProduits, addProduit }
}
