import { StatCard, Card, Badge } from '../components/ui'
import { formatCurrency, formatDate } from '../utils'
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

interface StatData {
  commandesJour: number
  produitsStock: number
  clientsActifs: number
  chiffreAffaires: number
}

interface Order {
  id: number
  client: string
  total: number
  statut: 'en_attente' | 'en_cours' | 'terminee'
  date: string
}

interface LowStockProduct {
  id: number
  nom: string
  categorie: string
  quantite: number
}

export default function Dashboard() {
  const stats: StatData = {
    commandesJour: 12,
    produitsStock: 45,
    clientsActifs: 128,
    chiffreAffaires: 3450000,
  }

  const recentOrders: Order[] = [
    { id: 1001, client: 'Entreprise ABC', total: 150000, statut: 'en_cours', date: '2024-01-15' },
    { id: 1002, client: 'Société XYZ', total: 250000, statut: 'terminee', date: '2024-01-15' },
    { id: 1003, client: 'Client Demo', total: 75000, statut: 'en_attente', date: '2024-01-14' },
    { id: 1004, client: 'Ma Commerce', total: 180000, statut: 'en_cours', date: '2024-01-14' },
    { id: 1005, client: 'E-tech SARL', total: 320000, statut: 'terminee', date: '2024-01-13' },
  ]

  const lowStockProducts: LowStockProduct[] = [
    { id: 1, nom: 'Panneau Solaire 100W', categorie: 'Énergie Solaire', quantite: 3 },
    { id: 2, nom: 'Batterie 12V 100Ah', categorie: 'Batteries', quantite: 5 },
    { id: 3, nom: 'Onduleur 3KVA', categorie: 'Onduleurs', quantite: 2 },
    { id: 4, nom: 'Régulateur MPPT 20A', categorie: 'Régulateurs', quantite: 4 },
  ]

  const getStatutVariant = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'warning'
      case 'terminee':
        return 'success'
      case 'en_attente':
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'En cours'
      case 'terminee':
        return 'Terminée'
      case 'en_attente':
        return 'En attente'
      default:
        return statut
    }
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre activité commerciale
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(new Date())}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes aujourd'hui"
          value={stats.commandesJour}
          icon={ShoppingBag}
          trend={{ value: '15% vs hier', isPositive: true }}
        />

        <StatCard
          title="Produits en stock"
          value={stats.produitsStock}
          icon={Package}
          trend={{ value: '4 stock faible', isPositive: false }}
        />

        <StatCard
          title="Clients actifs"
          value={stats.clientsActifs}
          icon={Users}
          trend={{ value: '+8 ce mois', isPositive: true }}
        />

        <StatCard
          title="Chiffre d'affaires"
          value={formatCurrency(stats.chiffreAffaires)}
          icon={TrendingUp}
          trend={{ value: '22% vs mois dernier', isPositive: true }}
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dernières commandes */}
        <div className="lg:col-span-2">
          <Card title="Dernières Commandes" className="h-full">
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-800">
                        CMD-{order.id}
                      </div>
                      <Badge variant={getStatutVariant(order.statut)}>
                        {getStatutLabel(order.statut)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{order.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(order.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2">
              Voir toutes les commandes
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>
        </div>

        {/* Produits en stock faible */}
        <div>
          <Card title="Stock Faible" className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-600">4 produits nécessitent un réapprovisionnement</span>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">
                        {product.nom}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {product.categorie}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        {product.quantite}
                      </div>
                      <div className="text-xs text-red-600">unités</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
