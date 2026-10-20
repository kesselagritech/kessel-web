// app/api/nokash/initiate/route.ts — Lancer un paiement NOKASH (Mobile Money ou carte) — [nokash v1]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import {
  lancerPaiement,
  nettoyerNom,
  nokashActif,
  normaliserTelephone,
  NokashError,
  type Operateur,
} from '@/lib/nokash'
import { solderTentativesEnAttente } from '@/lib/paiement'

export const runtime = 'nodejs'

const MONTANT_MIN = 200 // minimum NOKASH en XAF
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 1-bis. Interrupteur : NOKASH désactivé (ou réservé au compte d'essai) → refus net,
    //        même si quelqu'un appelle cette adresse sans passer par le bouton
    if (!nokashActif(user.email)) {
      return NextResponse.json({ error: 'Ce moyen de paiement n’est pas disponible pour le moment.' }, { status: 403 })
    }

    // 2. Payload
    const body = (await request.json().catch(() => ({}))) as {
      documentId?: string
      moyen?: string
      operateur?: string
      telephone?: string
      nom?: string
    }
    const { documentId } = body
    if (!documentId) {
      return NextResponse.json({ error: 'documentId requis' }, { status: 400 })
    }
    const moyen = body.moyen === 'carte' ? 'carte' : body.moyen === 'momo' ? 'momo' : null
    if (!moyen) {
      return NextResponse.json({ error: 'Moyen de paiement inconnu' }, { status: 400 })
    }

    // 2-bis. Données du payeur, validées AVANT de créer quoi que ce soit
    let operateur: Operateur | undefined
    let telephone: string | undefined
    let nom: string | undefined
    let email: string | undefined
    if (moyen === 'momo') {
      if (body.operateur !== 'MTN_MOMO' && body.operateur !== 'ORANGE_MONEY') {
        return NextResponse.json({ error: 'Choisis ton opérateur : MTN ou Orange.' }, { status: 400 })
      }
      operateur = body.operateur
      telephone = normaliserTelephone(body.telephone || '') ?? undefined
      if (!telephone) {
        return NextResponse.json({ error: 'Numéro invalide : 9 chiffres commençant par 6 (ex. 6 77 12 34 56).' }, { status: 400 })
      }
    } else {
      nom = nettoyerNom(body.nom || '')
      if (nom.length < 2) {
        return NextResponse.json({ error: 'Indique le nom inscrit sur la carte.' }, { status: 400 })
      }
      email = (user.email || '').trim()
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Ton compte n’a pas d’adresse e-mail valide pour le paiement par carte.' }, { status: 400 })
      }
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
    if (!Number.isInteger(amount) || amount < MONTANT_MIN) {
      console.error('[NOKASH] Prix invalide pour', doc.id, doc.price)
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

    // 5. Anciennes tentatives « pending » (tous prestataires) : revérifiées avant tout.
    //    Si l'une a finalement réussi → pas de double débit.
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
        payment_method: 'nokash',
      })
      .select('id')
      .single()

    if (purchErr || !purchase) {
      console.error('[NOKASH] INSERT purchase:', purchErr)
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
    }

    // 7. Demande de paiement chez NOKASH
    const siteUrl = (process.env.SITE_URL || 'https://kesselagritech.com').replace(/\/+$/, '')

    let paymentRef: string
    let paymentUrl: string | null
    try {
      const r = await lancerPaiement({
        moyen,
        purchaseId: purchase.id, // order_id = notre purchase.id : clé de rapprochement
        amount,
        callbackUrl: `${siteUrl}/api/nokash/webhook`,
        operateur,
        telephone,
        nom,
        email,
      })
      paymentRef = r.paymentRef
      paymentUrl = r.paymentUrl
    } catch (e) {
      // On garde une trace (« failed ») plutôt que d'effacer : si NOKASH avait malgré tout
      // créé la transaction, l'achat reste retrouvable par son order_id.
      await supabase.from('document_purchases').update({ payment_status: 'failed' }).eq('id', purchase.id)
      console.error('[NOKASH] lancerPaiement:', e)
      const status = e instanceof NokashError ? e.status : 0
      if (status === 400) {
        return NextResponse.json(
          { error: 'Paiement refusé : vérifie les informations saisies puis réessaie.' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Paiement indisponible pour le moment. Réessaie dans un instant.' },
        { status: 502 }
      )
    }

    // 8. Mémoriser l'id NOKASH (sert à la vérification serveur)
    const { error: refErr } = await supabase
      .from('document_purchases')
      .update({ payment_ref: paymentRef })
      .eq('id', purchase.id)
    if (refErr) console.error('[NOKASH] Enregistrement id échoué', purchase.id, refErr)

    return NextResponse.json({ purchaseId: purchase.id, paymentUrl })
  } catch (err) {
    console.error('[NOKASH] initiate:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
