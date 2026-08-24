// app/api/monetbil/initiate/route.ts — Lancer un paiement Monetbil — [monetbil-backend v1]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { createPayment, extractPaymentId } from '@/lib/monetbil'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 2. Payload
    const { documentId } = await request.json()
    if (!documentId) {
      return NextResponse.json({ error: 'documentId requis' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // 3. Récupérer le document
    const { data: doc, error: docErr } = await supabase
      .from('documents')
      .select('id, title, price, slug, status')
      .eq('id', documentId)
      .single()

    if (docErr || !doc) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }
    if (doc.status !== 'published') {
      return NextResponse.json({ error: 'Document indisponible' }, { status: 403 })
    }

    // 4. Déjà acheté ?
    const { data: existing } = await supabase
      .from('document_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('document_id', documentId)
      .eq('payment_status', 'completed')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Document déjà acheté' }, { status: 409 })
    }

    // 5. Nettoyer les anciens pending (double-clic)
    await supabase
      .from('document_purchases')
      .delete()
      .eq('user_id', user.id)
      .eq('document_id', documentId)
      .eq('payment_status', 'pending')

    // 6. Créer l'achat en attente
    const { data: purchase, error: purchErr } = await supabase
      .from('document_purchases')
      .insert({
        user_id: user.id,
        document_id: documentId,
        amount: doc.price,
        payment_status: 'pending',
        payment_method: 'monetbil',
      })
      .select('id')
      .single()

    if (purchErr || !purchase) {
      console.error('[MONETBIL] INSERT purchase:', purchErr)
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
    }

    // 7. Créer le lien Monetbil
    const siteUrl = process.env.SITE_URL || 'https://kesselagritech.com'

    let result: { success: boolean; payment_url?: string }
    try {
      result = await createPayment({
        amount: doc.price,
        itemRef: doc.id,
        // payment_ref = notre purchase.id : Monetbil le renverra dans la notification.
        // C'est la clé de rapprochement (équivalent de external_reference chez CamPay).
        paymentRef: purchase.id,
        user: user.id,
        returnUrl: `${siteUrl}/bibliotheque/${doc.slug}?paiement=retour&ref=${purchase.id}`,
        notifyUrl: `${siteUrl}/api/monetbil/notify`,
      })
    } catch (e) {
      await supabase.from('document_purchases').delete().eq('id', purchase.id)
      console.error('[MONETBIL] createPayment:', e)
      return NextResponse.json({ error: 'Erreur paiement' }, { status: 502 })
    }

    if (!result.success || !result.payment_url) {
      await supabase.from('document_purchases').delete().eq('id', purchase.id)
      console.error('[MONETBIL] Pas de payment_url:', result)
      return NextResponse.json({ error: 'Erreur paiement' }, { status: 502 })
    }

    // 8. Stocker l'identifiant Monetbil (token du payment_url) pour le polling checkPayment
    const paymentId = extractPaymentId(result.payment_url)
    await supabase
      .from('document_purchases')
      .update({ payment_ref: paymentId })
      .eq('id', purchase.id)

    return NextResponse.json({
      paymentUrl: result.payment_url,
      purchaseId: purchase.id,
    })
  } catch (err) {
    console.error('[MONETBIL] initiate:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
