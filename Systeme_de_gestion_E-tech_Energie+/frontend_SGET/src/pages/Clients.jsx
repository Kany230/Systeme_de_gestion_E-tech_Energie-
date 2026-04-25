import React, { useState, useEffect } from 'react';
import {
  Users,
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
  FileText,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient, getClientDocuments } from '../api/clients';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [clientDocuments, setClientDocuments] = useState({});
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Get initials for avatar
  const getInitials = (client) => {
    const first = client.prenom?.charAt(0) || '';
    const last = client.nom?.charAt(0) || '';
    return (first + last).toUpperCase() || 'NA';
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClients();
      const clientsData = response.data || response || [];
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Échec du chargement des clients. Veuillez réessayer.');
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.nom?.toLowerCase().includes(query) ||
          client.prenom?.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.telephone?.includes(query) ||
          client.adresse?.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, clients]);

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

    if (!formData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis';
    }

    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open modal for creating
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (client) => {
    setModalMode('edit');
    setSelectedClient(client);
    setFormData({
      nom: client.nom || '',
      prenom: client.prenom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      adresse: client.adresse || '',
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

      const clientData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email || null,
        telephone: formData.telephone || null,
        adresse: formData.adresse || null,
      };

      if (modalMode === 'create') {
        await createClient(clientData);
      } else {
        await updateClient(selectedClient.id, clientData);
      }

      setShowModal(false);
      await fetchClients();
    } catch (err) {
      console.error('Error saving client:', err);
      setError(err.response?.data?.message || 'Échec de l\'enregistrement du client. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (client) => {
    try {
      setSubmitting(true);
      setError(null);
      await deleteClient(client.id);
      setDeleteConfirm(null);
      await fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      setError(err.response?.data?.message || 'Failed to delete client. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle view documents
  const handleViewDocuments = async (client) => {
    try {
      setSelectedClient(client);
      const response = await getClientDocuments(client.id);
      setClientDocuments(response.data || response || []);
      setShowDocumentsModal(true);
    } catch (err) {
      console.error('Error fetching client documents:', err);
      setError('Échec du chargement des documents du client.');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="text-gray-600 font-medium">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="mt-2 text-gray-600">Gérez votre base de données clients</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter un Client</span>
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

      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des clients par nom, email, téléphone ou adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchClients}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-medium">Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Aucun client trouvé</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery ? 'Essayez un terme de recherche différent' : 'Ajoutez votre premier client pour commencer'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          size="md"
                          fallback={getInitials(client)}
                          className="bg-slate-600"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {client.prenom} {client.nom}
                          </p>
                          <p className="text-xs text-gray-500">ID: {client.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.email ? (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`mailto:${client.email}`}
                            className="text-sm text-gray-600 hover:text-slate-600 transition-colors"
                          >
                            {client.email}
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {client.telephone ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`tel:${client.telephone}`}
                            className="text-sm text-gray-600 hover:text-slate-600 transition-colors"
                          >
                            {client.telephone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {client.adresse ? (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {client.adresse}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleViewDocuments(client)}
                          className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                          title="View documents"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
                          title="Edit client"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(client)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete client"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
              {Math.min(currentPage * itemsPerPage, filteredClients.length)} sur{' '}
              {filteredClients.length} clients
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
                  {modalMode === 'create' ? 'Ajouter un Nouveau Client' : 'Modifier le Client'}
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom *"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  error={formErrors.prenom}
                  placeholder="Entrez le prénom"
                  required
                />

                <Input
                  label="Nom *"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  error={formErrors.nom}
                  placeholder="Entrez le nom"
                  required
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                placeholder="client@exemple.com"
                helperText="Optionnel"
              />

              <Input
                label="Téléphone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleInputChange}
                error={formErrors.telephone}
                placeholder="+33 6 12 34 56 78"
                helperText="Optionnel"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse
                </label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Entrez l'adresse du client (optionnel)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">Optionnel</p>
              </div>
            </form>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Enregistrement...</span>
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
                  <h3 className="text-lg font-bold text-gray-900">Supprimer le Client</h3>
                  <p className="text-sm text-gray-600">
                    Êtes-vous sûr de vouloir supprimer "{deleteConfirm.prenom} {deleteConfirm.nom}" ?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Cette action est irréversible. Toutes les données associées à ce client seront définitivement supprimées.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
                >
                  Annuler
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

      {/* Documents Modal */}
      {showDocumentsModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDocumentsModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Documents du Client - {selectedClient.prenom} {selectedClient.nom}
                </h2>
                <button
                  onClick={() => setShowDocumentsModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {Array.isArray(clientDocuments) && clientDocuments.length > 0 ? (
                <div className="space-y-3">
                  {clientDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.nom}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type_document} - {new Date(doc.date_creation).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={doc.statut === 'validé' ? 'success' : 'warning'} size="sm">
                        {doc.statut}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Aucun document trouvé</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Ce client n'a pas encore de documents.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setShowDocumentsModal(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
