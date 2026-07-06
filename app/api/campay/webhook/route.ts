// app/api/campay/webhook/route.ts — Callback CamPay après paiement
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { getTransactionStatus } from '@/lib/campay'

export async function POST(request: NextRequest) {
  return handleWebhook(request)
}

// CamPay peut envoyer GET ou POST selon la config
export async function GET(request: NextRequest) {
  return handleWebhook(request)
}

async function handleWebhook(request: NextRequest) {
  try {
    // 1. Extraire la référence (query params ou body)
    let reference: string | null = null
    let externalReference: string | null = null
    let status: string | null = null

    // Depuis les query params (GET)
    const url = new URL(request.url)
    reference = url.searchParams.get('reference')
    externalReference = url.searchParams.get('external_reference')
    status = url.searchParams.get('status')

    // Depuis le body (POST) — si pas trouvé dans les params
    if (!reference && request.method === 'POST') {
      try {
        const body = await request.json()
        reference = body.reference || null
        externalReference = body.external_reference || null
        status = body.status || null
      } catch {
        // Body vide ou non-JSON, on continue avec les params
      }
    }

    if (!reference && !externalReference) {
      console.warn('[WEBHOOK] Aucune référence reçue')
      return NextResponse.json({ received: true })
    }

    console.log('[WEBHOOK] Reçu:', { reference, externalReference, status })

    // 2. Vérifier auprès de CamPay (double-check sécurité)
    let verifiedStatus = status
    if (reference) {
      try {
        const txStatus = await getTransactionStatus(reference)
        verifiedStatus = txStatus.status
        externalReference = externalReference || txStatus.external_reference
        console.log('[WEBHOOK] Vérifié CamPay:', txStatus.status)
      } catch (err) {
        console.warn('[WEBHOOK] Vérification CamPay échouée, on utilise le statut reçu:', err)
      }
    }

    if (!externalReference) {
      console.warn('[WEBHOOK] Pas d\'external_reference, impossible de matcher l\'achat')
      return NextResponse.json({ received: true })
    }

    // 3. Mettre à jour l'achat
    const supabase = createServiceClient()
    const newStatus = verifiedStatus === 'SUCCESSFUL' ? 'completed' : 'failed'

    const { error } = await supabase
      .from('document_purchases')
      .update({
        payment_status: newStatus,
        payment_ref: reference || undefined
      })
      .eq('id', externalReference)
      .eq('payment_status', 'pending') // Idempotent : ne touche pas si déjà traité

    if (error) {
      console.error('[WEBHOOK] Erreur UPDATE:', error)
    } else {
      console.log(`[WEBHOOK] Achat ${externalReference} → ${newStatus}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[WEBHOOK] Erreur:', err)
    // Toujours répondre 200 pour éviter les retry infinis de CamPay
    return NextResponse.json({ received: true })
  }
}
