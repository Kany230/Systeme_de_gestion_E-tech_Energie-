import {
  LayoutDashboard,
  Package,
  Tag,
  BarChart3,
  Users,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
  Settings,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: any
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: 'Tableau de Bord',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Catalogue',
    path: '/catalogue',
    icon: Package,
    children: [
      { label: 'Produits', path: '/produits', icon: Package },
      { label: 'Catégories', path: '/categories', icon: Tag },
      { label: 'Stock', path: '/stock', icon: BarChart3 },
    ],
  },
  {
    label: 'Clients',
    path: '/clients',
    icon: Users,
  },
  {
    label: 'Ventes',
    path: '/ventes',
    icon: DollarSign,
    children: [
      { label: 'Commandes', path: '/commandes', icon: Package },
      { label: 'Devis', path: '/devis', icon: FileText },
      { label: 'Factures', path: '/factures', icon: Receipt },
    ],
  },
  {
    label: 'Rapports',
    path: '/rapports',
    icon: TrendingUp,
    children: [
      { label: 'Ventes', path: '/rapports/ventes', icon: DollarSign },
      { label: 'Stock', path: '/rapports/stock', icon: BarChart3 },
      { label: 'Clients', path: '/rapports/clients', icon: Users },
    ],
  },
  {
    label: 'Paramètres',
    path: '/parametres',
    icon: Settings,
  },
]
