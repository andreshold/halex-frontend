// supabase/functions/supprimer-compte/index.ts
// Supprime définitivement le compte de l'appelant : ses messages, ses conversations,
// son profil, puis son compte auth. Doit tourner côté serveur : c'est la seule façon
// d'utiliser la clé service_role sans l'exposer au frontend.
//
// SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY sont injectées
// automatiquement par la plateforme Supabase dans l'environnement de la fonction.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function reponseJson(corps: unknown, status = 200) {
  return new Response(JSON.stringify(corps), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  // Le preflight CORS ne porte jamais l'en-tête Authorization (comportement standard
  // des navigateurs) : il doit donc être traité avant toute vérification d'identité.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return reponseJson({ error: 'Session manquante' }, 401)
  }
  const token = authHeader.replace('Bearer ', '')

  // Vérification d'identité avec la clé anon : confirme qui appelle, sans droits élevés.
  const supabaseAnon = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  )
  const { data: userData, error: errorUser } = await supabaseAnon.auth.getUser(token)
  if (errorUser || !userData?.user) {
    return reponseJson({ error: 'Session invalide' }, 401)
  }
  const userId = userData.user.id

  // Suppression effective : client admin (service_role), instancié seulement maintenant.
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: conversations, error: errorConversations } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('user_id', userId)
  if (errorConversations) return reponseJson({ error: errorConversations.message }, 500)

  const idsConversations = (conversations ?? []).map((c) => c.id)
  if (idsConversations.length > 0) {
    const { error: errorMessages } = await supabaseAdmin
      .from('messages')
      .delete()
      .in('conversation_id', idsConversations)
    if (errorMessages) return reponseJson({ error: errorMessages.message }, 500)

    const { error: errorDeleteConversations } = await supabaseAdmin
      .from('conversations')
      .delete()
      .eq('user_id', userId)
    if (errorDeleteConversations) return reponseJson({ error: errorDeleteConversations.message }, 500)
  }

  const { error: errorProfil } = await supabaseAdmin.from('profils').delete().eq('user_id', userId)
  if (errorProfil) return reponseJson({ error: errorProfil.message }, 500)

  const { error: errorDeleteUser } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (errorDeleteUser) return reponseJson({ error: errorDeleteUser.message }, 500)

  return reponseJson({ succes: true })
})
