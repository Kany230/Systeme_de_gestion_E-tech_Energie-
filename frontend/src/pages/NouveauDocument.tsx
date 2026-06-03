import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import { Button, Card } from '../components/ui'
import Input from '../components/ui/Input'
import type { CreateDocumentData } from '../services/document.service'

// ─── Types locaux ────────────────────────────────────────────────────────────

type ModeClient = 'existant' | 'nouveau'

interface LigneProduit {
  id_produit: number
  quantite: number
  nomProduit?: string   // affiché uniquement en UI
  prixUnitaire?: number // affiché uniquement en UI
}

interface ProduitApi {
  id: number
  nom: string
  prix: number
}

interface ClientApi {
  id: number
  nom: string
  prenom?: string
  telephone?: string
}

// ─── Composant ───────────────────────────────────────────────────────────────

export default function NouveauDocument() {
  const navigate = useNavigate()
  const { creerDocument } = useDocuments() // Utilisation directe de la méthode issue du hook fourni

  // Champs principaux
  const [type, setType]       = useState<'facture' | 'devis' | 'BL'>('devis')
  const [taxe, setTaxe]       = useState<number>(18)
  const [format, setFormat]   = useState<'A4' | 'A3' | 'A5'>('A4')

  // Client
  const [modeClient, setModeClient]             = useState<ModeClient>('existant')
  const [idClient, setIdClient]                 = useState<number | ''>('')
  const [nomClient, setNomClient]               = useState('')
  const [prenomClient, setPrenomClient]         = useState('')
  const [telephoneClient, setTelephoneClient]   = useState('')
  const [adresseClient, setAdresseClient]       = useState('')
  const [clientsDisponibles, setClientsDisponibles] = useState<ClientApi[]>([])

  // Produits
  const [produits, setProduits]                 = useState<LigneProduit[]>([])
  const [produitsDisponibles, setProduitsDisponibles] = useState<ProduitApi[]>([])

  // UI
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loadingDonnees, setLoadingDonnees] = useState(true)

  // Chargement des listes de données au montage (Produits et Clients)
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const { default: api } = await import('../services/api')
        
        // Exécution des requêtes en parallèle pour aller plus vite
        const [resProduits, resClients] = await Promise.all([
          api.get<ProduitApi[]>('/produits'),
          api.get<ClientApi[]>('/clients') // Route Laravel typique pour récupérer les clients
        ])

        setProduitsDisponibles(resProduits.data)
        setClientsDisponibles(resClients.data)
      } catch {
        setError('Impossible de charger les données du catalogue ou des clients.')
      } finally {
        setLoadingDonnees(false)
      }
    }
    chargerDonnees()
  }, [])

  // ── Gestion des lignes produits ──────────────────────────────────────────

  const ajouterLigne = () => {
    setProduits(prev => [...prev, { id_produit: 0, quantite: 1 }])
  }

  const supprimerLigne = (index: number) => {
    setProduits(prev => prev.filter((_, i) => i !== index))
  }

  const modifierLigne = (index: number, champ: keyof LigneProduit, valeur: number) => {
    setProduits(prev => prev.map((ligne, i) => {
      if (i !== index) return ligne
      if (champ === 'id_produit') {
        const produit = produitsDisponibles.find(p => p.id === valeur)
        return {
          ...ligne,
          id_produit: valeur,
          nomProduit: produit?.nom,
          prixUnitaire: produit?.prix,
        }
      }
      return { ...ligne, [champ]: valeur }
    }))
  }

  // ── Calcul aperçu TTC ────────────────────────────────────────────────────

  const totalHT = produits.reduce((acc, l) => {
    return acc + (l.prixUnitaire ?? 0) * l.quantite
  }, 0)
  const totalTTC = totalHT * (1 + taxe / 100)
  const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR') + ' FCFA'

  // ── Soumission ───────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validations front
    if (produits.length === 0) {
      setError('Ajoutez au moins un produit.')
      return
    }
    if (produits.some(l => l.id_produit === 0 || l.quantite < 1)) {
      setError('Chaque ligne doit avoir un produit et une quantité valide.')
      return
    }
    if (modeClient === 'existant' && !idClient) {
      setError('Veuillez sélectionner un client dans la liste.');
      return
    }
    if (modeClient === 'nouveau' && !nomClient.trim()) {
      setError('Le nom du client est obligatoire.')
      return
    }

    const payload: CreateDocumentData = {
      type,
      taxe,
      format,
      produits: produits.map(l => ({
        id_produit: l.id_produit,
        quantite: l.quantite,
      })),
      ...(modeClient === 'existant'
        ? { id_client: idClient as number }
        : {
            nomClient,
            prenomClient,
            telephoneClient,
            adresseClient,
          }),
    }

    setLoading(true)
    try {
      // Exécution de la fonction issue de votre hook personnalisé
      const doc = await creerDocument(payload)
      if (doc) {
        navigate(`/commandes/${doc.id}`)
      } else {
        setError('Erreur lors de la création du document.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ─── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Nouveau document</h1>
          <p className="text-sm text-gray-500 mt-1">Remplissez les informations ci-dessous</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Retour
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Section : Type & Format ── */}
        <Card>
          <div className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Type de document
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as typeof type)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="devis">Devis</option>
                  <option value="facture">Facture</option>
                  <option value="BL">Bon de livraison</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value as typeof format)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A5">A5</option>
                </select>
              </div>
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxe (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={taxe}
                onChange={e => setTaxe(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        </Card>

        {/* ── Section : Client ── */}
        <Card>
          <div className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Client</h2>

            {/* Bascule mode client */}
            <div className="flex gap-3">
              {(['existant', 'nouveau'] as ModeClient[]).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModeClient(mode)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    modeClient === mode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {mode === 'existant' ? 'Client existant' : 'Nouveau client'}
                </button>
              ))}
            </div>

            {modeClient === 'existant' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Choisir un client *</label>
                <select
                  value={idClient}
                  onChange={e => setIdClient(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={loading || loadingDonnees}
                >
                  <option value="">-- Sélectionner un client --</option>
                  {clientsDisponibles.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.prenom ? `${c.prenom} ` : ''}{c.nom.toUpperCase()} {c.telephone ? `(${c.telephone})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Sélectionnez le client concerné par ce document facturable.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nom *"
                  type="text"
                  value={nomClient}
                  onChange={e => setNomClient(e.target.value)}
                  placeholder="Diallo"
                  required
                  disabled={loading}
                />
                <Input
                  label="Prénom"
                  type="text"
                  value={prenomClient}
                  onChange={e => setPrenomClient(e.target.value)}
                  placeholder="Mamadou"
                  disabled={loading}
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  value={telephoneClient}
                  onChange={e => setTelephoneClient(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  disabled={loading}
                />
                <Input
                  label="Adresse"
                  type="text"
                  value={adresseClient}
                  onChange={e => setAdresseClient(e.target.value)}
                  placeholder="Dakar, Sénégal"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </Card>

        {/* ── Section : Produits ── */}
        <Card>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Produits
              </h2>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={ajouterLigne}
                disabled={loading || loadingDonnees}
              >
                + Ajouter un produit
              </Button>
            </div>

            {loadingDonnees ? (
              <p className="text-sm text-gray-400 animate-pulse">Chargement des données...</p>
            ) : produits.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                Aucun produit ajouté. Cliquez sur "+ Ajouter un produit".
              </p>
            ) : (
              <div className="space-y-3">
                {produits.map((ligne, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_100px_auto] gap-3 items-end bg-gray-50 p-3 rounded-lg"
                  >
                    {/* Sélecteur produit */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Produit *
                      </label>
                      <select
                        value={ligne.id_produit || ''}
                        onChange={e => modifierLigne(index, 'id_produit', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        disabled={loading}
                      >
                        <option value="">-- Choisir --</option>
                        {produitsDisponibles.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nom} — {fmt(p.prix)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantité */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Qté *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={ligne.quantite}
                        onChange={e => modifierLigne(index, 'quantite', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>

                    {/* Supprimer */}
                    <button
                      type="button"
                      onClick={() => supprimerLigne(index)}
                      className="text-red-400 hover:text-red-600 transition-colors pb-2 text-lg font-bold"
                      disabled={loading}
                      title="Supprimer cette ligne"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Aperçu totaux */}
            {produits.length > 0 && (
              <div className="border-t border-gray-100 pt-4 space-y-1 text-sm text-right">
                <p className="text-gray-500">
                  Total HT : <span className="font-semibold text-gray-800">{fmt(totalHT)}</span>
                </p>
                <p className="text-gray-500">
                  Taxe ({taxe}%) : <span className="font-semibold text-gray-800">{fmt(totalHT * taxe / 100)}</span>
                </p>
                <p className="text-base font-bold text-blue-600">
                  Total TTC : {fmt(totalTTC)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Erreur globale */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/commandes')}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading || loadingDonnees}>
            {loading ? 'Création en cours...' : 'Créer le document'}
          </Button>
        </div>

      </form>
    </div>
  )
}