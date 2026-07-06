// app/api/campay/initiate/route.ts — Lancer un paiement CamPay
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { createPaymentLink } from '@/lib/campay'

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
        payment_method: 'campay',
      })
      .select('id')
      .single()

    if (purchErr || !purchase) {
      console.error('[CAMPAY] Erreur INSERT purchase:', purchErr)
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
    }

    // 7. Créer le lien CamPay
    const siteUrl = process.env.SITE_URL || 'https://kesselagritech.com'

    const campayResult = await createPaymentLink({
      amount: doc.price,
      description: `${doc.title} — Kessel Agritech`,
      externalReference: purchase.id,
      redirectUrl: `${siteUrl}/bibliotheque/${doc.slug}?paiement=succes&ref=${purchase.id}`,
      failureRedirectUrl: `${siteUrl}/bibliotheque/${doc.slug}?paiement=echec`,
    })

    if (!campayResult.link) {
      // Nettoyage si CamPay échoue
      await supabase.from('document_purchases').delete().eq('id', purchase.id)
      console.error('[CAMPAY] Pas de lien retourné:', campayResult)
      return NextResponse.json({ error: 'Erreur paiement' }, { status: 502 })
    }

    // 8. Stocker la référence CamPay
    await supabase
      .from('document_purchases')
      .update({ payment_ref: campayResult.reference })
      .eq('id', purchase.id)

    return NextResponse.json({
      paymentUrl: campayResult.link,
      purchaseId: purchase.id,
    })
  } catch (err) {
    console.error('[CAMPAY] Erreur initiate:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
