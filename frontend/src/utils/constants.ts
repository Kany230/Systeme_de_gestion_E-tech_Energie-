export const APP_NAME = 'E-Tech Énergie'
export const APP_DESCRIPTION = 'Système de Gestion Commerciale'

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUITS: '/produits',
  CLIENTS: '/clients',
  COMMANDES: '/commandes',
  SETTINGS: '/parametres',
} as const

export const STATUTS_COMMANDE = {
  EN_ATTENTE: 'en_attente',
  EN_COURS: 'en_cours',
  TERMINEE: 'terminee',
  ANNULEE: 'annulee',
} as const

export const STATUTS_COMMANDE_LABELS = {
  [STATUTS_COMMANDE.EN_ATTENTE]: 'En attente',
  [STATUTS_COMMANDE.EN_COURS]: 'En cours',
  [STATUTS_COMMANDE.TERMINEE]: 'Terminée',
  [STATUTS_COMMANDE.ANNULEE]: 'Annulée',
}

export const CATEGORIES_PRODUIT = [
  'Panneaux Solaires',
  'Batteries',
  'Onduleurs',
  'Régulateurs',
  'Câbles',
  'Accessoires',
  'Autres',
] as const

export const ROLES = {
  ADMIN: 'admin',
  GESTIONNAIRE: 'gestionnaire',
  VENDEUR: 'vendeur',
} as const

export const ITEMS_PER_PAGE = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
