// app/api/campay/initiate/route.ts — Lancer un paiement CamPay — [campay-live v1]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { createPaymentLink, confirmPurchase } from '@/lib/campay'

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

    // 3. Document (le prix vient TOUJOURS de la base, jamais du navigateur)
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
    const amount = Number(doc.price)
    if (!Number.isInteger(amount) || amount <= 0) {
      console.error('[CAMPAY] Prix invalide pour', doc.id, doc.price)
      return NextResponse.json({ error: 'Prix du document invalide' }, { status: 500 })
    }

    // 4. Déjà acheté ?
    const { data: existing } = await supabase
      .from('document_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('document_id', documentId)
      .eq('payment_status', 'completed')
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Document déjà acheté' }, { status: 409 })
    }

    // 5. Anciennes tentatives restées « pending » : on NE les supprime PAS à l'aveugle.
    //    Un paiement Orange peut être validé en retard (#150*50#) : on redemande d'abord
    //    à CamPay. Si l'une a finalement réussi → document débloqué, pas de double débit.
    const { data: olds } = await supabase
      .from('document_purchases')
      .select('id, payment_method')
      .eq('user_id', user.id)
      .eq('document_id', documentId)
      .eq('payment_status', 'pending')

    for (const old of olds || []) {
      if (old.payment_method === 'campay') {
        const r = await confirmPurchase(supabase, old.id)
        if (r === 'completed') {
          return NextResponse.json({ error: 'Document déjà acheté' }, { status: 409 })
        }
      }
      // Tentative abandonnée → classée « failed » (trace conservée, rattrapable par CamPay)
      await supabase
        .from('document_purchases')
        .update({ payment_status: 'failed' })
        .eq('id', old.id)
        .eq('payment_status', 'pending')
    }

    // 6. Créer l'achat en attente
    const { data: purchase, error: purchErr } = await supabase
      .from('document_purchases')
      .insert({
        user_id: user.id,
        document_id: documentId,
        amount,
        payment_status: 'pending',
        payment_method: 'campay',
      })
      .select('id')
      .single()

    if (purchErr || !purchase) {
      console.error('[CAMPAY] INSERT purchase:', purchErr)
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
    }

    // 7. Lien de paiement CamPay
    const siteUrl = (process.env.SITE_URL || 'https://kesselagritech.com').replace(/\/+$/, '')
    const back = `${siteUrl}/bibliotheque/${doc.slug}`

    let link: string
    let reference: string | null
    try {
      const r = await createPaymentLink({
        amount,
        description: `Kessel Agritech - ${doc.title}`.slice(0, 100),
        // external_reference = notre purchase.id : clé de rapprochement côté CamPay
        externalReference: purchase.id,
        redirectUrl: `${back}?paiement=retour&ref=${purchase.id}`,
        failureRedirectUrl: `${back}?paiement=retour&ref=${purchase.id}`,
      })
      link = r.link
      reference = r.reference
    } catch (e) {
      await supabase.from('document_purchases').delete().eq('id', purchase.id)
      console.error('[CAMPAY] createPaymentLink:', e)
      return NextResponse.json({ error: 'Paiement indisponible, réessaie dans un instant' }, { status: 502 })
    }

    // 8. Mémoriser la référence CamPay (sert à la vérification serveur)
    if (reference) {
      await supabase
        .from('document_purchases')
        .update({ payment_ref: reference })
        .eq('id', purchase.id)
    } else {
      console.warn('[CAMPAY] Pas de reference dans la réponse — rattrapage via webhook', purchase.id)
    }

    return NextResponse.json({ paymentUrl: link, purchaseId: purchase.id })
  } catch (err) {
    console.error('[CAMPAY] initiate:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
