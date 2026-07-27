// src/lib/historique.js
// Accès aux données de l'historique des conversations (table "conversations" dans Supabase).
// Chaque conversation appartient à un utilisateur (user_id) et stocke ses messages en jsonb.
import { supabase } from '../supabaseClient.js'

// Crée une conversation et renvoie son id
export async function creerConversation(userId, premiereQuestion) {
  const titre = premiereQuestion.slice(0, 60) // les 60 premiers caractères comme titre
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, titre })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

// Enregistre un message (role : 'user' ou 'assistant')
// sources : liste des articles cités (uniquement pertinent pour role='assistant')
// Renvoie { id, created_at } du message inséré, nécessaire pour pouvoir l'éditer/tronquer plus tard.
export async function enregistrerMessage(conversationId, role, contenu, sources = []) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, contenu, sources })
    .select('id, created_at')
    .single()
  if (error) throw error
  return data
}

// Modifie un message déjà envoyé : supprime tous les messages de la conversation
// postérieurs à `createdAt` (troncature), puis met à jour le contenu du message ciblé.
// Ordre impératif : suppression avant mise à jour, pour ne jamais laisser un message
// modifié suivi de réponses qui répondaient à son ancien contenu.
export async function modifierMessage(conversationId, messageId, nouveauContenu, createdAt) {
  const { error: errorSuppression } = await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId)
    .gt('created_at', createdAt)
  if (errorSuppression) throw errorSuppression

  const { error: errorMiseAJour } = await supabase
    .from('messages')
    .update({ contenu: nouveauContenu })
    .eq('id', messageId)
  if (errorMiseAJour) throw errorMiseAJour
}

// Remplace le contenu (et les sources) d'une réponse IA existante, sans toucher aux autres
// messages de la conversation. Simple UPDATE — aucune suppression, contrairement à
// modifierMessage qui gère la troncature lors de l'édition d'une question.
export async function regenererReponse(messageId, nouveauContenu, sources = []) {
  const { error } = await supabase
    .from('messages')
    .update({ contenu: nouveauContenu, sources })
    .eq('id', messageId)
  if (error) throw error
}

// Liste les conversations de l'utilisateur (les plus récentes d'abord)
export async function listerConversations() {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, titre, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Efface tout l'historique de l'utilisateur (toutes ses conversations et leurs messages).
// Ordre impératif : messages avant conversations, pour ne pas dépendre d'un ON DELETE
// CASCADE qui n'est pas garanti sur la contrainte conversation_id.
export async function supprimerToutHistorique(userId) {
  const conversations = await listerConversations()
  const ids = conversations.map((c) => c.id)
  if (ids.length === 0) return

  const { error: errorMessages } = await supabase
    .from('messages')
    .delete()
    .in('conversation_id', ids)
  if (errorMessages) throw errorMessages

  const { error: errorConversations } = await supabase
    .from('conversations')
    .delete()
    .eq('user_id', userId)
  if (errorConversations) throw errorConversations
}

// Charge tous les messages d'une conversation
export async function chargerMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, contenu, sources, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error
  // Rétrocompatibilité : anciens messages sans sources -> []
  return data.map((m) => ({ ...m, sources: m.sources ?? [] }))
}