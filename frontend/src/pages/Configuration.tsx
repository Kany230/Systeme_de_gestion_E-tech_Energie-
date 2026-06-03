import { useState, useRef, useEffect } from 'react'
import { authService } from '../services/auth.service'
import type { UserProfil } from '../services/auth.service'
import type { ConfigurationUpdateData } from '../hooks/useConfiguration'
import { useConfiguration } from '../hooks/useConfiguration'

// ---- Types ----
export interface Configuration {
  id: number
  nomSociete: string
  ninea: string
  email: string
  contact: string
  phraseLegale: string
  logo?: string | null
}

interface ProfilForm {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface ConfigForm {
  nomSociete: string
  ninea: string
  rib: string
  phraseLegale: string
  logo: File | null
}

// ---- Composant modal générique ----
function Modal({
  open,
  titre,
  onClose,
  onSubmit,
  saving,
  children,
}: {
  open: boolean
  titre: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800">{titre}</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="px-5 py-4 flex flex-col gap-4">
            {children}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---- Champ de formulaire ----
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-shadow'

// ---- Ligne d'info ----
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-700 text-right max-w-[60%] truncate">
        {value || '—'}
      </span>
    </div>
  )
}

// ---- Initiales avatar ----
function initiales(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

// ================================================================
// Page principale
// ================================================================
export default function Parametres() {
  const { configuration, loading: loadingConfig, saving: savingConfig, modifier } = useConfiguration() as {
    configuration: Configuration | null
    loading: boolean
    saving: boolean
    modifier: (data: ConfigurationUpdateData) => Promise<boolean>
  }

  const [profil, setProfil] = useState<UserProfil | null>(null)
  const [loadingProfil, setLoadingProfil] = useState(true)
  const [savingProfil, setSavingProfil] = useState(false)

  const [modalProfil, setModalProfil] = useState(false)
  const [modalConfig, setModalConfig] = useState(false)

  const [erreurProfil, setErreurProfil] = useState<string | null>(null)
  const [erreurConfig, setErreurConfig] = useState<string | null>(null)
  const [succesProfil, setSuccesProfil] = useState(false)
  const [succesConfig, setSuccesConfig] = useState(false)

  const [profilForm, setProfilForm] = useState<ProfilForm>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [configForm, setConfigForm] = useState<ConfigForm>({
    nomSociete: '',
    ninea: '',
    rib: '',
    phraseLegale: '',
    logo: null,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger le profil
  useEffect(() => {
    authService.me()
      .then(data => { setProfil(data); setLoadingProfil(false) })
      .catch(() => setLoadingProfil(false))
  }, [])

  // Fonctions de réinitialisation des formulaires (Anti-pollution UX)
  const resetProfilForm = () => {
    if (profil) {
      setProfilForm({
        name: profil.name,
        email: profil.email,
        password: '',
        password_confirmation: '',
      })
    }
    setErreurProfil(null)
  }

  const resetConfigForm = () => {
    if (configuration) {
      setConfigForm({
        nomSociete: configuration.nomSociete ?? '',
        ninea: configuration.ninea ?? '',
        phraseLegale: configuration.phraseLegale ?? '',
        rib: '',
        logo: null,
      })
      setLogoPreview(configuration.logo || null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
    setErreurConfig(null)
  }

  // Synchronisation initiale des formulaires
  useEffect(() => { resetProfilForm() }, [profil])
  useEffect(() => { resetConfigForm() }, [configuration])

  // Nettoyage global de l'objectURL pour éviter les fuites de mémoire (Memory Leaks)
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  // ---- Handlers profil ----
  const handleProfilChamp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfilForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSauverProfil = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation locale des mots de passe
    if (profilForm.password && profilForm.password !== profilForm.password_confirmation) {
      setErreurProfil('Les mots de passe ne correspondent pas')
      return
    }

    try {
      setSavingProfil(true)
      setErreurProfil(null)

      // Construction dynamique du payload pour éviter de polluer Laravel avec des chaînes vides
      const payload: any = {
        name: profilForm.name,
        email: profilForm.email,
      }

      if (profilForm.password.trim() !== '') {
        payload.password = profilForm.password
        payload.password_confirmation = profilForm.password_confirmation
      }

      // 1. Envoi et mise à jour via l'API Laravel
      const profilMisAJour = await authService.updateProfil(payload)
      
      // 2. Mise à jour de l'état local pour rafraîchir l'interface (avatar, nom, etc.)
      setProfil(profilMisAJour)

      setSuccesProfil(true)
      setModalProfil(false)
      setTimeout(() => setSuccesProfil(false), 3000)
    } catch (err: any) {
      setErreurProfil(err?.response?.data?.message ?? 'Erreur lors de la sauvegarde')
    } finally {
      setSavingProfil(false)
    }
  }

  // ---- Handlers config ----
  const handleConfigChamp = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfigForm(prev => ({ ...prev, [name]: value }))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Nettoyer l'ancienne URL d'aperçu blob pour libérer de la mémoire avant de générer la nouvelle
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview)
    }

    setConfigForm(prev => ({ ...prev, logo: file }))
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSupprimerLogo = () => {
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview)
    }
    setConfigForm(prev => ({ ...prev, logo: null }))
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSauverConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreurConfig(null)

    const data: ConfigurationUpdateData = {
      nomSociete: configForm.nomSociete,
      ninea: configForm.ninea,
      phraseLegale: configForm.phraseLegale,
      ...(configForm.logo ? { logo: configForm.logo } : {}),
    }

    const ok = await modifier(data)
    if (ok) {
      setSuccesConfig(true)
      setModalConfig(false)
      setTimeout(() => setSuccesConfig(false), 3000)
    } else {
      setErreurConfig('Erreur lors de la sauvegarde')
    }
  }

  if (loadingProfil || loadingConfig) {
    return <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Chargement des paramètres...</div>
  }

  const roleLabel = profil?.role === 'admin' ? 'Administrateur' : 'Secrétaire'

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-sm text-gray-400 mt-1">
          Votre profil et la configuration de l'entreprise
        </p>
      </div>

      {/* Bandeaux succès */}
      {succesProfil && (
        <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm">
          ✓ Profil mis à jour avec succès
        </div>
      )}
      {succesConfig && (
        <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm">
          ✓ Configuration sauvegardée avec succès
        </div>
      )}

      {/* Grille deux colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ---- Carte profil ---- */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-gray-700">Mon profil</p>
            <button
              onClick={() => { resetProfilForm(); setModalProfil(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              ✎ Modifier
            </button>
          </div>

          <div className="flex items-center gap-4 pb-5 mb-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-700 text-base flex-shrink-0 shadow-sm">
              {profil?.name ? initiales(profil.name) : '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-base">{profil?.name}</p>
              <span className="inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                {profil?.role}
              </span>
            </div>
          </div>

          <InfoRow label="Email" value={profil?.email} />
          <InfoRow label="Rôle" value={roleLabel} />
        </div>

        {/* ---- Carte configuration ---- */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-gray-700">Entreprise</p>
            <button
              onClick={() => { resetConfigForm(); setModalConfig(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              ✎ Modifier
            </button>
          </div>

          <div className="flex items-center gap-4 pb-5 mb-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl text-gray-300">🏢</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-base">
                {configuration?.nomSociete || '—'}
              </p>
              <p className="text-xs font-medium text-gray-400 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">
                NINEA : {configuration?.ninea || '—'}
              </p>
            </div>
          </div>

          <InfoRow label="Email Entreprise" value={configuration?.email} />
          <InfoRow label="Contact" value={configuration?.contact} />
          <InfoRow label="Phrase légale" value={configuration?.phraseLegale} />
        </div>
      </div>

      {/* ---- Modal profil ---- */}
      <Modal
        open={modalProfil}
        titre="Modifier mon profil"
        onClose={resetProfilForm}
        onSubmit={handleSauverProfil}
        saving={savingProfil}
      >
        {erreurProfil && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg font-medium">{erreurProfil}</p>
        )}
        <Field label="Nom complet">
          <input
            className={inputClass}
            type="text"
            name="name"
            value={profilForm.name}
            onChange={handleProfilChamp}
            required
          />
        </Field>
        <Field label="Email">
          <input
            className={inputClass}
            type="email"
            name="email"
            value={profilForm.email}
            onChange={handleProfilChamp}
            required
          />
        </Field>
        <Field label="Nouveau mot de passe (laisser vide pour ne pas changer)">
          <input
            className={inputClass}
            type="password"
            name="password"
            value={profilForm.password}
            onChange={handleProfilChamp}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Confirmer le mot de passe">
          <input
            className={inputClass}
            type="password"
            name="password_confirmation"
            value={profilForm.password_confirmation}
            onChange={handleProfilChamp}
            placeholder="••••••••"
          />
        </Field>
      </Modal>

      {/* ---- Modal config ---- */}
      <Modal
        open={modalConfig}
        titre="Modifier la configuration"
        onClose={resetConfigForm}
        onSubmit={handleSauverConfig}
        saving={savingConfig}
      >
        {erreurConfig && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg font-medium">{erreurConfig}</p>
        )}

        {/* Logo */}
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="w-16 h-16 rounded-lg border border-dashed border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-300 text-2xl">🏢</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogo}
              className="hidden"
              id="logo-modal-input"
            />
            <label
              htmlFor="logo-modal-input"
              className="inline-block cursor-pointer text-center px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white hover:bg-gray-50 shadow-sm transition-colors"
            >
              {logoPreview ? 'Changer le logo' : 'Choisir un logo'}
            </label>
            {logoPreview && (
              <button
                type="button"
                onClick={handleSupprimerLogo}
                className="text-xs font-medium text-red-500 text-left hover:text-red-700 transition-colors mt-0.5 pl-1"
              >
                Supprimer
              </button>
            )}
            <p className="text-[10px] text-gray-400 pl-1 mt-0.5">PNG, JPG — max 2 Mo</p>
          </div>
        </div>

        <Field label="Nom de la société">
          <input
            className={inputClass}
            type="text"
            name="nomSociete"
            value={configForm.nomSociete}
            onChange={handleConfigChamp}
            required
          />
        </Field>

        <Field label="NINEA">
          <input
            className={inputClass}
            type="text"
            name="ninea"
            value={configForm.ninea}
            onChange={handleConfigChamp}
          />
        </Field>

        <Field label="Phrase légale">
          <textarea
            className={inputClass}
            name="phraseLegale"
            value={configForm.phraseLegale}
            onChange={handleConfigChamp}
            rows={3}
            style={{ resize: 'none' }}
          />
        </Field>
      </Modal>
    </div>
  )
}