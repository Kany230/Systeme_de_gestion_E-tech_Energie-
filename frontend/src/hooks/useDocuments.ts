import { useState, useEffect, useCallback } from 'react'
import type { Document } from '../types'
import { documentService, type FiltresDocument, type CreateDocumentData, type UpdateDocumentData} from '../services/document.service'

export function useDocuments(filtresInitiaux?: FiltresDocument) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)  

  const charger = useCallback(async (filtres?: FiltresDocument) => {
    try{
      setLoading(true)
      setError(null)
      const data = await documentService.getAll(filtres ?? filtresInitiaux)
      setDocuments(data)
    }catch(err){
      setError('Erreur lors du chargement des documents')
    }finally{
      setLoading(false)
    }
  }, [])

  useEffect(() => { charger() }, [charger])

  const creerDocument = async (data: CreateDocumentData): Promise<Document | null> => {
    try {
      const doc = await documentService.create(data)
      setDocuments(prev => [...prev, doc])
      return doc
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la création du document')
      return null
    } 
  }

  const modifierDocument = async (id: number, data: UpdateDocumentData): Promise<Document | null> => {
    try {
      const doc = await documentService.update(id, data)
      setDocuments(prev => prev.map(d => d.id === id ? doc : d))
      return doc
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la modification du document')
      return null
    }
  }

  const supprimerDocument = async (id: number): Promise<boolean> => {
    try {
      await documentService.delete(id)
      setDocuments(prev => prev.filter(d => d.id !== id))
      return true
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la suppression du document')
      return false
    }
  }

  const validerDocument = async (id: number): Promise<boolean> => {
    try {
      await documentService.valider(id)
      // Met à jour le document dans la liste après validation
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, statut: 'valide' as const} : d))
      return true
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la validation du document')
      return false
    }
  }

  const convertirEnFacture = async (id: number): Promise<Document | null> => {
    try {
      const facture = await documentService.convertirEnFacture(id)
      setDocuments(prev => [facture, ...prev])
      return facture
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la conversion en facture')
      return null
    }
  }

  const convertirEnBL = async (id: number): Promise<Document | null> => {
    try {
      const bl = await documentService.convertirEnBL(id)
      setDocuments(prev => [bl, ...prev])
      return bl
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la conversion en bon de livraison')
      return null
    }
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

  return {
    documents,
    loading,
    error,
    charger,
    creerDocument,
    modifierDocument,
    supprimerDocument,
    validerDocument,
    convertirEnFacture,
    convertirEnBL,
    genererPDF
  }
}