//POUR UN SEUL DOCUMENT
import { useState, useEffect } from 'react'
import { documentService } from '../services/document.service'
import type { Document } from '../types'

export function useDocument(id: number) {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    const charger = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await documentService.getById(id)
        setDocument(data)
      } catch {
        setError('Document introuvable')
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [id])

  // Mise à jour locale après modification d'une ligne
  const rafraichirTotal = (nouveauTotal: number) => {
    setDocument(prev => prev ? { ...prev, prixTotal: nouveauTotal } : prev)
  }

  const genererPDF = async (id: number, numeroDoc: string, type: string): Promise<boolean> => {
    try {
      await documentService.genererPDF(id, numeroDoc, type)
      return true
    } catch {
      setError('Erreur lors de la génération du PDF')
      return false
    }
  }

  return { document, loading, error, setDocument, rafraichirTotal, genererPDF }
}