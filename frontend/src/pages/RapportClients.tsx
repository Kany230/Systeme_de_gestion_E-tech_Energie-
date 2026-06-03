import { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { Card } from '../components/ui'
import { Users, Award, Phone, Trophy } from 'lucide-react'

// Définition de la structure des données clients pour le classement
interface ClassementClientType {
  id: number | string
  nom: string
  prenom: string
  telephone?: string
  nombre_factures: number
  total_achats: number | string
}

export default function RapportClients() {
  const { rapportClientsData, fetchRapportClients, loadingRapport, error } = useDashboard()

  useEffect(() => {
    fetchRapportClients()
  }, [fetchRapportClients])

  if (loadingRapport) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="animate-spin rounded-full h-9 w-9 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-400">Analyse du portefeuille clients...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 border border-red-100 rounded-xl max-w-xl mx-auto p-6">
        <p className="text-red-600 font-semibold">Une erreur est survenue lors du chargement du rapport</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    )
  }

  if (!rapportClientsData) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm border border-dashed rounded-xl">
        Aucune donnée client disponible pour le moment.
      </div>
    )
  }

  const totalClients = rapportClientsData.total_clients ?? 0
  const classementClients = (rapportClientsData.classement_clients ?? []) as ClassementClientType[]

  return (
    <div className="space-y-8">
      {/* En-tête du module */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Portefeuille & Classement Clients</h1>
          <p className="text-sm text-gray-500 mt-0.5">Analyse des performances et volumes d'achat par client</p>
        </div>
      </div>

      {/* Indicateur Clé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Clients Enregistrés</p>
              <p className="text-3xl font-black text-gray-900 tracking-tight">
                {totalClients} <span className="text-sm font-medium text-gray-500">Compte{totalClients > 1 ? 's' : ''}</span>
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau du Classement commercial */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Top des clients par volume d'achat (Factures validées)
          </h2>
        </div>

        <Card className="shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50/70 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-5 text-center w-20">Rang</th>
                  <th className="py-3.5 px-5">Nom Complet</th>
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5 text-center">Nombre Factures</th>
                  <th className="py-3.5 px-5">Total Des Achats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classementClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 font-medium">
                      Aucune transaction validée trouvée pour générer le classement.
                    </td>
                  </tr>
                ) : (
                  classementClients.map((item, index) => {
                    const rang = index + 1
                    
                    // Détermination du style de badge selon le classement sur le podium
                    const stylePodium = 
                      rang === 1 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      rang === 2 ? 'bg-slate-50 text-slate-700 border-slate-200' :
                      rang === 3 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-gray-50 text-gray-500 border-gray-100'

                    const iconeMedaille = rang === 1 ? '🥇' : rang === 2 ? '🥈' : rang === 3 ? '🥉' : `#${rang}`

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                        {/* Colonne Rang stylisée */}
                        <td className="py-4 px-5 text-center">
                          <span className={`inline-flex items-center justify-center font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${stylePodium}`}>
                            {iconeMedaille}
                          </span>
                        </td>
                        
                        {/* Identité client */}
                        <td className="py-4 px-5">
                          <span className="font-bold text-gray-800 tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                            {item.prenom} {item.nom}
                          </span>
                        </td>
                        
                        {/* Coordonnées */}
                        <td className="py-4 px-5 text-gray-500">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-xs">{item.telephone || 'Non renseigné'}</span>
                          </div>
                        </td>
                        
                        {/* Volume de documents */}
                        <td className="py-4 px-5 text-center font-bold text-gray-700 font-mono text-xs">
                          {item.nombre_factures}
                        </td>
                        
                        {/* Chiffre d'Affaires généré */}
                        <td className="py-4 px-5 font-black text-green-600 font-mono text-xs">
                          {Number(item.total_achats).toLocaleString('fr-FR')} FCFA
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
    </div>
  )
}