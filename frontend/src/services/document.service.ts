import api from './api'
import type { Document} from '../types'

export interface CreateDocumentData {
  type: 'facture' | 'BL' | 'devis'
  produits: {
    id_produit: number
    quantite: number
  }[]
  taxe?: number
  format?: 'A4' | 'A3' | 'A5'
  id_client?: number
  nomClient?: string
  prenomClient?: string
  telephoneClient?: string
  adresseClient?: string
}

export interface UpdateDocumentData {
  dateDoc?: string
  format?: 'A4' | 'A3' | 'A5'
  id_client?: number
}

export interface validerDocumentDataResponse{
  message: string
  'stock mis à jour': boolean
}

export interface FiltresDocument {
  type?: 'facture' | 'BL' | 'devis'
}

export const documentService = {
  //Recupere tous les documents avec ou sans filtres
  async getAll(filtres?: FiltresDocument): Promise<Document[]> {
  const response = await api.get('/documents', { 
    params: filtres 
  })
  return response.data
},

//Recupere un document par son id
async getById(id: number): Promise<Document> {
  const response = await api.get(`/documents/${id}`)
  return response.data
},

//Crer un nouveau document
async create(data: CreateDocumentData): Promise<Document> {
  const response = await api.post('/documents', data)
  return response.data
},

//Modifier un document existant si statut = brouillon
async update(id: number, data: UpdateDocumentData): Promise<Document> {
  const response = await api.put(`/documents/${id}`, data)
  return response.data
},

//Supprimer un document si statut = brouillon
async delete(id: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/documents/${id}`)
  return response.data
},

//Valider un document et mettre à jour le stock si nécessaire
async valider(id: number): Promise<validerDocumentDataResponse> {
  const response = await api.post<validerDocumentDataResponse>(`/documents/${id}/valider`)
  return response.data
},

//Convertir un devis en facture
async convertirEnFacture(id: number): Promise<Document> {
  const response = await api.post(`/documents/${id}/convertir-en-facture`)
  return response.data
},

  //Convertir une facture en BL
async convertirEnBL(id: number): Promise<Document> {
  const response = await api.post(`/documents/${id}/convertir-en-bl`)
  return response.data
},

  //Telecharger un document
async genererPDF(id: number, numeroDoc: string, type: string): Promise<void> {
  const response = await api.get(`/documents/${id}/pdf`, {
    responseType: 'blob'
  })

  //creer un lien de téléchargement pour le PDF
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url   
  link.setAttribute('download', `${type}_${numeroDoc}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

}



