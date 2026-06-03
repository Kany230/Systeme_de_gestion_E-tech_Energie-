import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  Battery,
  Zap,
  Wrench,
  Plug,
  Plus,
  Edit,
  Loader2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Tag,
  BarChart2,
  Upload
} from 'lucide-react'
import Card from '../components/ui/Card' 
import { SearchBar, Button, Badge } from '../components/ui'
import { useProduits } from '../hooks/useProduits'
import { useCategories } from '../hooks/useCategories'
import { useMouvements } from '../hooks/useMouvements'

const categoryIcons: Record<string, any> = {
  'Panneaux Solaires': Package,
  'Batteries': Battery,
  'Onduleurs': Zap,
  'Régulateurs': Wrench,
  'Accessoires': Plug,
}

interface CatalogueProps {
  section?: 'produits' | 'categories' | 'action'
}

export default function Catalogue({ section = 'produits' }: CatalogueProps) {
  const navigate = useNavigate()

  const { produits = [], loading: loadingProd, error: errorProd, refetch: refetchProds, addProduit } = useProduits()  
  const { categories = [], loading: loadingCat, error: errorCat, addCategory, removeCategory, refetch: refetchCats } = useCategories()
  const { mouvements = [], loading: loadingMvt, error: errorMvt, refetch: refetchMvts } = useMouvements()

  // On initialise directement avec la section reçue pour éviter le useEffect conflictuel
  const [currentSection, setCurrentSection] = useState(section)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const [showAddCatModal, setShowAddCatModal] = useState(false)
  const [newCatNom, setNewCatNom] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')

  const [showAddProdModal, setShowAddProdModal] = useState(false)
  
  const [newProd, setNewProd] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '0', 
    seuilAlerte: '2', 
    id_categorie: ''  
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  // Synchronisation sécurisée sans forcer un re-render infini
  useEffect(() => {
    if (section !== currentSection) {
      setCurrentSection(section)
    }
  }, [section])

  const filteredProduits = useMemo(() => {
    const listeProduits = produits || [];
    return listeProduits.filter((produit) => {
      if (!produit) return false;
      const nomCat = typeof produit.categorie === 'object' ? produit.categorie?.nom : produit.categorie
      const categorieString = nomCat || ''
      const matchesSearch = produit.nom?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '' || categorieString === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [produits, searchTerm, selectedCategory])

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProd.nom.trim() || !newProd.prix || !newProd.id_categorie) {
      alert('Veuillez remplir tous les champs obligatoires (*)')
      return
    }

    try {
      await addProduit({
        nom: newProd.nom,
        description: newProd.description,
        prix: Number(newProd.prix),
        stock: Number(newProd.stock),
        seuilAlerte: Number(newProd.seuilAlerte),
        id_categorie: Number(newProd.id_categorie),
        image: selectedImage
      })
      
      setNewProd({ nom: '', description: '', prix: '', stock: '0', seuilAlerte: '2', id_categorie: '' })
      setSelectedImage(null)
      setShowAddProdModal(false)
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'ajout du produit")
    }
  }

  const handleCreateCategorie = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatNom.trim()) return
    try {
      await addCategory(newCatNom, newCatDesc)
      setNewCatNom('')
      setNewCatDesc('')
      setShowAddCatModal(false)
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création')
    }
  }

  const handleDeleteCategorie = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await removeCategory(id)
        if (selectedCategory) setSelectedCategory('')
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression')
      }
    }
  }

  if (loadingProd || loadingCat || loadingMvt) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">             
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500">Chargement des données du catalogue...</p>
      </div>
    )
  }

  const errorGlobal = errorProd || errorCat || errorMvt
  if (errorGlobal) {
    return (
      <Card className="p-6 text-center border-red-200 bg-red-50 max-w-md mx-auto mt-10">
        <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
        <p className="text-red-600 mt-1 mb-4">{errorGlobal}</p>
        <Button onClick={() => { refetchProds?.(); refetchCats?.(); refetchMvts?.(); }} variant="secondary">
          Tenter de recharger
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Catalogue</h1>
          <p className="text-gray-600 mt-1">Gérez vos produits, vos catégories et suivez vos flux d'inventaire</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg border self-start sm:self-auto">
          <button
            onClick={() => navigate('/catalogue/produits')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              currentSection === 'produits' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Produits
          </button>
          <button
            onClick={() => navigate('/catalogue/categories')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              currentSection === 'categories' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag className="w-4 h-4 mr-2" />
            Catégories
          </button>
          <button
            onClick={() => navigate('/catalogue/action')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              currentSection === 'action' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Action
          </button>
        </div>
      </div>

      {/* --- SECTION PRODUITS --- */}
      {currentSection === 'produits' && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            <Card className="flex-1 !p-3">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar onSearch={(value) => setSearchTerm(value)} placeholder="Rechercher un produit..." />
                </div>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-gray-700"
                >
                  <option value="">Toutes les catégories</option>
                  {(categories || []).map((cat) => (
                    <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                  ))}
                </select>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => setShowAddProdModal(true)} className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" /> Ajouter un Produit
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {searchTerm || selectedCategory ? 'Résultats du filtre' : 'Tous les Produits'}
            </h2>
            
            {filteredProduits.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                Aucun produit ne correspond à vos critères de recherche.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProduits.map((produit) => {
                  if (!produit) return null;
                  const nomCat = typeof produit.categorie === 'object' ? produit.categorie?.nom : produit.categorie
                  const Icon = categoryIcons[nomCat || ''] || Package
                  const estEnAlerte = produit.stock <= (produit.seuilAlerte || 0)

                  return (
                    <Card key={produit.id} className="hover:shadow-lg transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-center mb-4 bg-gray-50 rounded-lg p-2 h-40 items-center overflow-hidden border">
                          {produit.image ? (
                            <img 
                              src={`${import.meta.env.VITE_API_URL}/storage/${produit.image}`} 
                              alt={produit.nom} 
                              className="max-h-full max-w-full object-contain rounded"
                            />
                          ) : (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <Icon className="w-12 h-12 text-blue-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="font-semibold text-gray-800 flex-1 line-clamp-2" title={produit.nom}>
                            {produit.nom}
                          </h3>
                          <Badge variant={estEnAlerte ? 'error' : 'success'}>
                            {produit.stock} en stock
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{nomCat || 'Non catégorisé'}</p>
                        {produit.description && (
                          <p className="text-xs text-gray-400 mb-4 line-clamp-2">{produit.description}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-xl font-bold text-blue-600">
                          {Number(produit.prix).toLocaleString()} FCFA
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
            )}
          </div>
        </>
      )}

      {/* --- SECTION CATÉGORIES --- */}
      {currentSection === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Gestion des Catégories</h2>
            <Button onClick={() => setShowAddCatModal(true)} variant="secondary" className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-1" /> Nouvelle Catégorie
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(categories || []).map((category) => {
              if (!category) return null;
              const Icon = categoryIcons[category.nom] || Package
              return (
                <Card key={category.id} className="relative group text-center hover:shadow-md transition-all border-2 border-transparent">
                  <button
                    onClick={(e) => handleDeleteCategorie(e, category.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex justify-center mb-2">
                    <div className="p-2.5 bg-blue-50 rounded-lg">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <div className="font-medium text-sm text-gray-800 truncate px-1">{category.nom}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{category.produitsCount ?? 0} produits</div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* --- SECTION ACTION (FLUX) --- */}
      {currentSection === 'action' && (
        <Card className="overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800 text-lg">Flux de stocks récents</h3>
            <Button onClick={refetchMvts} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Actualiser l'historique
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/70 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b">
                  <th className="p-4">Date & Heure</th>
                  <th className="p-4">Désignation Produit</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Quantité</th>
                  <th className="p-4">Motif d'ajustement</th>
                  <th className="p-4">Opérateur</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {!mouvements || mouvements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 italic">Aucun mouvement de stock enregistré.</td>
                  </tr>
                ) : (
                  mouvements.map((mvt) => {
                    if (!mvt) return null;
                    const estEntree = mvt.type === 'entree'
                    return (
                      <tr key={mvt.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="p-4 text-gray-500 whitespace-nowrap">
                          {mvt.created_at ? new Date(mvt.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '---'}
                        </td>
                        <td className="p-4 font-medium text-gray-900">{mvt.produit?.nom || `Produit #${mvt.produit_id}`}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            estEntree ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {estEntree ? <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" /> : <ArrowDownLeft className="w-3 h-3 mr-1 text-red-500" />}
                            {estEntree ? 'Entrée' : 'Sortie'}
                          </span>
                        </td>
                        <td className={`p-4 text-right font-semibold ${estEntree ? 'text-green-600' : 'text-red-600'}`}>
                          {estEntree ? '+' : '-'}{mvt.quantite}
                        </td>
                        <td className="p-4 text-gray-600 italic max-w-xs truncate" title={mvt.motif}>{mvt.motif || 'Non renseigné'}</td>
                        <td className="p-4 text-gray-500 whitespace-nowrap">{mvt.user?.name || `Utilisateur #${mvt.user_id}`}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --- MODAL AJOUT DE PRODUIT --- */}
      {showAddProdModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="p-6 max-w-lg w-full bg-white space-y-4 shadow-xl border my-8">
            <h3 className="text-xl font-bold text-gray-800">Ajouter un nouveau produit</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={newProd.nom}
                    onChange={(e) => setNewProd({ ...newProd, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Ex: Panneau Solaire 400W Monocristallin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <select
                    required
                    value={newProd.id_categorie}
                    onChange={(e) => setNewProd({ ...newProd, id_categorie: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Sélectionner...</option>
                    {(categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option> 
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProd.prix}
                    onChange={(e) => setNewProd({ ...newProd, prix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Ex: 150000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Initial *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d'Alerte *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProd.seuilAlerte}
                    onChange={(e) => setNewProd({ ...newProd, seuilAlerte: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Illustration du produit (JPEG, PNG...)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span>Choisir un fichier</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {selectedImage && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded truncate max-w-[200px]">{selectedImage.name}</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Caractéristiques techniques ou détails optionnels..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowAddProdModal(false)}>Annuler</Button>
                <Button type="submit">Enregistrer l'article</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- MODAL AJOUT DE CATÉGORIE --- */}
      {showAddCatModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full bg-white space-y-4 shadow-xl border">
            <h3 className="text-xl font-bold text-gray-800">Créer une catégorie</h3>
            <form onSubmit={handleCreateCategorie} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la catégorie *</label>
                <input
                  type="text"
                  placeholder="Ex: Fixations, Câblage..."
                  value={newCatNom}
                  onChange={(e) => setNewCatNom(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnelle)</label>
                <textarea
                  placeholder="Détaillez la catégorie..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowAddCatModal(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}