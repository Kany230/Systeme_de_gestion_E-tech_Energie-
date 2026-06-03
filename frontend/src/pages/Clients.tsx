import { useState } from 'react'
import { useClients } from '../hooks/useClients'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface ClientFormData {
  id?: number
  nom: string
  prenom: string
  telephone: string
  adresse: string
}

export default function Clients() {
  // 1. On récupère addClient et updateClient qui manquaient ici
  const { clients, loading, error, removeClient, addClient, updateClient } = useClients()
  
  const [actionError, setActionError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // --- ÉTATS POUR LA MODALE ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientFormData | null>(null)
  const [formData, setFormData] = useState<ClientFormData>({ nom: '', prenom: '', telephone: '', adresse: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenAddModal = () => {
    setEditingClient(null)
    setFormData({ nom: '', prenom: '', telephone: '', adresse: '' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (client: any) => {
    setEditingClient(client)
    setFormData({
      id: client.id,
      nom: client.nom,
      prenom: client.prenom || '',
      telephone: client.telephone || '',
      adresse: client.adresse || ''
    })
    setIsModalOpen(true)
  }

  // 2. Soumission du formulaire corrigée pour appeler le hook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nom.trim()) {
      setActionError("Le nom est obligatoire")
      return
    }

    try {
      setIsSubmitting(true)
      setActionError(null)

      if (editingClient && formData.id) {
        // Remplacement du console.log par l'appel réel au hook
        await updateClient(formData.id, {
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          adresse: formData.adresse
        })
      } else {
        // Remplacement du console.log par l'appel réel au hook
        await addClient({
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          adresse: formData.adresse
        })
      }

      setIsModalOpen(false) // On ferme la modale uniquement si l'enregistrement a réussi
    } catch (err: any) {
      console.error(err)
      const serverMessage = err.response?.data?.message || "Erreur lors de l'enregistrement dans la base de données."
      setActionError(serverMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number, nomComplet: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${nomComplet}" ?`)) return
    try {
      setActionError(null)
      setDeletingId(id)
      await removeClient(id)
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || "Une erreur est survenue."
      setActionError(serverMessage)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="text-center py-8 text-gray-600 animate-pulse">Chargement...</div>
  if (error) return <div className="text-center py-8 text-red-600 font-medium">{error}</div>

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <Button onClick={handleOpenAddModal}>
          Ajouter un Client
        </Button>
      </div>

      {actionError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm flex justify-between items-center">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-500 font-bold px-2">×</button>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Nom & Prénom</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Téléphone</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Adresse</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Aucun client trouvé</td>
                </tr>
              ) : (
                clients.map((client) => {
                  const nomComplet = `${client.nom} ${client.prenom || ''}`.trim()
                  return (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{nomComplet}</td>
                      <td className="py-3 px-4 text-gray-700">{client.telephone || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{client.adresse || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleOpenEditModal(client)}
                          >
                            Modifier
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            disabled={deletingId === client.id}
                            onClick={() => handleDelete(client.id, nomComplet)}
                          >
                            {deletingId === client.id ? '...' : 'Supprimer'}
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

      {/* --- BACKDROP & COMPOSANT MODALE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {editingClient ? 'Modifier le client' : 'Ajouter un nouveau client'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={e => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Prénom</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Téléphone</label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Adresse</label>
                <textarea
                  value={formData.adresse}
                  onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}