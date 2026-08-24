// app/api/monetbil/status/route.ts — Vérifier le statut d'un achat (polling client) — [monetbil-backend v1]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { checkPayment, isSuccessStatus, isFailedStatus } from '@/lib/monetbil'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // 1. Auth
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 2. Récupérer le purchaseId
    const purchaseId = new URL(request.url).searchParams.get('purchaseId')
    if (!purchaseId) {
      return NextResponse.json({ error: 'purchaseId requis' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // 3. Chercher l'achat (seulement le sien)
    const { data: purchase, error } = await supabase
      .from('document_purchases')
      .select('payment_status, payment_ref')
      .eq('id', purchaseId)
      .eq('user_id', user.id)
      .single()

    if (error || !purchase) {
      return NextResponse.json({ error: 'Achat introuvable' }, { status: 404 })
    }

    // 4. Déjà tranché (le webhook est passé) → on renvoie directement
    if (purchase.payment_status !== 'pending') {
      return NextResponse.json({ status: purchase.payment_status })
    }

    // 5. Encore pending + on a l'identifiant Monetbil → double-check côté serveur
    if (purchase.payment_ref) {
      try {
        const { status } = await checkPayment(purchase.payment_ref)

        if (isSuccessStatus(status)) {
          await supabase
            .from('document_purchases')
            .update({ payment_status: 'completed' })
            .eq('id', purchaseId)
            .eq('payment_status', 'pending')
          return NextResponse.json({ status: 'completed' })
        }

        if (isFailedStatus(status)) {
          await supabase
            .from('document_purchases')
            .update({ payment_status: 'failed' })
            .eq('id', purchaseId)
            .eq('payment_status', 'pending')
          return NextResponse.json({ status: 'failed' })
        }
      } catch (e) {
        console.warn('[MONETBIL/status] checkPayment échoué:', e)
      }
    }

    return NextResponse.json({ status: 'pending' })
  } catch (err) {
    console.error('[MONETBIL/status] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
