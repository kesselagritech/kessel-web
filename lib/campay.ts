// lib/campay.ts — Client CamPay (serveur uniquement) — [campay-live v1]
// Passerelle Mobile Money (MTN / Orange) de la bibliothèque web. Remplace Monetbil.
//
// Flux « lien de paiement » :
//   1. /api/campay/initiate demande un lien à CamPay (get_payment_link)
//   2. le client paie sur la page CamPay, puis revient sur la fiche (?paiement=retour)
//   3. CamPay prévient /api/campay/webhook ; la fiche interroge /api/campay/status
//
// RÈGLE DE SÉCURITÉ (fail-closed) : on ne croit JAMAIS ce qu'on reçoit (webhook, URL de
// retour). Le document n'est débloqué qu'après avoir REDEMANDÉ à CamPay, avec notre propre
// jeton, l'état réel de la transaction, et vérifié : statut SUCCESSFUL + même référence
// + même external_reference (= notre purchase.id) + montant et devise identiques.
//
// Référence API : SDK officiel CamPay (pypi « campay ») — hôte live https://www.campay.net

import type { SupabaseClient } from '@supabase/supabase-js'

const BASE_URL = (process.env.CAMPAY_BASE_URL || 'https://www.campay.net/api').replace(/\/+$/, '')

function authHeaders(): Record<string, string> {
  const token = process.env.CAMPAY_PERMANENT_TOKEN
  if (!token) throw new Error('CAMPAY_PERMANENT_TOKEN manquant')
  return {
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json',
  }
}

export type CampayTransaction = {
  reference: string
  external_reference: string | null
  status: string // SUCCESSFUL | FAILED | PENDING
  amount: number
  currency: string
  operator: string | null
}

/** Demande un lien de paiement hébergé par CamPay. */
export async function createPaymentLink(params: {
  amount: number
  description: string
  externalReference: string
  redirectUrl: string
  failureRedirectUrl: string
}): Promise<{ link: string; reference: string | null }> {
  const res = await fetch(`${BASE_URL}/get_payment_link/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      amount: String(params.amount), // entier, pas de décimales (ER201)
      currency: 'XAF',
      description: params.description,
      external_reference: params.externalReference,
      redirect_url: params.redirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      payment_options: 'MOMO',
    }),
    cache: 'no-store',
  })

  const text = await res.text()
  if (!res.ok) {
    console.error(`[CAMPAY] get_payment_link ${res.status}:`, text)
    throw new Error(`CamPay ${res.status}`)
  }

  let data: { link?: string; reference?: string }
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('CamPay : réponse illisible')
  }
  if (!data.link) throw new Error('CamPay : pas de lien de paiement')
  return { link: data.link, reference: data.reference ?? null }
}

/** Interroge CamPay sur l'état réel d'une transaction (source de vérité). */
export async function getTransaction(reference: string): Promise<CampayTransaction> {
  const res = await fetch(`${BASE_URL}/transaction/${encodeURIComponent(reference)}/`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`[CAMPAY] transaction ${res.status}:`, text)
    throw new Error(`CamPay transaction ${res.status}`)
  }
  const d = JSON.parse(text)
  return {
    reference: String(d.reference ?? ''),
    external_reference: d.external_reference != null ? String(d.external_reference) : null,
    status: String(d.status ?? '').toUpperCase(),
    amount: Number(d.amount),
    currency: String(d.currency ?? '').toUpperCase(),
    operator: d.operator != null ? String(d.operator) : null,
  }
}

export type ConfirmResult = 'completed' | 'failed' | 'pending'

/**
 * Tranche le sort d'un achat en interrogeant CamPay. Utilisé par le webhook ET par le
 * polling : les deux chemins appliquent exactement les mêmes contrôles.
 *
 * - SUCCESSFUL + tous les contrôles OK  → 'completed' (débloque le document)
 * - FAILED                              → 'failed'
 * - PENDING, erreur réseau, incohérence → 'pending' (on ne débloque rien)
 *
 * Un achat 'failed' peut encore passer 'completed' si CamPay confirme plus tard
 * (cas Orange Money : validation tardive par #150*50#). Jamais l'inverse.
 */
export async function confirmPurchase(
  supabase: SupabaseClient,
  purchaseId: string,
  hintReference?: string | null
): Promise<ConfirmResult> {
  const { data: purchase, error } = await supabase
    .from('document_purchases')
    .select('id, amount, payment_status, payment_ref, payment_method')
    .eq('id', purchaseId)
    .maybeSingle()

  if (error || !purchase) return 'pending'
  if (purchase.payment_status === 'completed') return 'completed'
  if (purchase.payment_method !== 'campay') return 'pending'

  // Référence CamPay : celle stockée à l'initiation ; à défaut, celle annoncée par le
  // webhook — mais alors CamPay doit confirmer que la transaction porte bien NOTRE purchase.id.
  const storedRef: string | null = purchase.payment_ref
  const reference = storedRef || hintReference || null
  if (!reference) return 'pending'

  let tx: CampayTransaction
  try {
    tx = await getTransaction(reference)
  } catch (e) {
    console.warn('[CAMPAY] confirmPurchase — CamPay injoignable:', e)
    return 'pending'
  }

  if (tx.status === 'SUCCESSFUL') {
    const sameRef = tx.reference === reference
    const sameExt = storedRef
      ? tx.external_reference === null || tx.external_reference === purchase.id
      : tx.external_reference === purchase.id // pas de réf. stockée → contrôle strict
    const sameAmount = Number.isFinite(tx.amount) && tx.amount === Number(purchase.amount)
    const sameCurrency = tx.currency === '' || tx.currency === 'XAF'

    if (!sameRef || !sameExt || !sameAmount || !sameCurrency) {
      console.error('[CAMPAY] INCOHÉRENCE — achat NON débloqué', {
        purchaseId,
        attendu: { ref: reference, amount: purchase.amount },
        recu: tx,
      })
      return 'pending'
    }

    await supabase
      .from('document_purchases')
      .update({ payment_status: 'completed', payment_ref: reference })
      .eq('id', purchaseId)
      .in('payment_status', ['pending', 'failed'])
    console.log(`[CAMPAY] Achat ${purchaseId} → completed (${tx.operator ?? '?'})`)
    return 'completed'
  }

  if (tx.status === 'FAILED') {
    if (tx.reference !== reference) return 'pending'
    if (!storedRef && tx.external_reference !== purchase.id) return 'pending'
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'failed' })
      .eq('id', purchaseId)
      .eq('payment_status', 'pending')
    return 'failed'
  }

  return 'pending'
}
