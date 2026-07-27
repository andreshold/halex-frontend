// src/supabaseClient.js
// Point de connexion unique du frontend vers Supabase.
// Toute l'app importe ce client — une seule source de vérité.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TEST TEMPORAIRE — à retirer après vérification
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Supabase OK — session :', data.session, '| erreur :', error)
})