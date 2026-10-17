// app/api/camerpay/webhook/route.ts — Notification CamerPay (carte) — [camerpay-carte v1]
//
// SÉCURITÉ : ce qu'envoie le webhook n'est qu'une SONNETTE. On n'en croit pas un mot :
// on y lit seulement « quel achat » (merchant_invoice_id) et « quelle transaction » (uuid),
// puis confirmCardPurchase() redemande l'état réel à CamerPay avec notre jeton et vérifie
// statut + uuid + montant + mode. Un faux webhook ne peut donc rien débloquer.
// (CamerPay signe aussi ses webhooks en HMAC-SHA256 ; cette double vérification la rend superflue.)
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { confirmCardPurchase } from '@/lib/camerpay'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Cherche une valeur à plat, puis sous « transaction », « data » ou « data.transaction ». */
function pick(body: Record<string, unknown>, keys: string[]): string | null {
  const layers: Record<string, unknown>[] = [body]
  for (const k of ['transaction', 'data']) {
    const v = body[k]
    if (v && typeof v === 'object') layers.push(v as Record<string, unknown>)
  }
  const data = body['data']
  if (data && typeof data === 'object') {
    const t = (data as Record<string, unknown>)['transaction']
    if (t && typeof t === 'object') layers.push(t as Record<string, unknown>)
  }
  for (const layer of layers) {
    for (const k of keys) {
      const v = layer[k]
      if (typeof v === 'string' && v.trim()) return v.trim()
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

    const invoiceId = pick(body, ['merchant_invoice_id'])
    const txUuid = pick(body, ['transaction_uuid', 'uuid'])
    const hintUuid = txUuid && UUID_RE.test(txUuid) ? txUuid : null

    const supabase = createServiceClient()

    // Retrouver l'achat : par notre purchase.id, sinon par l'uuid CamerPay mémorisé
    let purchaseId: string | null = invoiceId && UUID_RE.test(invoiceId) ? invoiceId : null
    if (!purchaseId && hintUuid) {
      const { data } = await supabase
        .from('document_purchases')
        .select('id')
        .eq('payment_method', 'camerpay')
        .eq('payment_ref', hintUuid)
        .maybeSingle()
      purchaseId = data?.id ?? null
    }
    if (!purchaseId) {
      console.warn('[CAMERPAY/webhook] achat introuvable dans la notification')
      return NextResponse.json({ received: true })
    }

    // Vérification auprès de CamerPay (seule source de vérité), y compris remboursement après coup
    const result = await confirmCardPurchase(supabase, purchaseId, { hintUuid, recheckCompleted: true })
    console.log(`[CAMERPAY/webhook] ${purchaseId} → ${result}`)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[CAMERPAY/webhook] Erreur:', err)
    // 200 pour éviter les relances en boucle ; le polling de la fiche prend le relais
    return NextResponse.json({ received: true })
  }
}
