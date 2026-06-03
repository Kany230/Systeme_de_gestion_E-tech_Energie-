export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Produit {
  id: number
  nom: string
  description?: string | null 
  prix: number
  stock: number         
  seuilAlerte: number   
  categorie: string | { id: number; nom: string; description?: string };    
  image?: string | null 
  created_at?: string
  updated_at?: string
}

export interface Client {
  id: number
  nom: string
  prenom: string
  telephone: string
  adresse: string
}

export interface Document {
  id: number
  id_client: number
  id_user: number
  numeroDoc: string
  dateDoc: string
  prixTotal: number
  taxe: number
  statut: 'brouillon' | 'valide' | 'annule'
  type: 'devis' | 'facture' | 'BL'
  format: 'A4' | 'A3' | 'A5'
  stock_impacte: boolean | number
  created_at?: string
  updated_at?: string
  client?: Client
  user?: User
  lignes_document?: LigneCommande[]
}

export interface LigneCommande {
  id: number
  id_produit: number
  quantite: number
  prixUnitaire: number
  sousTotal: number
  produit?: Produit
}

export interface Categorie {
  id: number
  nom: string
  description?: string
  produitsCount?: number; 
  produits_count?: number; 
  created_at?: string
  updated_at?: string
}

export interface Configuration{
  id: number
  nomSociete: string
  ninea: string
  email: string
  contact: string
  phraseLegale: string
  logo?: string | null
}

export interface MouvementStock {
  id: number
  produit_id: number
  user_id: number
  type: 'entree' | 'sortie'
  quantite: number
  motif: string
  created_at: string
  produit?: {
    id: number
    nom: string
  }
  user?: {
    id: number
    name: string
  }

  
}
