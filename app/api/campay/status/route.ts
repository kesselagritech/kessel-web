// app/api/campay/status/route.ts — Vérifier le statut d'un achat (polling)
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { getTransactionStatus } from '@/lib/campay'

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

    // 4. Si encore pending et qu'on a une ref CamPay → vérifier en direct
    if (purchase.payment_status === 'pending' && purchase.payment_ref) {
      try {
        const txStatus = await getTransactionStatus(purchase.payment_ref)

        if (txStatus.status === 'SUCCESSFUL') {
          await supabase
            .from('document_purchases')
            .update({
              payment_status: 'completed'
            })
            .eq('id', purchaseId)

          return NextResponse.json({ status: 'completed' })
        }

        if (txStatus.status === 'FAILED') {
          await supabase
            .from('document_purchases')
            .update({
              payment_status: 'failed'
            })
            .eq('id', purchaseId)

          return NextResponse.json({ status: 'failed' })
        }
      } catch (err) {
        console.warn('[STATUS] Vérification CamPay échouée:', err)
      }
    }

    return NextResponse.json({ status: purchase.payment_status })
  } catch (err) {
    console.error('[STATUS] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
