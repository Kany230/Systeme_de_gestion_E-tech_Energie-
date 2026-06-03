import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth' 
import { type UserProfil } from '../services/auth.service'

export default function GestionUtilisateurs() {
  const { fetchUsers, validateUser, blockUser, unblockUser, removeUser, error } = useAuth()
  const [users, setUsers] = useState<UserProfil[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // États pour la gestion du formulaire de création d'utilisateur
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'secretaire' })
  const [formError, setFormError] = useState<string | null>(null)

  const chargerUtilisateurs = async () => {
    try {
      setLoading(true)
      const liste = await fetchUsers()
      setUsers(liste)
    } catch (err) {
      console.error("Impossible de charger les utilisateurs", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerUtilisateurs()
  }, [])

  const declencherSucces = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const executerAction = async (id: number, action: 'valider' | 'bloquer' | 'debloque') => {
    setActionLoading(id)
    try {
      if (action === 'valider') await validateUser(id)
      if (action === 'bloquer') await blockUser(id)
      if (action === 'debloque') await unblockUser(id)
      
      declencherSucces(`L'action a été exécutée avec succès.`)
      await chargerUtilisateurs() 
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const gererSuppression = async (id: number, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${name} ?`)) {
      setActionLoading(id)
      try {
        await removeUser(id)
        declencherSucces(`L'utilisateur ${name} a été supprimé.`)
        await chargerUtilisateurs()
      } catch (err) {
        console.error(err)
      } finally {
        setActionLoading(null)
      }
    }
  }

  // Soumission du formulaire d'inscription administrative
  const gererInscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    try {
      // Appel à votre endpoint Laravel /inscription (Ajustez selon votre configuration Axios globale si nécessaire)
      const response = await fetch('http://localhost:8000/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          password_confirmation: formData.password // Requis par votre validation Laravel 'confirmed'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription")
      }

      declencherSucces(`Le compte de ${formData.name} a été créé avec succès.`)
      setShowForm(false)
      setFormData({ name: '', email: '', password: '', role: 'secretaire' })
      await chargerUtilisateurs()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  const totalUsers = users.length
  const enAttente = users.filter(u => u.statut === 'en_attente').length
  const actifs = users.filter(u => u.statut === 'active' || u.statut === 'debloque').length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* --- En-tête avec bouton d'Inscription --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-500">Valisez, bloquez ou ajoutez de nouveaux collaborateurs E-Tech.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {showForm ? 'Fermer le formulaire' : '+ Nouvel Utilisateur'}
          </button>
          <button 
            onClick={chargerUtilisateurs} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {/* --- Formulaire d'inscription dynamique --- */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inscrire un nouveau collaborateur</h2>
          <form onSubmit={gererInscription} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom complet</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Fatou Diop"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Adresse Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: f.diop@etech.sn"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe</label>
              <input 
                type="password" 
                required
                minLength={8}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Minimum 8 caractères"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Rôle affecté</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="secretaire">Secrétaire / Gestionnaire</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end mt-2">
              <button 
                type="submit" 
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Créer le compte
              </button>
            </div>
          </form>
          {formError && <p className="text-xs text-red-600 font-medium mt-2">{formError}</p>}
        </div>
      )}

      {/* --- Grille de Statistiques --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Utilisateurs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm text-gray-500 font-medium">En attente d'approbation</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{loading ? '...' : enAttente}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500 font-medium">Comptes Actifs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{loading ? '...' : actifs}</p>
        </div>
      </div>

      {/* --- Messages Flash --- */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* --- Tableau des utilisateurs --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement des utilisateurs...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun utilisateur trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Nom / Email</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Validation</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        item.statut === 'active' || item.statut === 'debloque' ? 'bg-green-100 text-green-700' :
                        item.statut === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.statut === 'active' && 'Actif'}
                        {item.statut === 'debloque' && 'Débloqué'}
                        {item.statut === 'blocked' && 'Bloqué'}
                        {item.statut === 'en_attente' && 'En attente'}
                      </span>
                    </td>

                    <td className="p-4">
                      {item.is_validated ? (
                        <span className="text-green-600 flex items-center gap-1">
                          ✓ Validé
                        </span>
                      ) : (
                        <span className="text-gray-400">Non validé</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {actionLoading === item.id ? (
                        <span className="text-xs text-gray-400 italic">Opération...</span>
                      ) : (
                        <>
                          {item.statut === 'en_attente' && (
                            <button
                              onClick={() => executerAction(item.id, 'valider')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                            >
                              Valider
                            </button>
                          )}

                          {(item.statut === 'active' || item.statut === 'debloque') && (
                            <button
                              onClick={() => executerAction(item.id, 'bloquer')}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors"
                            >
                              Bloquer
                            </button>
                          )}

                          {item.statut === 'blocked' && (
                            <button
                              onClick={() => executerAction(item.id, 'debloque')}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition-colors"
                            >
                              Débloquer
                            </button>
                          )}

                          <button
                            onClick={() => gererSuppression(item.id, item.name)}
                            className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded transition-colors"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}