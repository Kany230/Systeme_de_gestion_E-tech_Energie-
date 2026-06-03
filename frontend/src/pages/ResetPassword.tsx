import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { authService } from '../services/auth.service'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  // Validation des paramètres URL
  useEffect(() => {
    if (!token || !email) {
      setError("Le lien de réinitialisation est invalide ou incomplet. Veuillez refaire une demande.")
    }
  }, [token, email])

  // Redirection avec cleanup
  useEffect(() => {
    if (!successMessage) return

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      navigate('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [successMessage, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    try {
      const response = await authService.reinitialiserPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      })

      setSuccessMessage(response.message)

    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.erreur?.password) {
        setError(err.response.data.erreur.password[0])
      } else {
        setError('Une erreur est survenue lors du changement de mot de passe.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Nouveau mot de passe</h1>
          <p className="text-sm text-gray-600">Saisissez votre nouveau mot de passe sécurisé.</p>
        </div>

        {successMessage ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
            {successMessage}
            <div className="mt-2 text-xs text-green-600 animate-pulse">
              Redirection vers la page de connexion...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Email associé</label>
              <input
                type="text"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed text-sm"
              />
            </div>

            <Input
              type="password"
              label="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              required
              disabled={!token || !email || loading}
            />

            <Input
              type="password"
              label="Confirmer le nouveau mot de passe"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              required
              disabled={!token || !email || loading}
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !token || !email}
            >
              {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}