import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import { useLigneCommandes } from '../hooks/useLigneCommandes'
import type { LigneCommande, Produit } from '../types'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

// Types étendus pour éviter le recours à "as any"
export interface LigneDocumentEtendue extends Omit<LigneCommande, 'produit'> {
  id_produit: number
  prixUnitaire: number
  sousTotal: number
  produit?: Produit | null 
}

const BADGE_TYPE: Record<string, string> = {
  facture : 'bg-blue-50 text-blue-700 border border-blue-100',
  devis   : 'bg-purple-50 text-purple-700 border border-purple-100',
  BL      : 'bg-teal-50 text-teal-700 border border-teal-100',
}

const BADGE_STATUT: Record<string, string> = {
  brouillon : 'bg-gray-50 text-gray-700 border border-gray-200',
  valide    : 'bg-green-50 text-green-700 border border-green-200',
  annule    : 'bg-red-50 text-red-700 border border-red-200',
}

const LABEL_TYPE: Record<string, string> = {
  facture : 'Facture',
  devis   : 'Devis',
  BL      : 'Bon de livraison',
}

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR') + ' FCFA'

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { document, loading, error, setDocument, rafraichirTotal, genererPDF } = useDocument(Number(id))
  const [pdfLoading, setPdfLoading] = useState(false);
  const { loading: ligneLoading, modifierLigneCommande, supprimerLigneCommande: supprimerLigne } = useLigneCommandes()

  const [quantites, setQuantites] = useState<Record<number, number>>({})

  if (loading) return <div className="text-center py-16 text-gray-400 text-sm animate-pulse">Chargement du document...</div>
  if (error || !document) return (
    <div className="text-center py-16 text-red-500 font-medium">{error ?? 'Document introuvable'}</div>
  )

  const estBrouillon = document.statut === 'brouillon'
  const lignes = (document.lignes_document ?? []) as LigneDocumentEtendue[]

  // Calculs financiers globaux basés sur l'état courant du document
  const totalHT = Math.round(document.prixTotal)
  const montantTaxe = Math.round(document.prixTotal * (document.taxe ?? 0) / 100)
  const totalTTC = Math.round(document.prixTotal * (1 + (document.taxe ?? 0) / 100))

  const handleTelechargerPDF = async () => {
  setPdfLoading(true);
  const success = await genererPDF(document.id, document.numeroDoc, document.type);
  
  if (success) {
    // Optionnel : Notification de succès
    console.log("PDF généré avec succès");
  } else {
    // L'erreur est déjà gérée dans le hook, mais vous pouvez ajouter un toast ici
    alert("Erreur lors de la génération du PDF");
  }
  setPdfLoading(false);
};

  const handleQuantiteChange = (ligneId: number, val: number) => {
    if (val < 1) return // Sécurité anti-quantité négative ou nulle à l'écriture
    setQuantites(prev => ({ ...prev, [ligneId]: val }))
  }

  const handleSauverQuantite = async (ligne: LigneDocumentEtendue) => {
    const nouvelleQty = quantites[ligne.id] ?? ligne.quantite
    if (nouvelleQty === ligne.quantite) return

    await modifierLigneCommande(ligne.id, nouvelleQty, (ligneMAJ, nouveauTotal) => {
      rafraichirTotal(nouveauTotal)
      setDocument(prev => {
        if (!prev) return prev
        return {
          ...prev,
          lignes_document: prev.lignes_document?.map(l =>
            l.id === ligne.id ? ligneMAJ : l
          ),
        }
      })
      // Nettoyer l'état de modification de cette ligne
      setQuantites(prev => {
        const next = { ...prev }
        delete next[ligne.id]
        return next
      })
    })
  }

  const handleSupprimerLigne = async (ligneId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) return

    await supprimerLigne(ligneId, (nouveauPrix) => {
      rafraichirTotal(nouveauPrix)
      setDocument(prev => {
        if (!prev) return prev
        return {
          ...prev,
          lignes_document: prev.lignes_document?.filter(l => l.id !== ligneId),
        }
      })
    })
  }

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/documents')} className="shrink-0">
            ← Retour
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-gray-900 font-mono tracking-tight">
                {document.numeroDoc}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${BADGE_TYPE[document.type]}`}>
                {LABEL_TYPE[document.type]}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${BADGE_STATUT[document.statut]}`}>
                {document.statut}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Créé le {new Date(document.dateDoc).toLocaleDateString('fr-FR')}
              {document.user && ` · Réalisé par ${document.user.name}`}
            </p>
          </div>
        </div>
        <Button variant="primary" className="shadow-sm" onClick={handleTelechargerPDF} disabled={pdfLoading || loading}>{pdfLoading ? 'Génération...' : 'Télécharger PDF'}</Button>
      </div>

      {/* Blocs d'informations et récapitulatif */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Détails du destinataire
            </p>
            {document.client ? (
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-gray-800 text-base">{document.client.nom}</p>
                {document.client.telephone && <p className="text-gray-500 flex items-center gap-2"><span>📞</span> {document.client.telephone}</p>}
                {document.client.adresse && <p className="text-gray-500 flex items-center gap-2"><span>📍</span> {document.client.adresse}</p>}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-lg">Client référence : #{document.id_client}</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Résumé financier
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Montant Total HT</span>
                <span className="font-semibold text-gray-700">{fmt(totalHT)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Taxe (TVA {document.taxe}%)</span>
                <span className="font-semibold text-gray-700">{fmt(montantTaxe)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center font-black text-lg text-gray-900">
                <span>Total TTC</span>
                <span className="text-blue-600">{fmt(totalTTC)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Section des Lignes d'articles */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-800">
            Articles inclus
            <span className="ml-2 text-xs text-gray-400 font-normal bg-gray-100 px-2 py-0.5 rounded-full">
              {lignes.length} {lignes.length > 1 ? 'articles' : 'article'}
            </span>
          </p>
          {estBrouillon && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 animate-pulse">
              ● Mode édition activé
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/70 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                <th className="text-left py-3 px-5 font-semibold">Libellé Produit</th>
                <th className="text-left py-3 px-5 font-semibold">Prix Unitaire</th>
                <th className="text-left py-3 px-5 font-semibold w-24">Quantité</th>
                <th className="text-left py-3 px-5 font-semibold">Sous-total HT</th>
                {estBrouillon && <th className="text-center py-3 px-5 font-semibold w-40">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lignes.length === 0 ? (
                <tr>
                  <td colSpan={estBrouillon ? 5 : 4} className="text-center py-12 text-gray-400 font-medium">
                    Aucune ligne d'article sur ce document.
                  </td>
                </tr>
              ) : (
                lignes.map(ligne => {
                  const qtyEdited = quantites[ligne.id]
                  const qtyAffichee = qtyEdited ?? ligne.quantite
                  const aEteModifie = qtyEdited !== undefined && qtyEdited !== ligne.quantite
                  
                  // CALCUL REEL : Utilise la quantité saisie à l'écran pour éviter le décalage visuel
                  const sousTotalReel = qtyAffichee * (ligne.prixUnitaire ?? 0)

                  return (
                    <tr key={ligne.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-gray-800">
                        {ligne.produit?.nom ?? `Produit #${ligne.id_produit}`}
                      </td>
                      <td className="py-3.5 px-5 text-gray-500 font-mono text-xs">
                        {fmt(ligne.prixUnitaire ?? 0)}
                      </td>
                      <td className="py-3.5 px-5">
                        {estBrouillon ? (
                          <input
                            type="number"
                            disabled={ligneLoading}
                            min={1}
                            value={qtyAffichee}
                            onChange={e => handleQuantiteChange(ligne.id, Number(e.target.value))}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                          />
                        ) : (
                          <span className="font-mono text-sm font-medium">{ligne.quantite}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-gray-700 font-mono text-xs">
                        {fmt(sousTotalReel)}
                      </td>
                      {estBrouillon && (
                        <td className="py-3.5 px-5">
                          <div className="flex items-center justify-center gap-2">
                            {aEteModifie && (
                              <button
                                disabled={ligneLoading}
                                onClick={() => handleSauverQuantite(ligne)}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 rounded transition-colors shadow-sm"
                              >
                                {ligneLoading ? '...' : 'Enregistrer'}
                              </button>
                            )}
                            <button
                              disabled={ligneLoading}
                              onClick={() => handleSupprimerLigne(ligne.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 disabled:opacity-40 rounded transition-colors"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de récapitulatif bas de tableau */}
        <div className="border-t border-gray-100 px-5 py-3.5 flex flex-wrap justify-end gap-x-8 gap-y-2 text-xs font-medium bg-gray-50/50 rounded-b-xl">
          <span className="text-gray-500">Total HT : <strong className="text-gray-700 font-mono">{fmt(totalHT)}</strong></span>
          <span className="text-gray-500">TVA ({document.taxe}%) : <strong className="text-gray-700 font-mono">{fmt(montantTaxe)}</strong></span>
          <span className="text-sm font-bold text-gray-900">Montant Net TTC : <strong className="text-blue-600 font-mono text-base">{fmt(totalTTC)}</strong></span>
        </div>
      </Card>
    </div>
  )
}