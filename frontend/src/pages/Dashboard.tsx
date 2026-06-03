import { useNavigate } from 'react-router-dom'
import { StatCard, Card, Badge } from '../components/ui'
import { formatCurrency, formatDate } from '../utils'
import { useDashboard } from '../hooks/useDashboard'
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

// Déclaration externe propre pour les styles et labels
const STATUT_CONFIG: Record<string, { variant: 'warning' | 'success' | 'info' | 'default'; label: string }> = {
  en_cours:  { variant: 'warning', label: 'En cours' },
  valide:    { variant: 'success', label: 'Validée' },
  paye:      { variant: 'success', label: 'Payée' },
  brouillon: { variant: 'info',    label: 'Brouillon' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { stats, recentOrders = [], lowStockProducts = [], loading, error } = useDashboard()

  if (loading) return <div className="text-center py-16 text-gray-500 font-medium animate-pulse">Chargement du tableau de bord...</div>
  if (error)   return <div className="text-center py-16 text-red-600 font-medium">{error}</div>

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre activité commerciale</p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border">
          {formatDate(new Date())}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes aujourd'hui"
          value={stats?.commandesJour ?? 0}
          icon={ShoppingBag}
          trend={{ value: '15% vs hier', isPositive: true }}
        />
        <StatCard
          title="Produits en stock"
          value={stats?.produitsStock ?? 0}
          icon={Package}
          trend={{ 
            value: lowStockProducts.length > 0 ? `${lowStockProducts.length} alertes stock` : 'Alerte stock inactive', 
            isPositive: lowStockProducts.length === 0 
          }}
        />
        <StatCard
          title="Clients actifs"
          value={stats?.clientsActifs ?? 0}
          icon={Users}
          trend={{ value: '+8 ce mois', isPositive: true }}
        />
        <StatCard
          title="Chiffre d'affaires"
          value={formatCurrency(stats?.chiffreAffaires ?? 0)}
          icon={TrendingUp}
          trend={{ value: '22% vs mois dernier', isPositive: true }}
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dernières commandes */}
        <div className="lg:col-span-2">
          <Card title="Dernières Commandes" className="h-full flex flex-col justify-between">
            <div className="space-y-3 flex-1">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm border border-dashed rounded-xl">
                  Aucune commande enregistrée pour le moment.
                </div>
              ) : (
                recentOrders.map((order) => {
                  const config = STATUT_CONFIG[order.statut] || { variant: 'default', label: order.statut }
                  return (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/commandes/${order.id}`)}
                      className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-mono text-xs font-bold text-gray-900">{order.numero}</div>
                          <Badge variant={config.variant}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-gray-600 mt-1">{order.client}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            
            {recentOrders.length > 0 && (
              <button 
                onClick={() => navigate('/commandes')}
                className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border"
              >
                Voir toutes les commandes
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </Card>
        </div>

        {/* Stock faible */}
        <div>
          <Card title="Stock Faible" className="h-full">
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-green-50/60 border border-green-100 rounded-xl text-green-800">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-sm font-semibold">Tous les stocks sont au vert !</p>
                <p className="text-xs text-green-600 mt-0.5">Aucun réapprovisionnement requis.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-2.5 mb-4 p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-800">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium">
                    {lowStockProducts.length} {lowStockProducts.length > 1 ? 'produits nécessitent' : 'produit nécessite'} une attention immédiate.
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 bg-white border border-red-100 hover:border-red-200 rounded-xl shadow-sm flex justify-between items-center transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="font-semibold text-gray-800 text-sm truncate">{product.nom}</div>
                        <div className="text-xs text-gray-400 font-medium mt-0.5">{product.categorie}</div>
                      </div>
                      <div className="text-right shrink-0 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                        <div className="text-base font-black text-red-600 leading-none">{product.stock}</div>
                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-wide mt-0.5">unités</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}