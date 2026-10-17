// lib/camerpay.ts — Client CamerPay (serveur uniquement) — [camerpay-carte v1]
// Rôle : paiement par CARTE BANCAIRE de la bibliothèque web (Visa / Mastercard via Stripe).
// Le Mobile Money reste chez CamPay (lib/campay.ts).
//
// Interrupteur NEXT_PUBLIC_CAMERPAY_CARD :
//   "1"                  → carte proposée à tous ;
//   "test:adresse@mail"  → carte proposée à CE SEUL compte (essais en production, y compris
//                          avec le jeton d'essai CamerPay, sans ouvrir la carte au public) ;
//   vide / autre         → carte masquée et refusée côté serveur.
//
// Flux « page de paiement hébergée » :
//   1. /api/camerpay/initiate crée la transaction (POST /api/payment/initiate, payment_method=stripe)
//   2. le client paie sur la page CamerPay, puis revient sur la fiche (?paiement=retour)
//   3. CamerPay prévient /api/camerpay/webhook ; la fiche interroge /api/campay/status
//
// RÈGLE DE SÉCURITÉ (fail-closed), identique à CamPay : on ne croit JAMAIS ce qu'on reçoit
// (webhook, URL de retour). Le document n'est débloqué qu'après avoir REDEMANDÉ à CamerPay,
// avec notre propre jeton, l'état réel de la transaction (GET /api/payment/{uuid}/status) et
// vérifié : statut completed + même uuid + même merchant_invoice_id (= notre purchase.id)
// + montant et devise identiques + mode (essai / réel) conforme à CAMERPAY_MODE.
// La signature HMAC des webhooks n'est donc pas nécessaire : un faux webhook ne peut rien débloquer.
//
// Référence API : https://camerpay.biz/docs/openapi.json (OpenAPI 3.1, v1.0.0)

import type { SupabaseClient } from '@supabase/supabase-js'

/** Taux fixe BEAC utilisé par CamerPay pour présenter le montant en euros. */
export const XAF_PAR_EUR = 655.957

/** Carte bancaire proposée à ce compte ? (même règle côté navigateur et serveur) */
export function carteActivee(email?: string | null): boolean {
  const v = (process.env.NEXT_PUBLIC_CAMERPAY_CARD || '').trim()
  if (v === '1') return true
  if (v.toLowerCase().startsWith('test:')) {
    const testeur = v.slice(5).trim().toLowerCase()
    return Boolean(testeur) && (email || '').trim().toLowerCase() === testeur
  }
  return false
}

const BASE_URL = (process.env.CAMERPAY_BASE_URL || 'https://camerpay.biz').replace(/\/+$/, '')

/** "live" (défaut) ou "sandbox" : doit correspondre au jeton utilisé. */
function modeAttendu(): 'live' | 'sandbox' {
  return (process.env.CAMERPAY_MODE || 'live').trim().toLowerCase() === 'sandbox' ? 'sandbox' : 'live'
}

function authHeaders(): Record<string, string> {
  const token = process.env.CAMERPAY_API_TOKEN
  if (!token) throw new Error('CAMERPAY_API_TOKEN manquant')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

/** Erreur CamerPay avec son code HTTP (402 plafond KYC / quota, 403 onboarding incomplet…). */
export class CamerpayError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export type CamerpayTransaction = {
  uuid: string
  status: string // pending | processing | completed | failed | cancelled | refunded
  amount: number
  currency: string
  paymentMethod: string | null
  merchantInvoiceId: string | null
  isSandbox: boolean | null
}

/** Crée une transaction carte et renvoie l'URL de la page de paiement CamerPay. */
export async function createCardPayment(params: {
  amount: number
  purchaseId: string
  customerEmail: string | null
  callbackUrl: string
  returnUrl: string
}): Promise<{ payUrl: string; uuid: string }> {
  const body: Record<string, unknown> = {
    payment_method: 'stripe',
    amount: params.amount, // ENTIER en XAF (le serveur accepte encore des décimales : on n'en envoie jamais)
    currency: 'XAF',
    merchant_invoice_id: params.purchaseId,
    idempotency_key: params.purchaseId,
    merchant_callback_url: params.callbackUrl,
    merchant_return_url: params.returnUrl,
    source: 'kessel-bibliotheque',
  }
  if (params.customerEmail) body.customer_email = params.customerEmail

  const res = await fetch(`${BASE_URL}/api/payment/initiate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const text = await res.text()
  if (!res.ok) {
    console.error(`[CAMERPAY] initiate ${res.status}:`, text.slice(0, 500))
    throw new CamerpayError(res.status, `CamerPay ${res.status}`)
  }

  let data: { success?: boolean; transaction_uuid?: string; pay_url?: string; redirect_url?: string }
  try {
    data = JSON.parse(text)
  } catch {
    throw new CamerpayError(502, 'CamerPay : réponse illisible')
  }
  const payUrl = data.pay_url || data.redirect_url
  if (data.success === false || !payUrl || !data.transaction_uuid) {
    console.error('[CAMERPAY] initiate — réponse incomplète:', text.slice(0, 500))
    throw new CamerpayError(502, 'CamerPay : pas de page de paiement')
  }
  // On n'envoie le client que vers CamerPay lui-même (protection contre une URL détournée).
  const host = new URL(payUrl).host
  if (host !== new URL(BASE_URL).host) {
    throw new CamerpayError(502, `CamerPay : page de paiement sur un hôte inattendu (${host})`)
  }
  return { payUrl, uuid: data.transaction_uuid }
}

/**
 * Interroge CamerPay sur l'état réel d'une transaction (source de vérité).
 * La doc publie deux formes de réponse (à plat dans l'OpenAPI, sous « transaction » dans la
 * page Endpoints) : les deux sont acceptées.
 */
export async function getCardTransaction(uuid: string): Promise<CamerpayTransaction> {
  const res = await fetch(`${BASE_URL}/api/payment/${encodeURIComponent(uuid)}/status`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`[CAMERPAY] status ${res.status}:`, text.slice(0, 500))
    throw new CamerpayError(res.status, `CamerPay status ${res.status}`)
  }
  const d = JSON.parse(text) as Record<string, unknown>
  const t = (d.transaction && typeof d.transaction === 'object' ? d.transaction : d) as Record<string, unknown>
  const str = (v: unknown) => (v == null ? null : String(v))
  return {
    uuid: String(t.uuid ?? t.transaction_uuid ?? d.transaction_uuid ?? ''),
    status: String(t.status ?? '').toLowerCase(),
    amount: Number(t.amount), // "5500.00" (chaîne) ou 5500 (nombre)
    currency: String(t.currency ?? '').toUpperCase(),
    paymentMethod: str(t.payment_method),
    merchantInvoiceId: str(t.merchant_invoice_id),
    isSandbox: typeof t.is_sandbox === 'boolean' ? t.is_sandbox : null,
  }
}

export type ConfirmResult = 'completed' | 'failed' | 'pending'

/**
 * Tranche le sort d'un achat payé par carte en interrogeant CamerPay. Utilisé par le webhook
 * ET par le polling de la fiche : mêmes contrôles sur les deux chemins.
 *
 * - completed + tous les contrôles OK → 'completed' (débloque le document)
 * - failed / cancelled                → 'failed'
 * - refunded                          → achat 'refunded' (accès retiré), renvoie 'failed'
 * - pending, processing, erreur, incohérence → 'pending' (on ne débloque rien)
 *
 * recheckCompleted : le webhook revérifie aussi un achat déjà débloqué, pour enregistrer un
 * remboursement (ou une contestation) survenu après coup.
 */
export async function confirmCardPurchase(
  supabase: SupabaseClient,
  purchaseId: string,
  opts: { hintUuid?: string | null; recheckCompleted?: boolean } = {}
): Promise<ConfirmResult> {
  const { data: purchase, error } = await supabase
    .from('document_purchases')
    .select('id, amount, payment_status, payment_ref, payment_method')
    .eq('id', purchaseId)
    .maybeSingle()

  if (error || !purchase) return 'pending'
  if (purchase.payment_method !== 'camerpay') return 'pending'
  if (purchase.payment_status === 'refunded') return 'failed'
  if (purchase.payment_status === 'completed' && !opts.recheckCompleted) return 'completed'

  // uuid CamerPay : celui stocké à l'initiation ; à défaut celui annoncé par le webhook,
  // mais alors CamerPay doit confirmer que la transaction porte bien NOTRE purchase.id.
  const storedUuid: string | null = purchase.payment_ref
  const uuid = storedUuid || opts.hintUuid || null
  if (!uuid) return purchase.payment_status === 'completed' ? 'completed' : 'pending'

  let tx: CamerpayTransaction
  try {
    tx = await getCardTransaction(uuid)
  } catch (e) {
    console.warn('[CAMERPAY] confirmCardPurchase — CamerPay injoignable:', e)
    return purchase.payment_status === 'completed' ? 'completed' : 'pending'
  }

  // Contrôles d'identité communs à tous les statuts
  const sameUuid = tx.uuid === '' ? Boolean(storedUuid) : tx.uuid === uuid
  const sameInvoice = storedUuid
    ? tx.merchantInvoiceId === null || tx.merchantInvoiceId === purchase.id
    : tx.merchantInvoiceId === purchase.id // pas d'uuid stocké → contrôle strict
  if (!sameUuid || !sameInvoice) {
    console.error('[CAMERPAY] INCOHÉRENCE d’identité — rien n’est modifié', { purchaseId, uuid, recu: tx })
    return purchase.payment_status === 'completed' ? 'completed' : 'pending'
  }

  if (tx.status === 'completed') {
    if (purchase.payment_status === 'completed') return 'completed'

    const sameAmount = Number.isFinite(tx.amount) && tx.amount === Number(purchase.amount)
    const sameCurrency = tx.currency === '' || tx.currency === 'XAF'
    const sandboxOk = tx.isSandbox === null || tx.isSandbox === (modeAttendu() === 'sandbox')

    if (!sameAmount || !sameCurrency || !sandboxOk) {
      console.error('[CAMERPAY] INCOHÉRENCE — achat NON débloqué', {
        purchaseId,
        attendu: { uuid, amount: purchase.amount, mode: modeAttendu() },
        recu: tx,
      })
      return 'pending'
    }

    await supabase
      .from('document_purchases')
      .update({ payment_status: 'completed', payment_ref: uuid })
      .eq('id', purchaseId)
      .in('payment_status', ['pending', 'failed'])
    console.log(`[CAMERPAY] Achat ${purchaseId} → completed (carte)`)
    return 'completed'
  }

  if (tx.status === 'refunded') {
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'refunded' })
      .eq('id', purchaseId)
      .in('payment_status', ['pending', 'failed', 'completed'])
    console.warn(`[CAMERPAY] Achat ${purchaseId} → refunded (accès retiré)`)
    return 'failed'
  }

  if (purchase.payment_status === 'completed') return 'completed'

  if (tx.status === 'failed' || tx.status === 'cancelled') {
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'failed' })
      .eq('id', purchaseId)
      .eq('payment_status', 'pending')
    return 'failed'
  }

  return 'pending'
}
