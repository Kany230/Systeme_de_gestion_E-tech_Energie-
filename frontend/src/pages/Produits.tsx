import { useProduits } from '../hooks/useProduits'
import Card from '../components/ui/Card'
import { Button } from '../components/ui'
import { Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'

// Interface locale si nécessaire pour documenter la forme (ajuste selon ton hook)
interface ProduitType {
  id: number | string
  nom: string
  description?: string
  prix: number
  stock: number
  seuilAlerte: number
  categorie?: string | { nom: string } | null
}

export default function Produits() {
  const { produits, loading, error } = useProduits()

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="animate-spin rounded-full h-9 w-9 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-400">Chargement du catalogue...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 border border-red-100 rounded-xl max-w-xl mx-auto p-6">
        <p className="text-red-600 font-semibold">Une erreur est survenue lors de la récupération des produits</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    )
  }

  const listeProduits = (produits ?? []) as ProduitType[]

  return (
    <div className="space-y-8">
      {/* En-tête de la page */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Produits</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez votre catalogue de produits et suivez l'état des stocks</p>
        </div>
        <Button className="py-2.5 shadow-sm font-semibold text-sm flex items-center">
          <Plus className="w-4 h-4 mr-1.5" />
          Ajouter un Produit
        </Button>
      </div>

      {/* Tableau des produits */}
      <Card className="shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50/70 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-5">Produit</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5">Prix Unitaire</th>
                <th className="py-3.5 px-5">État du Stock</th>
                <th className="py-3.5 px-5">Catégorie</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listeProduits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package className="w-12 h-12 text-gray-300" />
                      <p className="text-base text-gray-500 font-semibold">Aucun produit trouvé</p>
                      <p className="text-xs text-gray-400 max-w-xs">Votre catalogue est actuellement vide. Cliquez sur le bouton d'ajout pour commencer.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                listeProduits.map((produit) => {
                  // Extraction sécurisée du nom de la catégorie
                  const nomCategorie = typeof produit.categorie === 'object' && produit.categorie !== null
                    ? produit.categorie.nom
                    : produit.categorie || 'Non classé'

                  const estEnAlerte = produit.stock <= produit.seuilAlerte

                  return (
                    <tr key={produit.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${estEnAlerte ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                            <Package className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {produit.nom}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-5 text-gray-500 max-w-xs truncate">
                        {produit.description || <span className="text-gray-300 font-mono">-</span>}
                      </td>
                      
                      <td className="py-4 px-5 font-bold text-gray-900 font-mono text-xs">
                        {produit.prix.toLocaleString('fr-FR')} FCFA
                      </td>
                      
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${
                            estEnAlerte
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : 'bg-green-50 text-green-700 border-green-100'
                          }`}
                        >
                          {estEnAlerte && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                          {produit.stock} dispo{produit.stock > 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                          {nomCategorie}
                        </span>
                      </td>
                      
                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="p-1.5 hover:text-blue-600 hover:border-blue-200 transition-colors"
                            title="Modifier le produit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            className="p-1.5 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                            title="Supprimer le produit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}