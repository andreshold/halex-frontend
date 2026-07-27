// src/lib/profil.js
// Accès aux préférences utilisateur (table "profils" dans Supabase).
// Une ligne par utilisateur, créée automatiquement à l'inscription (trigger Supabase).
import { supabase } from '../supabaseClient.js'

const CLE_CACHE = 'halex_profil_cache'

// Lecture synchrone du cache local : utile pour un premier rendu instantané
// (ex. appliquer le thème avant même la réponse de Supabase). Pas de garantie de fraîcheur.
export function lireProfilCache() {
  try {
    const brut = localStorage.getItem(CLE_CACHE)
    return brut ? JSON.parse(brut) : null
  } catch {
    return null
  }
}

function ecrireProfilCache(profil) {
  try {
    localStorage.setItem(CLE_CACHE, JSON.stringify(profil))
  } catch {
    // stockage indisponible (navigation privée, quota...) : pas bloquant, on continue sans cache
  }
}

// Charge le profil de l'utilisateur connecté (RLS limite déjà le SELECT à sa propre ligne).
// Rafraîchit le cache local au passage.
export async function chargerProfil() {
  const { data, error } = await supabase
    .from('profils')
    .select('user_id, nom_affichage, mode_reponse, langue, theme, updated_at')
    .single()
  if (error) throw error
  ecrireProfilCache(data)
  return data
}

// Sauvegarde partielle du profil (un ou plusieurs champs, ex. { theme: 'sombre' }).
// Renvoie la ligne mise à jour et rafraîchit le cache local.
export async function sauvegarderProfil(modifs) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Utilisateur non connecté')

  const { data, error } = await supabase
    .from('profils')
    .update(modifs)
    .eq('user_id', user.id)
    .select('user_id, nom_affichage, mode_reponse, langue, theme, updated_at')
    .single()
  if (error) throw error
  ecrireProfilCache(data)
  return data
}
