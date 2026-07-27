import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  // Jeton OAuth encore présent dans l'URL : Supabase est en train d'établir
  // la session. On ATTEND au lieu de rediriger (sinon on efface le jeton).
const params = new URLSearchParams(window.location.search)
  const tokenEnCours =
    window.location.hash.includes('access_token') ||
    (params.has('code') && !params.has('error'))

  if (!ready || (!user && tokenEnCours)) {
    return (
      <div className="flex h-dvh items-center justify-center bg-cream-50">
        <p className="text-sm text-navy-700/50">Connexion en cours…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />
  }

  return children
}