// app/api/campay/status/route.ts — Statut d'un achat (polling de la fiche) — [campay-live v1]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { confirmPurchase } from '@/lib/campay'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // 1. Auth
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 2. purchaseId
    const purchaseId = new URL(request.url).searchParams.get('purchaseId')
    if (!purchaseId) {
      return NextResponse.json({ error: 'purchaseId requis' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // 3. L'achat doit appartenir à l'utilisateur connecté
    const { data: purchase, error } = await supabase
      .from('document_purchases')
      .select('payment_status')
      .eq('id', purchaseId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error || !purchase) {
      return NextResponse.json({ error: 'Achat introuvable' }, { status: 404 })
    }

    if (purchase.payment_status === 'completed') {
      return NextResponse.json({ status: 'completed' })
    }

    // 4. Pas encore tranché → on redemande à CamPay (mêmes contrôles que le webhook)
    const status = await confirmPurchase(supabase, purchaseId)
    return NextResponse.json({ status })
  } catch (err) {
    console.error('[CAMPAY/status] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
