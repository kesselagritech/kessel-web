// app/api/nokash/tarifs/route.ts — Prix d'un document dans chaque monnaie + pays suggéré — [nokash v2]
// Lecture seule, sans authentification : ne renvoie que des prix publics.
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { grilleDePrix } from '@/lib/taux'
import { paysNokash } from '@/lib/nokashPays'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
  try {
    const documentId = new URL(request.url).searchParams.get('documentId') || ''
    if (!UUID_RE.test(documentId)) {
      return NextResponse.json({ error: 'documentId requis' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: doc } = await supabase
      .from('documents')
      .select('price, status')
      .eq('id', documentId)
      .maybeSingle()
    if (!doc || doc.status !== 'published') {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }

    const prix = await grilleDePrix(Number(doc.price))
    // Pays déduit de la connexion (Vercel) : simple pré-sélection, le client peut changer
    const suggere = paysNokash(request.headers.get('x-vercel-ip-country'))?.code ?? 'CM'

    return NextResponse.json(
      { prix, suggere },
      { headers: { 'Cache-Control': 'private, max-age=600' } }
    )
  } catch (err) {
    console.error('[NOKASH/tarifs] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
