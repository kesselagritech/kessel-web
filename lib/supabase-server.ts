// lib/supabase-server.ts — Client Supabase avec clé service (serveur uniquement)
// ⚠️ Ne JAMAIS importer ce fichier côté client

import { createClient } from '@supabase/supabase-js'

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Variables Supabase serveur manquantes (URL ou SERVICE_ROLE_KEY)')
  }

  return createClient(url, key)
}

/** Extrait et vérifie le user depuis le header Authorization */
export async function getUserFromRequest(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null

  const supabase = createServiceClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) return null
  return user
}
