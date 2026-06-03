import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import type { Document } from '../types'
import { Button, Card } from '../components/ui'

const BADGE_TYPE: Record<string, string> = {
  facture : 'bg-blue-100   text-blue-800',
  devis   : 'bg-purple-100 text-purple-800',
  BL      : 'bg-teal-100   text-teal-800',
}

const BADGE_STATUT: Record<string, string> = {
  brouillon : 'bg-gray-100  text-gray-700',
  valide    : 'bg-green-100 text-green-800',
}

const LABEL_TYPE: Record<string, string> = {
  facture : 'Facture',
  devis   : 'Devis',
  BL      : 'Bon de livraison',
}

type FiltreType   = 'facture' | 'devis' | 'BL' | ''
type FiltreStatut = 'brouillon' | 'valide' | ''

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR') + ' FCFA'

export default function Commandes() {
  const navigate = useNavigate()
  const { documents, loading, error, supprimerDocument, validerDocument, convertirEnFacture, convertirEnBL, genererPDF } = useDocuments()

  const [filtreType, setFiltreType] = useState<FiltreType>('')
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('')
  const [actionEnCours, setActionEnCours] = useState<number | null>(null)

  // Optimisation performance : mémoïsation du filtrage pour éviter des recalculs lourds au moindre re-render
  const documentsFiltres = useMemo(() => {
    return documents.filter(d =>
      (!filtreType || d.type === filtreType) &&
      (!filtreStatut || d.statut === filtreStatut)
    )
  }, [documents, filtreType, filtreStatut])

  const totalTTC = (doc: Document) => fmt(doc.prixTotal * (1 + doc.taxe / 100))
  const nomClient = (doc: Document) => doc.client ? doc.client.nom : `Client #${doc.id_client}`

  // Sécurisation des handlers avec try/catch pour éviter le blocage de l'UI
  const handleValider = async (doc: Document) => {
    if (!confirm(`Valider le document ${doc.numeroDoc} ?`)) return
    try {
      setActionEnCours(doc.id)
      await validerDocument(doc.id)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la validation du document.")
    } finally {
      setActionEnCours(null)
    }
  }

  const handleSupprimer = async (doc: Document) => {
    if (!confirm(`Supprimer définitivement ${doc.numeroDoc} ?`)) return
    try {
      setActionEnCours(doc.id)
      await supprimerDocument(doc.id)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la suppression.")
    } finally {
      setActionEnCours(null)
    }
  }

  const handleConvertirFacture = async (doc: Document) => {
    try {
      setActionEnCours(doc.id)
      const facture = await convertirEnFacture(doc.id)
      if (facture) navigate(`/commandes/${facture.id}`)
    } catch (err) {
      console.error(err)
    } finally{
      setActionEnCours(null)
    }
  }

  const handleConvertirBL = async (doc: Document) => {
    try {
      setActionEnCours(doc.id)
      const bl = await convertirEnBL(doc.id)
      if (bl) navigate(`/commandes/${bl.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setActionEnCours(null)
    }
  }

  const handlePDF = async (doc: Document) => {
    try {
      setActionEnCours(doc.id)
      await genererPDF(doc.id, doc.numeroDoc, doc.type)
    } catch (err) {
      console.error(err)
    } finally {
      setActionEnCours(null)
    }
  }

  // Calculs des KPIs globaux mémoïsés basés sur la liste brute
  const { totalBrouillons, totalValides, chiffreAffaire } = useMemo(() => {
    return documents.reduce((acc, d) => {
      if (d.statut === 'brouillon') acc.totalBrouillons++
      if (d.statut === 'valide') acc.totalValides++
      if (d.type === 'facture' && d.statut === 'valide') {
        acc.chiffreAffaire += d.prixTotal * (1 + d.taxe / 100)
      }
      return acc;
    }, { totalBrouillons: 0, totalValides: 0, chiffreAffaire: 0 })
  }, [documents])

  if (loading) return <div className="text-center py-12 text-gray-500 animate-pulse">Chargement...</div>
  if (error) return <div className="text-center py-12 text-red-500 font-medium">{error}</div>

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion et suivi de la facturation</p>
        </div>
        <Button onClick={() => navigate('/commandes/nouveau')}>+ Nouveau document</Button>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: documents.length },
          { label: 'Brouillons', value: totalBrouillons },
          { label: 'Validés', value: totalValides },
          { label: 'CA facturé', value: fmt(chiffreAffaire) },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap items-center bg-gray-50 p-3 rounded-lg">
        <select
          value={filtreType}
          onChange={e => setFiltreType(e.target.value as FiltreType)}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les types</option>
          <option value="facture">Facture</option>
          <option value="devis">Devis</option>
          <option value="BL">Bon de livraison</option>
        </select>

        <select
          value={filtreStatut}
          onChange={e => setFiltreStatut(e.target.value as FiltreStatut)}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="valide">Validé</option>
        </select>

        <span className="text-xs font-medium text-gray-500 ml-auto bg-gray-200 px-2.5 py-1 rounded-full">
          {documentsFiltres.length} résultat{documentsFiltres.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Tableau */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-4 font-semibold">N° Document</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Client</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Total TTC</th>
                <th className="py-3 px-4 font-semibold">Statut</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {documentsFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 bg-white">
                    Aucun document trouvé
                  </td>
                </tr>
              ) : (
                documentsFiltres.map(doc => {
                  const enCours = actionEnCours === doc.id
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      onClick={() => navigate(`/commandes/${doc.id}`)}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-gray-900">
                        {doc.numeroDoc}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_TYPE[doc.type]}`}>
                          {LABEL_TYPE[doc.type]}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800">{nomClient(doc)}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs">
                        {new Date(doc.dateDoc).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">{totalTTC(doc)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_STATUT[doc.statut]}`}>
                          {doc.statut}
                        </span>
                      </td>
                      {/* Blocage propre de la propagation pour éviter d'ouvrir le détail du document au clic sur une action */}
                      <td
                        className="py-3.5 px-4"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex gap-1.5 flex-wrap justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={enCours}
                            onClick={() => handlePDF(doc)}
                          >
                            PDF
                          </Button>

                          {doc.statut === 'brouillon' && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={enCours}
                                onClick={() => handleValider(doc)}
                              >
                                {enCours ? '...' : 'Valider'}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={enCours}
                                onClick={() => handleSupprimer(doc)}
                              >
                                Supprimer
                              </Button>
                            </>
                          )}

                          {doc.type === 'devis' && doc.statut === 'valide' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={enCours}
                              onClick={() => handleConvertirFacture(doc)}
                            >
                              → Facture
                            </Button>
                          )}

                          {doc.type === 'facture' && doc.statut === 'valide' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={enCours}
                              onClick={() => handleConvertirBL(doc)}
                            >
                              → BL
                            </Button>
                          )}
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
  )
}