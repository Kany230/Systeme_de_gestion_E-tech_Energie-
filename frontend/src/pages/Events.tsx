import { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { Card } from '../components/ui'
import { DollarSign, Calendar, ArrowRight } from 'lucide-react'

// Définition des structures de données attendues
interface RépartitionType {
  type: 'facture' | 'devis' | 'BL' | string
  total_docs: number
  montant_cumule: number
}

interface FluxRecent {
  id: number | string
  numero: string
  type: 'facture' | 'devis' | 'BL' | string
  client: string
  total: number
  statut: string
}

// Dictionnaires de correspondances graphiques et textuelles
const CONFIG_TYPE: Record<string, { label: string; style: string }> = {
  facture: { label: 'Facture', style: 'bg-blue-50 text-blue-700 border border-blue-100' },
  devis:   { label: 'Devis', style: 'bg-purple-50 text-purple-700 border border-purple-100' },
  BL:      { label: 'Bon de livraison', style: 'bg-teal-50 text-teal-700 border border-teal-100' },
}

const CONFIG_STATUT: Record<string, { label: string; style: string }> = {
  valide:    { label: 'Validée', style: 'bg-green-50 text-green-700 border border-green-100' },
  paye:      { label: 'Payée', style: 'bg-green-50 text-green-700 border border-green-100' },
  en_cours:  { label: 'En cours', style: 'bg-amber-50 text-amber-700 border border-amber-100' },
  brouillon: { label: 'Brouillon', style: 'bg-gray-50 text-gray-600 border border-gray-200' },
  annune:    { label: 'Annulée', style: 'bg-red-50 text-red-700 border border-red-100' },
}

const formatFCFA = (val: number) => Math.round(val ?? 0).toLocaleString('fr-FR') + ' FCFA'

export default function Events() {
  const { rapportEventsData, fetchRapportEvents, loadingRapport, error } = useDashboard()

  useEffect(() => {
    fetchRapportEvents()
  }, [fetchRapportEvents])

  if (loadingRapport) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="animate-spin rounded-full h-9 w-9 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-400">Génération du rapport financier...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 border border-red-100 rounded-xl max-w-xl mx-auto p-6">
        <p className="text-red-600 font-semibold">Une erreur est survenue lors de la récupération du rapport</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    )
  }

  if (!rapportEventsData) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm border border-dashed rounded-xl">
        Aucune donnée d'événement disponible.
      </div>
    )
  }

  const chiffreAffaires = rapportEventsData.chiffre_affaires ?? 0
  const ventesJour = rapportEventsData.ventes_jour ?? 0
  const repartition = (rapportEventsData.repartition ?? []) as RépartitionType[]
  const fluxRecents = (rapportEventsData.flux_recents ?? []) as FluxRecent[]

  return (
    <div className="space-y-8">
      {/* En-tête du module */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Rapport des Événements & Ventes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Analyse des flux financiers et transactions du système</p>
        </div>
      </div>

      {/* Indicateurs Clés Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chiffre d'Affaires Global</p>
              <p className="text-3xl font-black text-gray-900 tracking-tight font-mono">{formatFCFA(chiffreAffaires)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl border border-green-100 shadow-sm">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Activité Aujourd'hui</p>
              <p className="text-3xl font-black text-gray-900 tracking-tight">
                {ventesJour} <span className="text-lg font-medium text-gray-500">document{ventesJour > 1 ? 's' : ''}</span>
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Section Répartition par type */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Volumes cumulés par type de pièce</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repartition.map((rep) => {
            const config = CONFIG_TYPE[rep.type] || { label: rep.type, style: 'bg-gray-100 text-gray-800' }
            return (
              <Card key={rep.type}>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${config.style}`}>
                      {config.label}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border">
                      {rep.total_docs} créé{rep.total_docs > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 font-mono">{formatFCFA(rep.montant_cumule)}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Flux Récent en Direct */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Flux des 5 dernières transactions</h3>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50/70 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-5">Numéro</th>
                  <th className="py-3 px-5">Type de Pièce</th>
                  <th className="py-3 px-5">Client</th>
                  <th className="py-3 px-5">Montant Réglé</th>
                  <th className="py-3 px-5 text-center">Statut transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fluxRecents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 font-medium">
                      Aucune transaction récente enregistrée.
                    </td>
                  </tr>
                ) : (
                  fluxRecents.map((flux) => {
                    const typeConfig = CONFIG_TYPE[flux.type] || { label: flux.type, style: 'bg-gray-50 text-gray-700' }
                    const statutConfig = CONFIG_STATUT[flux.statut] || { label: flux.statut, style: 'bg-gray-50 text-gray-600' }
                    
                    return (
                      <tr key={flux.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-3.5 px-5 font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700 cursor-pointer">
                          <span className="flex items-center gap-1">
                            {flux.numero}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${typeConfig.style}`}>
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-gray-600 font-medium">{flux.client}</td>
                        <td className="py-3.5 px-5 font-bold text-gray-800 font-mono text-xs">{formatFCFA(flux.total)}</td>
                        <td className="py-3.5 px-5">
                          <div className="flex justify-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${statutConfig.style}`}>
                              {statutConfig.label}
                            </span>
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
    </div>
  )
}