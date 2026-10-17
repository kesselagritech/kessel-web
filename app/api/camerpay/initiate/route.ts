// app/api/camerpay/initiate/route.ts — Lancer un paiement par CARTE (CamerPay) — [camerpay-carte v1]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { carteActivee, createCardPayment, CamerpayError } from '@/lib/camerpay'
import { solderTentativesEnAttente } from '@/lib/paiement'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 1-bis. Interrupteur : carte désactivée (ou réservée au compte d'essai) → refus net,
    //        même si quelqu'un appelle cette adresse sans passer par le bouton
    if (!carteActivee(user.email)) {
      return NextResponse.json({ error: 'Le paiement par carte n’est pas disponible pour le moment.' }, { status: 403 })
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
      console.error('[CAMERPAY] Prix invalide pour', doc.id, doc.price)
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

    // 5. Anciennes tentatives « pending » (Mobile Money ou carte) : revérifiées avant tout
    if (await solderTentativesEnAttente(supabase, user.id, documentId)) {
      return NextResponse.json({ error: 'Document déjà acheté' }, { status: 409 })
    }

    // 6. Créer l'achat en attente
    const { data: purchase, error: purchErr } = await supabase
      .from('document_purchases')
      .insert({
        user_id: user.id,
        document_id: documentId,
        amount,
        payment_status: 'pending',
        payment_method: 'camerpay',
      })
      .select('id')
      .single()

    if (purchErr || !purchase) {
      console.error('[CAMERPAY] INSERT purchase:', purchErr)
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
    }

    // 7. Transaction carte chez CamerPay
    const siteUrl = (process.env.SITE_URL || 'https://kesselagritech.com').replace(/\/+$/, '')
    const back = `${siteUrl}/bibliotheque/${doc.slug}`

    let payUrl: string
    let uuid: string
    try {
      const r = await createCardPayment({
        amount,
        // merchant_invoice_id = idempotency_key = notre purchase.id : clé de rapprochement
        purchaseId: purchase.id,
        customerEmail: user.email ?? null,
        callbackUrl: `${siteUrl}/api/camerpay/webhook`,
        returnUrl: `${back}?paiement=retour&ref=${purchase.id}`,
      })
      payUrl = r.payUrl
      uuid = r.uuid
    } catch (e) {
      await supabase.from('document_purchases').delete().eq('id', purchase.id)
      const status = e instanceof CamerpayError ? e.status : 0
      console.error('[CAMERPAY] createCardPayment:', e)
      if (status === 402) {
        return NextResponse.json(
          { error: 'Le paiement par carte est momentanément plafonné. Utilise le Mobile Money ou réessaie plus tard.' },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { error: 'Paiement par carte indisponible pour le moment. Utilise le Mobile Money ou réessaie dans un instant.' },
        { status: 502 }
      )
    }

    // 8. Mémoriser l'uuid CamerPay (sert à la vérification serveur)
    const { error: refErr } = await supabase
      .from('document_purchases')
      .update({ payment_ref: uuid })
      .eq('id', purchase.id)
    if (refErr) console.error('[CAMERPAY] Enregistrement uuid échoué — rattrapage via webhook', purchase.id, refErr)

    return NextResponse.json({ paymentUrl: payUrl, purchaseId: purchase.id })
  } catch (err) {
    console.error('[CAMERPAY] initiate:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
