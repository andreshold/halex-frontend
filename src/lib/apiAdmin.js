// src/lib/apiAdmin.js
// Appels au panneau d'administration (validation/insertion de documents juridiques).
// Toutes les requêtes portent le token de session Supabase en Bearer.

import { supabase } from '../supabaseClient.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function getToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

// Uniformise la réponse : le code HTTP est renvoyé au même titre que le corps,
// car un 409 porte un rapport de validation exploitable (champ "detail"),
// pas une simple panne à afficher comme telle.
async function lireReponse(res) {
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  return { ok: res.ok, status: res.status, data }
}

export async function verifierAccesAdmin() {
  const token = await getToken()
  const res = await fetch(`${API_URL}/admin/ping`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
  return lireReponse(res)
}

export async function validerFichier(file) {
  const token = await getToken()
  const formData = new FormData()
  formData.append('fichier', file)
  const res = await fetch(`${API_URL}/admin/validation`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return lireReponse(res)
}

export async function insererFichier(file) {
  const token = await getToken()
  const formData = new FormData()
  formData.append('fichier', file)
  const res = await fetch(`${API_URL}/admin/insertion`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return lireReponse(res)
}
