import { createClient } from "@supabase/supabase-js";

// Client Supabase pour le rendu côté serveur (pages, sitemap).
// Clé anonyme uniquement : mêmes droits qu'un visiteur non connecté (RLS).
// Pas de session : rien n'est stocké côté serveur.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
