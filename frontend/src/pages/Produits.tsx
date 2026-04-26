import { useProduits } from '../hooks/useProduits'
import Card from '../components/ui/Card'
import { Button } from '../components/ui'
import { Plus, Edit, Trash2, Package } from 'lucide-react'

export default function Produits() {
  const { produits, loading, error } = useProduits()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
          <p className="text-gray-600 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un Produit
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Produit</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Prix</th>
                <th className="text-left py-3 px-4">Quantité</th>
                <th className="text-left py-3 px-4">Catégorie</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-400 mb-2" />
                      Aucun produit trouvé
                    </div>
                  </td>
                </tr>
              ) : (
                produits.map((produit) => (
                  <tr key={produit.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium">{produit.nom}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{produit.description}</td>
                    <td className="py-3 px-4 font-medium">
                      {produit.prix.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          produit.quantite < 10
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {produit.quantite}
                      </span>
                    </td>
                    <td className="py-3 px-4">{produit.categorie}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="danger">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
