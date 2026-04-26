import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
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
  Download,
  Eye,
  CheckCircle,
  ArrowRight,
  Calendar,
  User,
  Package,
  Euro,
  File,
  Printer,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
  validateDocument,
  convertToInvoice,
  convertToBL,
  generatePDF,
} from '../api/documents';
import { getClients } from '../api/clients';
import { getProducts } from '../api/products';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Documents() {
  const { hasRole } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    type: 'devis',
    client_id: '',
    taux_taxe: 18,
    lignes: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [currentLine, setCurrentLine] = useState({
    product_id: '',
    quantite: 1,
    prix_unitaire: 0,
  });

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = activeFilter !== 'all' ? { type: activeFilter } : {};
      const response = await getDocuments(filters);
      const documentsData = response.data || response || [];
      setDocuments(documentsData);
      setFilteredDocuments(documentsData);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
      setDocuments([]);
      setFilteredDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // Fetch clients and products
  const fetchClientsAndProducts = async () => {
    try {
      const [clientsResponse, productsResponse] = await Promise.all([
        getClients(),
        getProducts(),
      ]);
      setClients(clientsResponse.data || clientsResponse || []);
      setProducts(productsResponse.data || productsResponse || []);
    } catch (err) {
      console.error('Error fetching clients/products:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchClientsAndProducts();
  }, [activeFilter, fetchDocuments]);

  // Filter documents based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = documents.filter(
        (doc) =>
          doc.reference?.toLowerCase().includes(query) ||
          doc.client_nom?.toLowerCase().includes(query) ||
          doc.client_prenom?.toLowerCase().includes(query) ||
          doc.type?.toLowerCase().includes(query)
      );
      setFilteredDocuments(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, documents]);

  // Get document type configuration
  const getDocumentTypeConfig = (type) => {
    const configs = {
      devis: {
        label: 'Devis',
        color: 'bg-blue-100 text-blue-800',
        icon: FileText,
        bgColor: 'bg-blue-50',
      },
      facture: {
        label: 'Facture',
        color: 'bg-green-100 text-green-800',
        icon: File,
        bgColor: 'bg-green-50',
      },
      'bon_de_livraison': {
        label: 'BL',
        color: 'bg-orange-100 text-orange-800',
        icon: Package,
        bgColor: 'bg-orange-50',
      },
    };
    return configs[type] || configs.devis;
  };

  // Get document status configuration
  const getDocumentStatusConfig = (status) => {
    const configs = {
      brouillon: { label: 'Brouillon', variant: 'warning' },
      valide: { label: 'Validé', variant: 'success' },
      paye: { label: 'Payé', variant: 'success' },
      annule: { label: 'Annulé', variant: 'danger' },
    };
    return configs[status] || { label: status, variant: 'default' };
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Add line to document
  const handleAddLine = () => {
    const productId = parseInt(currentLine.product_id);
    if (!productId || isNaN(productId)) {
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return;
    }

    const quantite = parseInt(currentLine.quantite) || 1;
    const prix_unitaire = parseFloat(currentLine.prix_unitaire) || product.prix || 0;

    const line = {
      id_produit: productId,
      designation: product.nom,
      quantite: quantite,
      prix_unitaire: prix_unitaire,
    };

    setFormData({
      ...formData,
      lignes: [...formData.lignes, line],
    });

    setCurrentLine({
      product_id: '',
      quantite: 1,
      prix_unitaire: 0,
    });
  };

  // Handle selecting a product from dropdown
  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id === parseInt(productId));

    setCurrentLine({
      product_id: productId,
      quantite: 1,
      prix_unitaire: product ? product.prix : 0,
    });
  };

  // Handle quantity or price input change
  const handleLineInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Remove line from document
  const handleRemoveLine = (index) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter((_, i) => i !== index),
    });
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.lignes.reduce(
      (sum, line) => sum + (line.prix_unitaire || 0) * (line.quantite || 0),
      0
    );
    const tax = subtotal * ((formData.taux_taxe || 0) / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.client_id) {
      errors.client_id = 'Client is required';
    }

    if (formData.lignes.length === 0) {
      errors.lignes = 'At least one product is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create document
  const handleCreate = () => {
    setFormData({
      type: 'devis',
      client_id: '',
      taux_taxe: 18,
      lignes: [],
    });
    setCurrentLine({
      product_id: '',
      quantite: 1,
      prix_unitaire: 0,
    });
    setFormErrors({});
    setShowCreateModal(true);
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

      const { subtotal, tax, total } = calculateTotals();

      const documentData = {
        type: formData.type,
        id_client: parseInt(formData.client_id),
        taux_taxe: formData.taux_taxe,
        produits: formData.lignes,
      };

      await createDocument(documentData);

      setShowCreateModal(false);
      await fetchDocuments();
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err.response?.data?.message || 'Failed to create document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle view document
  const handleView = async (document) => {
    try {
      const response = await getDocument(document.id);
      setSelectedDocument(response.data || response);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document details.');
    }
  };

  // Handle validate document
  const handleValidate = async (document) => {
    try {
      setSubmitting(true);
      setError(null);
      await validateDocument(document.id);
      await fetchDocuments();
      if (selectedDocument && selectedDocument.id === document.id) {
        await handleView(document);
      }
    } catch (err) {
      console.error('Error validating document:', err);
      setError(err.response?.data?.message || 'Failed to validate document.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle convert to invoice
  const handleConvertToInvoice = async (document) => {
    try {
      setSubmitting(true);
      setError(null);
      await convertToInvoice(document.id);
      await fetchDocuments();
    } catch (err) {
      console.error('Error converting to invoice:', err);
      setError(err.response?.data?.message || 'Failed to convert to invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle convert to BL
  const handleConvertToBL = async (document) => {
    try {
      setSubmitting(true);
      setError(null);
      await convertToBL(document.id);
      await fetchDocuments();
    } catch (err) {
      console.error('Error converting to BL:', err);
      setError(err.response?.data?.message || 'Failed to convert to BL.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle download PDF
  const handleDownloadPDF = async (doc) => {
    try {
      setSubmitting(true);
      setError(null);
      const pdfBlob = await generatePDF(doc.id);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.reference}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Échec du téléchargement du PDF.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete document
  const handleDelete = async (document) => {
    try {
      setSubmitting(true);
      setError(null);
      await deleteDocument(document.id);
      setDeleteConfirm(null);
      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.response?.data?.message || 'Failed to delete document.');
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="text-gray-600 font-medium">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-2 text-gray-600">Gérez vos devis, factures et bons de livraison</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau Document</span>
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

      {/* Filter Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-1">
              {['all', 'devis', 'facture', 'bon_de_livraison'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'devis' ? 'Devis' : filter === 'facture' ? 'Factures' : 'BL'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchDocuments}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des documents par référence, client ou type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No documents found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery ? 'Try a different search term' : 'Create your first document to get started'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((doc) => {
                  const typeConfig = getDocumentTypeConfig(doc.type);
                  const statusConfig = getDocumentStatusConfig(doc.statut);
                  const TypeIcon = typeConfig.icon;

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className={`h-4 w-4 ${typeConfig.color.replace('100', '600').split(' ')[1]}`} />
                          <span className="font-semibold text-gray-900">{doc.reference}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {doc.client ? `${doc.client.prenom || ''} ${doc.client.nom || ''}`.trim() : (doc.client_nom ? `${doc.client_prenom || ''} ${doc.client_nom || ''}`.trim() : 'Client inconnu')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {doc.date_creation ? new Date(doc.date_creation).toLocaleDateString('fr-FR') : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Euro className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {typeof doc.total === 'number' && !isNaN(doc.total)
                              ? doc.total.toLocaleString('fr-FR') + ' FCFA'
                              : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConfig.variant} size="sm">
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(doc)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {doc.statut === 'brouillon' && (
                            <button
                              onClick={() => handleValidate(doc)}
                              className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                              title="Validate document"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {doc.type === 'devis' && doc.statut === 'valide' && (
                            <button
                              onClick={() => handleConvertToInvoice(doc)}
                              className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
                              title="Convert to invoice"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                          {doc.type === 'facture' && doc.statut === 'valide' && (
                            <button
                              onClick={() => handleConvertToBL(doc)}
                              className="p-2 rounded-lg hover:bg-orange-100 text-orange-600 transition-colors"
                              title="Convert to BL"
                            >
                              <Package className="h-4 w-4" />
                            </button>
                          )}
                          {doc.statut === 'brouillon' && hasRole(['admin']) && (
                            <button
                              onClick={() => setDeleteConfirm(doc)}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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
              {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} sur{' '}
              {filteredDocuments.length} documents
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

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">New Document</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Document Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="devis">Devis</option>
                    <option value="facture">Facture</option>
                    <option value="bon_de_livraison">Bon de Livraison</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Client *
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.client_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.prenom} {client.nom}
                      </option>
                    ))}
                  </select>
                  {formErrors.client_id && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.client_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Taux de TVA (%)
                  </label>
                  <input
                    type="number"
                    name="taux_taxe"
                    value={formData.taux_taxe}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Add Products */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Product *
                    </label>
                    <select
                      value={currentLine.product_id}
                      onChange={handleProductSelect}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nom} - {parseFloat(product.prix || 0).toFixed(2)}FCFA
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quantité *
                    </label>
                    <input
                      type="number"
                      name="quantite"
                      value={currentLine.quantite}
                      onChange={handleLineInputChange}
                      min="1"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Prix Unitaire (FCFA)
                    </label>
                    <input
                      type="number"
                      name="prix_unitaire"
                      value={currentLine.prix_unitaire}
                      onChange={handleLineInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddLine}
                  className="w-full py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* Document Lines */}
              {formData.lignes.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Prix Unitaire
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.lignes.map((line, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{line.designation}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{line.quantite}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {parseFloat(line.prix_unitaire || 0).toFixed(2)}FCFA
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {((line.quantite || 0) * (line.prix_unitaire || 0)).toFixed(2)}FCFA
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(index)}
                              className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              {formData.lignes.length > 0 && (
                <div className="flex justify-end">
                  <div className="w-full md:w-1/3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-semibold text-gray-900">
                        {calculateTotals().subtotal.toFixed(2)}FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA ({formData.taux_taxe}%):</span>
                      <span className="font-semibold text-gray-900">
                        {calculateTotals().tax.toFixed(2)}FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-slate-600">
                        {calculateTotals().total.toFixed(2)}FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {formErrors.lignes && (
                <p className="text-sm text-red-600">{formErrors.lignes}</p>
              )}
            </form>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {showViewModal && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedDocument.reference}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {getDocumentTypeConfig(selectedDocument.type).label} -{' '}
                    {new Date(selectedDocument.date_creation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Client Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {selectedDocument.client ? `${selectedDocument.client.prenom || ''} ${selectedDocument.client.nom || ''}`.trim() : (selectedDocument.client_nom ? `${selectedDocument.client_prenom || ''} ${selectedDocument.client_nom || ''}`.trim() : 'Client inconnu')}
                      </span>
                    </div>
                    {selectedDocument.client_email && (
                      <div className="text-sm text-gray-600">{selectedDocument.client_email}</div>
                    )}
                    {selectedDocument.client_telephone && (
                      <div className="text-sm text-gray-600">{selectedDocument.client_telephone}</div>
                    )}
                    {selectedDocument.client_adresse && (
                      <div className="text-sm text-gray-600">{selectedDocument.client_adresse}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Document Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getDocumentStatusConfig(selectedDocument.statut).variant} size="sm">
                        {getDocumentStatusConfig(selectedDocument.statut).label}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taux de TVA:</span>
                      <span className="text-gray-900">{selectedDocument.taux_taxe}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">
                        {selectedDocument.date_creation ? new Date(selectedDocument.date_creation).toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-700 mb-3">Products</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Prix Unitaire
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedDocument.lignes && selectedDocument.lignes.map((line, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{line.designation}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{line.quantite}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {parseFloat(line.prix_unitaire || 0).toFixed(2)}FCFA
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {((line.quantite || 0) * (line.prix_unitaire || 0)).toFixed(2)}FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-full md:w-1/3 space-y-2 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-semibold text-gray-900">
                      {typeof selectedDocument.sous_total === 'number' && !isNaN(selectedDocument.sous_total)
                        ? selectedDocument.sous_total.toFixed(2) + ' FCFA'
                        : '0.00 FCFA'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA:</span>
                    <span className="font-semibold text-gray-900">
                      {typeof selectedDocument.montant_taxe === 'number' && !isNaN(selectedDocument.montant_taxe)
                        ? selectedDocument.montant_taxe.toFixed(2) + ' FCFA'
                        : '0.00 FCFA'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-slate-600">
                      {typeof selectedDocument.total === 'number' && !isNaN(selectedDocument.total)
                        ? selectedDocument.total.toFixed(2) + ' FCFA'
                        : '0.00 FCFA'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              {selectedDocument.statut === 'brouillon' && (
                <button
                  onClick={() => handleValidate(selectedDocument)}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Validate Document</span>
                    </>
                  )}
                </button>
              )}
              {selectedDocument.type === 'devis' && selectedDocument.statut === 'valide' && (
                <button
                  onClick={() => handleConvertToInvoice(selectedDocument)}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      <span>Convert to Invoice</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => handleDownloadPDF(selectedDocument)}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
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
                  <h3 className="text-lg font-bold text-gray-900">Delete Document</h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete "{deleteConfirm.reference}"?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                This action cannot be undone. All data associated with this document will be permanently removed.
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
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
