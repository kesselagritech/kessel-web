// app/api/nokash/webhook/route.ts — Notification NOKASH (callback_url, clés de production) — [nokash v1]
//
// SÉCURITÉ : ce qu'envoie NOKASH n'est qu'une SONNETTE. On n'en croit pas un mot : on y lit
// seulement « quel achat » (orderId = notre purchase.id) et « quelle transaction » (id), puis
// confirmNokashPurchase() redemande l'état réel à NOKASH et vérifie statut + id + orderId +
// montant. Un faux callback ne peut donc rien débloquer (la signature hmac-signature devient
// superflue).
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { confirmNokashPurchase } from '@/lib/nokash'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function lire(body: Record<string, unknown>, keys: string[]): string | null {
  const layers: Record<string, unknown>[] = [body]
  const data = body['data']
  if (data && typeof data === 'object') layers.push(data as Record<string, unknown>)
  for (const layer of layers) {
    for (const k of keys) {
      const v = layer[k]
      if ((typeof v === 'string' || typeof v === 'number') && String(v).trim()) return String(v).trim()
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {}
    try {
      const text = await request.text()
      if (text.trim().startsWith('{')) {
        body = JSON.parse(text) as Record<string, unknown>
      } else {
        new URLSearchParams(text).forEach((v, k) => {
          body[k] = v
        })
      }
    } catch {
      // corps vide / illisible
    }

    const orderId = lire(body, ['orderId', 'order_id'])
    const txId = lire(body, ['id', 'transaction_id'])

    if (!orderId || !UUID_RE.test(orderId)) {
      console.warn('[NOKASH/webhook] orderId absent ou invalide')
      return NextResponse.json({ received: true })
    }

    // Vérification auprès de NOKASH (seule source de vérité)
    const supabase = createServiceClient()
    const result = await confirmNokashPurchase(supabase, orderId, txId)
    console.log(`[NOKASH/webhook] ${orderId} → ${result}`)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[NOKASH/webhook] Erreur:', err)
    // 200 pour éviter les relances en boucle ; le polling de la fiche prend le relais
    return NextResponse.json({ received: true })
  }
}
