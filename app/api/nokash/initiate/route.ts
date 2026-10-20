// app/api/nokash/initiate/route.ts — Lancer un paiement NOKASH (Mobile Money, virement ou carte) — [nokash v1 + v2 multi-pays]
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getUserFromRequest } from '@/lib/supabase-server'
import { lancerPaiement, nettoyerNom, nokashActif, NokashError, type Virement } from '@/lib/nokash'
import { normaliserNumero, paysNokash, type Monnaie, type PaysNokash } from '@/lib/nokashPays'
import { prixLocal, TauxIndisponible } from '@/lib/taux'
import { solderTentativesEnAttente } from '@/lib/paiement'

export const runtime = 'nodejs'

const MONTANT_MIN = 200 // minimum NOKASH en XAF / XOF
/** Minimums connus (doc NOKASH) ; les autres monnaies : NOKASH tranche lui-même. */
const MINIMUM_LOCAL: Partial<Record<Monnaie, number>> = { XAF: 200, XOF: 200, NGN: 500 }
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
      pays?: string
      operateur?: string
      telephone?: string
      nom?: string
    }
    const { documentId } = body
    if (!documentId) {
      return NextResponse.json({ error: 'documentId requis' }, { status: 400 })
    }
    const moyen =
      body.moyen === 'carte' ? 'carte' : body.moyen === 'momo' ? 'momo' : body.moyen === 'virement' ? 'virement' : null
    if (!moyen) {
      return NextResponse.json({ error: 'Moyen de paiement inconnu' }, { status: 400 })
    }

    // 2-bis. Données du payeur, validées AVANT de créer quoi que ce soit
    let pays: PaysNokash | null = null
    let operateur: string | undefined
    let telephone: string | undefined
    let nom: string | undefined
    let email: string | undefined
    if (moyen !== 'carte') {
      pays = paysNokash(body.pays)
      if (!pays || pays.mode !== moyen) {
        return NextResponse.json({ error: 'Pays non pris en charge pour ce moyen de paiement.' }, { status: 400 })
      }
    }
    if (moyen === 'momo' && pays) {
      if (!pays.operateurs.some((o) => o.code === body.operateur)) {
        return NextResponse.json({ error: 'Choisis ton opérateur.' }, { status: 400 })
      }
      operateur = body.operateur
      telephone = normaliserNumero(pays, body.telephone || '') ?? undefined
      if (!telephone) {
        return NextResponse.json(
          { error: `Numéro invalide pour ${pays.nom} (ex. ${pays.exemple}).` },
          { status: 400 }
        )
      }
    } else {
      nom = nettoyerNom(body.nom || '')
      if (nom.length < 2) {
        return NextResponse.json(
          { error: moyen === 'carte' ? 'Indique le nom inscrit sur la carte.' : 'Indique ton nom complet.' },
          { status: 400 }
        )
      }
      email = (user.email || '').trim()
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Ton compte n’a pas d’adresse e-mail valide pour ce paiement.' }, { status: 400 })
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

    // 3-bis. Montant dans la monnaie du pays (prix FCFA inchangé en zone FCFA, converti ailleurs)
    const monnaie: Monnaie = pays ? pays.monnaie : 'XAF'
    let montantLocal: number
    try {
      montantLocal = await prixLocal(amount, monnaie)
    } catch (e) {
      if (e instanceof TauxIndisponible) {
        console.error('[NOKASH] taux indisponible', monnaie, e.message)
        return NextResponse.json(
          { error: 'Le paiement dans ta monnaie est momentanément indisponible. Réessaie plus tard ou paie par carte.' },
          { status: 503 }
        )
      }
      throw e
    }
    const minimum = MINIMUM_LOCAL[monnaie]
    if (!Number.isInteger(montantLocal) || montantLocal <= 0 || (minimum !== undefined && montantLocal < minimum)) {
      console.error('[NOKASH] montant local invalide', { monnaie, montantLocal })
      return NextResponse.json({ error: 'Montant invalide pour ce pays.' }, { status: 400 })
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
        pay_country: pays ? pays.code : 'CM',
        pay_currency: monnaie,
        pay_amount: montantLocal,
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
    let virement: Virement | null
    try {
      const r = await lancerPaiement({
        moyen,
        purchaseId: purchase.id, // order_id = notre purchase.id : clé de rapprochement
        amount: montantLocal,
        callbackUrl: `${siteUrl}/api/nokash/webhook`,
        pays: pays ?? undefined,
        operateur,
        telephone,
        nom,
        email,
      })
      paymentRef = r.paymentRef
      paymentUrl = r.paymentUrl
      virement = r.virement
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

    return NextResponse.json({ purchaseId: purchase.id, paymentUrl, virement, montant: montantLocal, monnaie })
  } catch (err) {
    console.error('[NOKASH] initiate:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
