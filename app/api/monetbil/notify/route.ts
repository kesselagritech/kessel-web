// app/api/monetbil/notify/route.ts — Notification de paiement Monetbil (webhook) — [monetbil-backend v1]
//
// SÉCURITÉ : on vérifie la SIGNATURE (le « sceau ») AVANT toute chose. Fail-closed.
// Sans cette vérification, n'importe qui connaissant l'URL pourrait débloquer un
// document gratuitement en simulant un « paiement réussi ».
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { verifyNotificationSign } from '@/lib/monetbil'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  return handleNotify(request)
}

// Monetbil peut notifier en GET ou en POST selon la configuration du service.
export async function GET(request: NextRequest) {
  return handleNotify(request)
}

async function handleNotify(request: NextRequest) {
  try {
    // 1. Rassembler TOUS les paramètres reçus (query GET et/ou corps POST form-urlencoded).
    //    La signature se recalcule sur l'ensemble des champs, il faut donc tout collecter.
    const params: Record<string, string> = {}
    const url = new URL(request.url)
    url.searchParams.forEach((v, k) => {
      params[k] = v
    })

    if (request.method === 'POST') {
      try {
        const text = await request.text()
        new URLSearchParams(text).forEach((v, k) => {
          params[k] = v
        })
      } catch {
        // corps vide ou non form-urlencoded → on garde les query params
      }
    }

    // 2. VÉRIFIER LE SCEAU. Signature invalide → 403, on ne débloque rien.
    if (!verifyNotificationSign(params)) {
      console.warn('[MONETBIL/notify] Signature invalide — rejet')
      return NextResponse.json({ error: 'Signature invalide' }, { status: 403 })
    }

    // 3. Clé de rapprochement = payment_ref (= notre purchase.id renvoyé par Monetbil).
    const purchaseId = params['payment_ref']
    const status = (params['status'] || '').toLowerCase() // « success » | « failed » | « cancelled »
    if (!purchaseId) {
      console.warn('[MONETBIL/notify] payment_ref absent — impossible de matcher')
      return NextResponse.json({ received: true })
    }

    // 4. Débloquer UNIQUEMENT si succès. Idempotent : la garde payment_status='pending'
    //    fait qu'une 2ᵉ notification identique ne touche plus rien.
    const supabase = createServiceClient()
    const newStatus = status === 'success' ? 'completed' : 'failed'

    const { error } = await supabase
      .from('document_purchases')
      .update({ payment_status: newStatus })
      .eq('id', purchaseId)
      .eq('payment_status', 'pending')

    if (error) {
      console.error('[MONETBIL/notify] UPDATE:', error)
    } else {
      console.log(`[MONETBIL/notify] Achat ${purchaseId} → ${newStatus}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[MONETBIL/notify] Erreur:', err)
    // 200 pour éviter les relances en boucle (la décision de sécurité est déjà prise plus haut).
    return NextResponse.json({ received: true })
  }
}
