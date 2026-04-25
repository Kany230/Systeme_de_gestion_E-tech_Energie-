import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Save,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, getLowStockProducts } from '../api/products';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    seuilAlerte: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      const productsData = response.data || response || [];
      setProducts(productsData);
      setFilteredProducts(productsData);

      // Fetch low stock products
      try {
        const lowStockResponse = await getLowStockProducts(10);
        setLowStockProducts(lowStockResponse.data || lowStockResponse || []);
      } catch (err) {
        console.error('Error fetching low stock products:', err);
        setLowStockProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Échec du chargement des produits. Veuillez réessayer.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.nom?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.reference?.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, products]);

  // Get stock status
  const getStockStatus = (product) => {
    if (product.stock === 0) {
      return { label: 'Rupture de stock', variant: 'danger' };
    } else if (product.stock <= product.seuilAlerte) {
      return { label: 'Stock bas', variant: 'warning' };
    } else {
      return { label: 'En stock', variant: 'success' };
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) {
      errors.nom = 'Name is required';
    }

    if (!formData.prix || parseFloat(formData.prix) <= 0) {
      errors.prix = 'Le prix doit être un nombre positif';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock must be a positive number';
    }

    if (!formData.seuilAlerte || parseInt(formData.seuilAlerte) < 0) {
      errors.seuilAlerte = 'Alert threshold must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open modal for creating
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      nom: '',
      description: '',
      prix: '',
      stock: '',
      seuilAlerte: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      nom: product.nom || '',
      description: product.description || '',
      prix: product.prix || '',
      stock: product.stock || '',
      seuilAlerte: product.seuilAlerte || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const productData = {
        nom: formData.nom,
        description: formData.description,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        seuilAlerte: parseInt(formData.seuilAlerte),
      };

      if (modalMode === 'create') {
        await createProduct(productData);
      } else {
        await updateProduct(selectedProduct.id, productData);
      }

      setShowModal(false);
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Échec de l\'enregistrement du produit. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (product) => {
    try {
      setSubmitting(true);
      setError(null);
      await deleteProduct(product.id);
      setDeleteConfirm(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Échec de la suppression du produit. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="text-gray-600 font-medium">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <p className="mt-2 text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter un Produit</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Alerte Stock Bas</h3>
                <p className="text-sm text-gray-600">{lowStockProducts.length} produits nécessitent attention</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.slice(0, 5).map((product) => (
              <Badge key={product.id} variant="warning" className="text-xs">
                {product.nom} ({product.stock})
              </Badge>
            ))}
            {lowStockProducts.length > 5 && (
              <Badge variant="warning" className="text-xs">
                +{lowStockProducts.length - 5} de plus
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des produits par nom, description ou référence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchProducts}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-slate-100 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-slate-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.nom}</p>
                            <p className="text-xs text-gray-500">Réf: {product.reference || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {product.description || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {parseFloat(product.prix).toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-semibold text-gray-900">{product.stock}</p>
                          {product.stock <= product.seuilAlerte && (
                            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={stockStatus.variant} size="sm">
                          {stockStatus.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} sur{' '}
              {filteredProducts.length} produits
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-slate-900 text-white'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Ajouter un Nouveau Produit' : 'Modifier le Produit'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Nom du Produit *"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                error={formErrors.nom}
                placeholder="Entrez le nom du produit"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Entrez la description du produit (optionnel)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prix (FCFA) *"
                  name="prix"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.prix}
                  onChange={handleInputChange}
                  error={formErrors.prix}
                  placeholder="0.00"
                  required
                />

                <Input
                  label="Stock *"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  error={formErrors.stock}
                  placeholder="0"
                  required
                />
              </div>

              <Input
                label="Seuil d'Alerte *"
                name="seuilAlerte"
                type="number"
                min="0"
                value={formData.seuilAlerte}
                onChange={handleInputChange}
                error={formErrors.seuilAlerte}
                placeholder="10"
                required
                helperText="Afficher l'alerte lorsque le stock est inférieur à cette valeur"
              />
            </form>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{modalMode === 'create' ? 'Ajouter' : 'Enregistrer'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Supprimer le Produit</h3>
                  <p className="text-sm text-gray-600">
                    Êtes-vous sûr de vouloir supprimer "{deleteConfirm.nom}" ?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Cette action est irréversible. Toutes les données associées à ce produit seront définitivement supprimées.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Suppression...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
