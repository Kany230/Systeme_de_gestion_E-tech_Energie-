import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { authService } from '../services'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Envoi de l'email au backend pour générer le token de réinitialisation
      const response = await authService.passwordOublier({ email })
      setMessage(response.message || 'Un e-mail de réinitialisation vous a été envoyé.')
    } catch (err: any) {
      if (err.response?.data?.erreur?.email) {
        // Gère les erreurs de validation spécifiques à Laravel
        setError(err.response.data.erreur.email?.[0])
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-100">
        {/* Ajout d'un conteneur avec un padding homogène (p-6 ou p-8) */}
        <div className="p-6 sm:p-8">
          
          {/* En-tête */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-blue-600 mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Entrez votre adresse email pour recevoir un lien de réinitialisation de votre mot de passe.
            </p>
          </div>

          {message ? (
            /* État de succès */
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-medium">
                <span className="block text-base mb-1">📬</span>
                {message}
              </div>
              <Link 
                to="/login" 
                className="inline-block text-blue-600 font-semibold hover:text-blue-700 hover:underline text-sm transition-colors"
              >
                Retour à la page de connexion
              </Link>
            </div>
          ) : (
            /* Formulaire de saisie */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  label="Adresse Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoFocus // Focus automatique pour une meilleure UX
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-2.5 shadow-sm font-semibold text-sm" 
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </Button>

              <div className="text-center pt-2">
                <Link 
                  to="/login" 
                  className="text-xs font-semibold text-gray-400 hover:text-blue-600 hover:underline transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}

        </div>
      </Card>
    </div>
  )
}