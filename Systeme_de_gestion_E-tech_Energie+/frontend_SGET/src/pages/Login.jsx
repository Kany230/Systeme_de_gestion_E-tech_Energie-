import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Veuillez entrer email et mot de passe');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Échec de la connexion');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">E-tech Energie</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Gestion Intelligente</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Gérez votre énergie avec{' '}
              <span className="text-amber-500">intelligence</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Plateforme tout-en-un pour optimiser votre consommation et piloter vos installations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Efficacité', value: '+23%', subtitle: 'ce mois' },
              { title: 'Clients', value: '150+', subtitle: 'actifs' },
              { title: 'Documents', value: '1.2k', subtitle: 'générés' },
            ].map((stat) => (
              <div key={stat.title} className="p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                <p className="text-2xl font-bold text-amber-500">{stat.value}</p>
                <p className="text-sm font-medium text-white">{stat.title}</p>
                <p className="text-xs text-slate-400">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          © 2026 E-tech Energie. Tous droits réservés.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">E-tech Energie</h1>
              <p className="text-xs text-slate-500">Système de Gestion</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Bienvenue</h2>
              <p className="mt-1 text-sm text-slate-500">Connectez-vous pour accéder à votre espace</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-xs text-slate-500">
                Connexion sécurisée • E-tech Energie © 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
