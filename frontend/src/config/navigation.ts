import {
  LayoutDashboard,
  Package,
  Tag,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings
} from 'lucide-react'
interface NavItem {
  label: string
  path: string
  icon: any
  role?: 'admin' | 'secretaire' // Ajout du champ pour filtrer le menu
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  { label: 'Tableau de Bord', path: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Catalogue',
    path: '/catalogue',
    icon: Package,
    children: [
      { label: 'Produits', path: '/catalogue/produits', icon: Package },
      { label: 'Catégories', path: '/catalogue/categories', icon: Tag, role: 'admin' },
      { label: 'Stock', path: '/catalogue/action', icon: BarChart3, role: 'admin' },
    ],
  },
  { label: 'Clients', path: '/clients', icon: Users },
  { label: 'Commandes', path: '/commandes', icon: Package },
  {
    label: 'Rapports',
    path: '/rapports',
    icon: TrendingUp,
    role: 'admin',
    children: [
      { label: 'Ventes', path: '/rapports/ventes', icon: DollarSign },
      { label: 'Stock', path: '/rapports/stock', icon: BarChart3 },
      { label: 'Clients', path: '/rapports/clients', icon: Users },
    ],
  },
  { label: 'Utilisateurs', path: '/users', icon: Users, role: 'admin' },
  { label: 'Paramètres', path: '/parametres', icon: Settings, role: 'admin' },
]