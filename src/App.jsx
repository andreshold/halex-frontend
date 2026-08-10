import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ScrollProgress from './components/motion/ScrollProgress.jsx'
import Home from './pages/Home.jsx'
import Features from './pages/Features.jsx'
import Documents from './pages/Documents.jsx'
import Pricing from './pages/Pricing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ArticleOfDayPage from './pages/ArticleOfDayPage.jsx'
import Chat from './pages/Chat.jsx'
import Admin from './pages/Admin.jsx'
import ReinitialiserMotDePasse from './pages/ReinitialiserMotDePasse.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { recoveryMode } = useAuth()

  // recoveryMode doit être vérifié EN PREMIER, avant toute logique de route ou
  // de session utilisateur : le lien de réinitialisation établit une session
  // valide (l'utilisateur est techniquement "connecté"), donc sans cette
  // priorité explicite, ProtectedRoute laisserait passer directement vers
  // /halex-chat au lieu d'afficher l'écran de changement de mot de passe.
  // Le lien ramène sur window.location.origin (pas une route précise) : on
  // intercepte donc ici, avant les Routes, quelle que soit la page de retour.
  if (recoveryMode) {
    return (
      <>
        <ScrollProgress />
        <ReinitialiserMotDePasse />
      </>
    )
  }

  return (
    <>
      <ScrollProgress />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fonctionnalites" element={<Features />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/article-du-jour" element={<ArticleOfDayPage />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="/halex-chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}
