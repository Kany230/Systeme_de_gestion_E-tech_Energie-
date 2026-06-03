import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/layout/Layout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Configuration from '../pages/Configuration'
import Clients from '../pages/Clients'
import Commandes from '../pages/Commandes'
import ResetPassword from '../pages/ResetPassword'
import ForgotPassword from '../pages/ForgotPassword'
import Catalogue from '../pages/Catalogue'
import DocumentDetail from '../pages/DocumentDetail'
import Action from '../pages/Action'
import Events from '../pages/Events'
import RapportClients from '../pages/RapportClients'
import NouveauDocument from '../pages/NouveauDocument'
import GestionUtilisateurs from '../pages/GestionUtilisateurs'

// --- Composants de Protection ---

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null // Ou un loader global
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center">Vérification...</div>
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />
}

// --- Router Principal ---

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/oublierpwd" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Routes Protégées (Admin + Secrétaire) */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Catalogue */}
          <Route path="catalogue">
            <Route index element={<Navigate to="produits" replace />} />
            <Route path="produits" element={<Catalogue section="produits" />} />
            <Route path="categories" element={<AdminRoute><Catalogue section="categories" /></AdminRoute>} />
            <Route path="action" element={<AdminRoute><Catalogue section="action" /></AdminRoute>} />
          </Route>

          {/* Clients & Commandes */}
          <Route path="clients" element={<Clients />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="commandes/nouveau" element={<NouveauDocument />} />
          <Route path="commandes/:id" element={<DocumentDetail />} />

          {/* Admin Uniquement */}
          <Route path="users" element={<AdminRoute><GestionUtilisateurs /></AdminRoute>} />
          <Route path="rapports/clients" element={<AdminRoute><RapportClients /></AdminRoute>} />
          <Route path="rapports/stock" element={<AdminRoute><Action /></AdminRoute>} />
          <Route path="rapports/ventes" element={<AdminRoute><Events /></AdminRoute>} />
          <Route path="parametres" element={<AdminRoute><Configuration /></AdminRoute>} />

          {/* Catch-all pour les routes non trouvées sous Layout */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Fallback Global */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}