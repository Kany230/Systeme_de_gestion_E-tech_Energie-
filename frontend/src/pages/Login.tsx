import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { authService } from '../services'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Récupération de l'email enregistré si "Se souvenir de moi" était coché
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      localStorage.setItem('auth_token', response.token)

      if (rememberMe) {
        localStorage.setItem('remembered_email', email)
      } else {
        localStorage.removeItem('remembered_email')
      }

      navigate('/dashboard')
    } catch (err: any) {
      // ✅ Optional chaining — plus concis et cohérent avec le reste du projet
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Email ou mot de passe incorrect.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">E-Tech Energie</h1>
          <p className="text-gray-600">Système de Gestion Commerciale</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={loading} // ✅ Ajouté
          />

          <Input
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading} // ✅ Ajouté
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                disabled={loading} // ✅ Ajouté
              />
              <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>

            <Link to="/oublierpwd" className="text-sm text-blue-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Card>
    </div>
  )
}