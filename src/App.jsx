import { Routes, Route } from 'react-router-dom'
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
import NotFound from './pages/NotFound.jsx'

export default function App() {
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
      </Routes>
    </>
  )
}
