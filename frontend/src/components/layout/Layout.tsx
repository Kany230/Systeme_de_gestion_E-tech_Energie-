import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { authService, type UserProfil } from '../../services/auth.service'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<UserProfil | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    async function fetchUser() {
      try {
        const userData = await authService.me()
        if (isMounted) {
          setUser(userData)
        }
      } catch (err) {
        console.error('Erreur lors de la recuperation des infos utilisateur', err)
        if (isMounted) {
          localStorage.removeItem('auth_token')
          navigate('/login', { replace: true })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. On passe l'utilisateur à la Sidebar pour filtrer les menus selon son rôle */}
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* 2. On passe l'utilisateur dans le contexte de l'Outlet pour toutes les sous-pages */}
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  )
}