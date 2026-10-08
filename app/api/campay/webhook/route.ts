// app/api/campay/webhook/route.ts — Notification CamPay — [campay-live v1]
//
// SÉCURITÉ : ce qu'envoie le webhook n'est qu'une SONNETTE. On n'en croit pas un mot :
// on lit seulement « quel achat » (external_reference) et « quelle transaction »
// (reference), puis confirmPurchase() redemande l'état réel à CamPay avec notre jeton
// et vérifie statut + référence + montant. Un faux webhook ne peut donc rien débloquer.
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { confirmPurchase } from '@/lib/campay'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}

async function handle(request: NextRequest) {
  try {
    // 1. Rassembler les paramètres (query GET, corps JSON ou form-urlencoded en POST)
    const params: Record<string, string> = {}
    new URL(request.url).searchParams.forEach((v, k) => {
      params[k] = v
    })
    if (request.method === 'POST') {
      try {
        const text = await request.text()
        if (text.trim().startsWith('{')) {
          const json = JSON.parse(text) as Record<string, unknown>
          for (const [k, v] of Object.entries(json)) if (v != null) params[k] = String(v)
        } else {
          new URLSearchParams(text).forEach((v, k) => {
            params[k] = v
          })
        }
      } catch {
        // corps vide / illisible → on garde les query params
      }
    }

    const purchaseId = params['external_reference'] || ''
    const reference = params['reference'] || null

    if (!UUID_RE.test(purchaseId)) {
      console.warn('[CAMPAY/webhook] external_reference absent ou invalide')
      return NextResponse.json({ received: true })
    }

    // 2. Vérification auprès de CamPay (seule source de vérité)
    const supabase = createServiceClient()
    const result = await confirmPurchase(supabase, purchaseId, reference)
    console.log(`[CAMPAY/webhook] ${purchaseId} → ${result}`)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[CAMPAY/webhook] Erreur:', err)
    // 200 pour éviter les relances en boucle ; le polling de la fiche prend le relais
    return NextResponse.json({ received: true })
  }
}
