import {
  Package,
  Battery,
  Zap,
  Wrench,
  Plug,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'
import Card from '../components/ui/Card'
import { SearchBar, Button, Badge } from '../components/ui'

const categoryIcons: Record<string, any> = {
  'Panneaux Solaires': Package,
  Batteries: Battery,
  Onduleurs: Zap,
  Régulateurs: Wrench,
  Accessoires: Plug,
}

export default function Catalogue() {
  const categories = [
    { id: 1, nom: 'Panneaux Solaires', count: 15, icon: Package },
    { id: 2, nom: 'Batteries', count: 8, icon: Battery },
    { id: 3, nom: 'Onduleurs', count: 12, icon: Zap },
    { id: 4, nom: 'Régulateurs', count: 6, icon: Wrench },
    { id: 5, nom: 'Accessoires', count: 25, icon: Plug },
  ]

  const produits = [
    {
      id: 1,
      nom: 'Panneau Solaire 100W Monocristallin',
      categorie: 'Panneaux Solaires',
      prix: 45000,
      quantite: 25,
      icon: Package,
    },
    {
      id: 2,
      nom: 'Batterie Gel 12V 100Ah',
      categorie: 'Batteries',
      prix: 85000,
      quantite: 10,
      icon: Battery,
    },
    {
      id: 3,
      nom: 'Onduleur Hybride 3KVA',
      categorie: 'Onduleurs',
      prix: 250000,
      quantite: 5,
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Catalogue</h1>
          <p className="text-gray-600 mt-1">Gérez vos produits et catégories</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un Produit
        </Button>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={() => {}} placeholder="Rechercher un produit..." />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Catégories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="font-medium text-gray-800">{category.nom}</div>
                <div className="text-sm text-gray-500 mt-1">{category.count} produits</div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Produits */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Produits Récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produits.map((produit) => {
            const Icon = produit.icon
            return (
              <Card key={produit.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Icon className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 flex-1">
                    {produit.nom}
                  </h3>
                  <Badge variant={produit.quantite < 10 ? 'error' : 'success'}>
                    {produit.quantite} en stock
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{produit.categorie}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    {produit.prix.toLocaleString()} FCFA
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
