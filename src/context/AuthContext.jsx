import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const AuthContext = createContext(null)

const MODES_VALIDES = ['citoyen', 'educatif', 'judiciaire']

// Transforme l'utilisateur Supabase en objet attendu par l'UI (user.name, user.email)
function toUiUser(supabaseUser) {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata || {}
  const fullName = [meta.prenom, meta.nom].filter(Boolean).join(' ')
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    // Source de vérité unique pour le nom affiché : user_metadata.display_name.
    // Replis : nom complet du formulaire d'inscription, puis partie locale de l'email.
    name: meta.display_name || fullName || meta.name || supabaseUser.email?.split('@')[0] || 'Utilisateur',
    provider: supabaseUser.app_metadata?.provider || 'email',
    // Source de vérité unique du mode de réponse, partagée par la modale Paramètres
    // et la zone de saisie du chat. Repli sur 'citoyen' si absent ou invalide.
    modeReponse: MODES_VALIDES.includes(meta.mode_reponse) ? meta.mode_reponse : 'citoyen',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  // Filet de sécurité contre la race condition : l'événement PASSWORD_RECOVERY
  // arrive de façon asynchrone (traitement interne du hash par supabase-js), donc
  // le tout premier rendu peut avoir lieu avant qu'il ne soit reçu. Le hash, lui,
  // est disponible de façon synchrone dès le tout premier rendu.
  const [recoveryMode, setRecoveryMode] = useState(
    () => window.location.hash.includes('type=recovery'),
  )

  useEffect(() => {
    console.log('URL au montage :', window.location.href)
    console.log('Mode récupération détecté via le hash au montage :', recoveryMode)

    // 1. Au chargement : récupérer la session existante (si l'utilisateur était déjà connecté)
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUiUser(data.session?.user))
      setReady(true)
    })

    // 2. Écouter les changements (connexion, déconnexion, expiration…)
    //    L'UI se met à jour toute seule, quel que soit l'endroit d'où vient le changement.
   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Log temporaire (demandé) : trace tous les événements auth reçus.
      console.log('AUTH EVENT :', _event, '| user :', session?.user?.email ?? 'aucun')
      // Émis par Supabase quand l'utilisateur revient via le lien de réinitialisation
      // reçu par email : une session temporaire est déjà active à ce stade.
      if (_event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true)
      }
      setUser(toUiUser(session?.user))
      setReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signup({ prenom, nom, email, password, typeActivite }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          prenom,
          nom,
          type_activite: typeActivite,
          // Initialise la source de vérité du nom affiché dès l'inscription,
          // pour ne pas dépendre d'une visite ultérieure dans les Paramètres.
          display_name: [prenom, nom].filter(Boolean).join(' '),
        },
      }, // copiées vers `profils` par le trigger Supabase
    })
    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        throw new Error('EMAIL_EXISTS')
      }
      throw new Error(error.message)
    }
    return toUiUser(data.user)
  }

  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error('INVALID_CREDENTIALS')
    }
    return toUiUser(data.user)
  }

  function loginAsGuestDemo() {
    // Mode démo : reste local et factice, volontairement (pas de compte réel créé).
    const session = { name: 'Sitwayen Demo', email: 'demo@halex.ai', isDemo: true }
    setUser(session)
    return session
  }

  async function loginWithGoogle() {
    // Redirige vers Google, puis revient sur l'app une fois connecté.
    // Nécessite l'activation du fournisseur Google dans Supabase (prochaine étape).
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/halex-chat` },
    })
    if (error) throw new Error(error.message)
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function demanderReinitialisationMotDePasse(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) throw new Error(error.message)
  }

  async function mettreAJourNomAffichage(displayName) {
    const { data, error } = await supabase.auth.updateUser({ data: { display_name: displayName } })
    if (error) throw new Error(error.message)
    // Mise à jour immédiate du contexte avec la réponse : l'UI se rafraîchit sans
    // attendre l'événement USER_UPDATED (l'écouteur onAuthStateChange le fera aussi,
    // de façon redondante mais sans effet néfaste, si/quand il arrive).
    setUser(toUiUser(data.user))
  }

  async function mettreAJourModeReponse(mode) {
    const { data, error } = await supabase.auth.updateUser({ data: { mode_reponse: mode } })
    if (error) throw new Error(error.message)
    setUser(toUiUser(data.user))
  }

  async function definirNouveauMotDePasse(password) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(error.message)
    setRecoveryMode(false)
    // Retire le hash de récupération de l'URL pour ne pas redéclencher le mode
    // récupération (via le filet de sécurité ci-dessus) à un futur rechargement.
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        signup,
        login,
        logout,
        loginAsGuestDemo,
        loginWithGoogle,
        mettreAJourNomAffichage,
        mettreAJourModeReponse,
        recoveryMode,
        demanderReinitialisationMotDePasse,
        definirNouveauMotDePasse,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}