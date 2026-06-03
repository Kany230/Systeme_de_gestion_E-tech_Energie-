import { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { Card } from '../components/ui'
import { Package, AlertTriangle, TrendingUp } from 'lucide-react'

export default function Action() {
  const { rapportActionData, fetchRapportAction, loadingRapport, error } = useDashboard()

  useEffect(() => {
    fetchRapportAction()
  }, [])

  if (loadingRapport) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!rapportActionData) return null

  const { total_catalogue, valeur_economique_stock, alerte_rupture } = rapportActionData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Actions & Alertes de Stock</h1>
        <p className="text-gray-600 mt-1">Supervisez l'état critique de vos stocks et la valeur de vos produits</p>
      </div>

      {/* Cartes d'inventaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Valeur Financière du Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{Number(valeur_economique_stock).toLocaleString()} FCFA</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Références au Catalogue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{total_catalogue} Produits</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Package className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des alertes de rupture */}
      <Card>
        <div className="p-2">
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">Produits nécessitant un réapprovisionnement</h3>
          </div>

          {alerte_rupture?.length === 0 ? (
            <p className="text-center py-6 text-gray-500">Aucune alerte de stock. Tous les produits dépassent leur seuil.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="py-3 px-4">Produit</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Stock Actuel</th>
                    <th className="py-3 px-4">Seuil Critique</th>
                    <th className="py-3 px-4">État</th>
                  </tr>
                </thead>
                <tbody>
                  {alerte_rupture?.map((prod: any) => (
                    <tr key={prod.id} className="border-b hover:bg-red-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{prod.nom}</td>
                      <td className="py-3 px-4 text-gray-600">{prod.categorie?.nom || 'Non classé'}</td>
                      <td className="py-3 px-4 font-bold text-red-600">{prod.stock}</td>
                      <td className="py-3 px-4 text-gray-500">{prod.seuilAlerte}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold">
                          {prod.stock === 0 ? 'Rupture Totale' : 'Stock Faible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}