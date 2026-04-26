export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Produit {
  id: number
  nom: string
  description: string
  prix: number
  quantite: number
  categorie: string
}

export interface Client {
  id: number
  nom: string
  email: string
  telephone: string
  adresse: string
}

export interface Commande {
  id: number
  clientId: number
  date: string
  statut: string
  total: number
  lignes: LigneCommande[]
}

export interface LigneCommande {
  id: number
  commandeId: number
  produitId: number
  quantite: number
  prixUnitaire: number
}
