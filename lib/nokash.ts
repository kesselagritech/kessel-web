// lib/nokash.ts — Client NOKASH (serveur uniquement) — [nokash v1] [nokash v2 : multi-pays]
// Passerelle unique de la bibliothèque web : Mobile Money (15 pays, cf. lib/nokashPays.ts),
// virement bancaire (Nigeria) ET carte bancaire.
//
// Interrupteur NEXT_PUBLIC_NOKASH (même logique que l'ancien interrupteur carte) :
//   "1"                  → NOKASH pour tous (CamPay / CamerPay masqués) ;
//   "test:adresse@mail"  → NOKASH pour CE SEUL compte (essais en production) ;
//   vide / autre         → ancien circuit (CamPay, CamerPay) inchangé.
//
// Clés (Vercel, jamais côté navigateur) : NOKASH_I_SPACE_KEY, NOKASH_APP_SPACE_KEY.
// NOKASH_MODE : "test" (clés sandbox) ou "live" (défaut). En test, NOKASH refuse le callback :
// on ne l'envoie pas, la fiche vérifie seule par interrogations successives.
//
// Flux Mobile Money : /api/nokash/initiate déclenche la demande → le client valide sur son
//   téléphone → la fiche interroge /api/campay/status (aiguillage commun lib/paiement.ts).
// Flux carte : /api/nokash/initiate renvoie la page sécurisée NOKASH (payment_url) → le client
//   y saisit sa carte → retour sur la fiche (?paiement=retour) → même vérification.
//
// RÈGLE DE SÉCURITÉ (fail-closed), identique aux anciens prestataires : on ne croit JAMAIS ce
// qu'on reçoit (callback, URL de retour). Le document n'est débloqué qu'après avoir REDEMANDÉ
// à NOKASH l'état réel de la transaction et vérifié : statut SUCCESS + même id + même orderId
// (= notre purchase.id) + même montant + achat lancé dans le mode (test / live) actuel.
// La signature du callback est donc inutile : un faux callback ne peut rien débloquer.
//
// Références : « API Payin NOKASH doc VJune 2025 » et « API Payin I_CARD Cameroon VSept 2026 ».

import { createHmac } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PaysNokash } from '@/lib/nokashPays'

/** NOKASH proposé à ce compte ? (même règle côté navigateur et serveur) */
export function nokashActif(email?: string | null): boolean {
  const v = (process.env.NEXT_PUBLIC_NOKASH || '').trim()
  if (v === '1') return true
  if (v.toLowerCase().startsWith('test:')) {
    const testeur = v.slice(5).trim().toLowerCase()
    return Boolean(testeur) && (email || '').trim().toLowerCase() === testeur
  }
  return false
}

const BASE_URL = (process.env.NOKASH_BASE_URL || 'https://api.nokash.app').replace(/\/+$/, '')

/** "live" (défaut) ou "test" : doit correspondre aux clés utilisées. */
export function modeNokash(): 'live' | 'test' {
  const m = (process.env.NOKASH_MODE || 'live').trim().toLowerCase()
  return m === 'test' || m === 'sandbox' ? 'test' : 'live'
}

/** Préfixe posé sur payment_ref pour un achat lancé avec les clés de test. */
const PREFIXE_TEST = 'test:'

function cles(): { iSpace: string; appSpace: string } {
  const iSpace = process.env.NOKASH_I_SPACE_KEY
  const appSpace = process.env.NOKASH_APP_SPACE_KEY
  if (!iSpace || !appSpace) throw new NokashError(500, 'Clés NOKASH manquantes')
  return { iSpace, appSpace }
}

export class NokashError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

// ─── Données client ──────────────────────────────────────────────────────────


/** Nom accepté par NOKASH pour la carte : lettres, chiffres, espaces (accents retirés). */
export function nettoyerNom(brut: string): string {
  return String(brut || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
}

// ─── Appels API ──────────────────────────────────────────────────────────────

type ReponseNokash = { status?: string; message?: string; data?: Record<string, unknown> | null }

async function appeler(url: string, init: RequestInit, etiquette: string): Promise<ReponseNokash> {
  const res = await fetch(url, { ...init, cache: 'no-store' })
  const text = await res.text()
  let json: ReponseNokash
  try {
    json = JSON.parse(text)
  } catch {
    console.error(`[NOKASH] ${etiquette} ${res.status} — réponse illisible:`, text.slice(0, 300))
    throw new NokashError(502, 'NOKASH : réponse illisible')
  }
  if (!res.ok) {
    console.error(`[NOKASH] ${etiquette} ${res.status}:`, text.slice(0, 500))
  }
  return json
}

/** Signature HMAC facultative (NOKASH_HMAC = "sha256-hex" | "sha256-base64"), Mobile Money seulement. */
function signature(orderId: string, amount: number, phone: string, iSpace: string, appSpace: string): string | null {
  const algo = (process.env.NOKASH_HMAC || '').trim().toLowerCase()
  if (algo !== 'sha256-hex' && algo !== 'sha256-base64') return null
  const h = createHmac('sha256', iSpace).update(`${orderId}:${amount}:${phone}:${appSpace}`)
  return algo === 'sha256-hex' ? h.digest('hex') : h.digest('base64')
}

/** Compte bancaire temporaire à créditer (Nigeria). */
export type Virement = {
  banque: string | null
  codeBanque: string | null
  compte: string
  expireLe: string | null
}

export type Lancement = {
  /** id NOKASH à mémoriser dans payment_ref (préfixé « test: » en mode test) */
  paymentRef: string
  /** page de paiement NOKASH (carte uniquement) */
  paymentUrl: string | null
  /** compte à créditer (virement Nigeria uniquement) */
  virement: Virement | null
}

/** Lance un paiement Mobile Money, virement ou carte. Lève NokashError si NOKASH refuse. */
export async function lancerPaiement(params: {
  moyen: 'momo' | 'carte' | 'virement'
  purchaseId: string
  /** montant ENTIER dans la monnaie du pays (XAF pour la carte) */
  amount: number
  callbackUrl: string
  /** pays de paiement (Mobile Money / virement) ; la carte est toujours émise côté Cameroun */
  pays?: PaysNokash
  operateur?: string
  telephone?: string
  nom?: string
  email?: string
}): Promise<Lancement> {
  const { iSpace, appSpace } = cles()
  const mode = modeNokash()

  const body: Record<string, unknown> = {
    i_space_key: iSpace,
    app_space_key: appSpace,
    country: params.moyen === 'carte' ? 'CM' : params.pays?.code,
    order_id: params.purchaseId, // notre purchase.id : unique par tentative
    amount: String(params.amount), // entier, dans la monnaie du pays
  }
  // Callback réservé aux clés de production : en test, NOKASH le refuse.
  if (mode === 'live') body.callback_url = params.callbackUrl

  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' }

  if (params.moyen === 'momo') {
    const p = params.pays
    if (!p || p.mode !== 'momo') throw new NokashError(400, 'Pays requis')
    if (!params.operateur || !p.operateurs.some((o) => o.code === params.operateur)) {
      throw new NokashError(400, 'Opérateur inconnu pour ce pays')
    }
    if (!params.telephone) throw new NokashError(400, 'Numéro requis')
    body.payment_method = params.operateur
    body.payment_type = p.type
    // Essais sandbox 20/10/2026 : hors Cameroun, NOKASH exige la monnaie (« currency is invalid »
    // sans elle au Gabon / Congo). Le Cameroun reste tel qu'il a été validé en réel.
    if (p.code !== 'CM') body.currency = p.monnaie
    body.user_data = { user_phone: params.telephone }
    const sig = signature(params.purchaseId, params.amount, params.telephone, iSpace, appSpace)
    if (sig) headers['hmac-signature'] = sig
  } else if (params.moyen === 'virement') {
    const p = params.pays
    if (!p || p.mode !== 'virement') throw new NokashError(400, 'Pays requis')
    if (!params.nom || !params.email) throw new NokashError(400, 'Nom et e-mail requis')
    body.payment_method = p.operateurs[0].code
    body.payment_type = p.type
    body.currency = p.monnaie
    body.user_data = { user_name: params.nom, user_email: params.email }
  } else {
    if (!params.nom || !params.email) throw new NokashError(400, 'Nom et e-mail requis')
    body.payment_method = 'I_CARD'
    body.payment_type = 'CM_I_CARD'
    body.user_data = { user_name: params.nom, user_email: params.email }
  }

  const r = await appeler(
    `${BASE_URL}/lapas-on-trans/trans/api-payin-request/407`,
    { method: 'POST', headers, body: JSON.stringify(body) },
    `payin ${params.moyen}`
  )

  const data = r.data && typeof r.data === 'object' ? r.data : null
  const id = data && data.id != null ? String(data.id) : ''
  if (r.status !== 'REQUEST_OK' || !id) {
    console.error('[NOKASH] payin refusé:', { status: r.status, message: r.message })
    throw new NokashError(r.status === 'REQUEST_BAD_INFOS' ? 400 : 502, r.message || 'NOKASH : paiement refusé')
  }

  let paymentUrl: string | null = null
  if (params.moyen === 'carte') {
    const url = data?.payment_url != null ? String(data.payment_url) : ''
    if (!url) {
      // Constat sandbox (20/10/2026) : pas de payment_url, le statut est simulé côté NOKASH.
      // En test, la fiche passe directement à la vérification ; en live, c'est une erreur.
      if (mode !== 'test') throw new NokashError(502, 'NOKASH : pas de page de paiement')
    } else {
      // On n'envoie le client que vers NOKASH lui-même (protection contre une URL détournée).
      const host = new URL(url).host.toLowerCase()
      const ok = ['nokash.co', 'nokash.app'].some((d) => host === d || host.endsWith(`.${d}`))
      if (!ok || !url.startsWith('https://')) {
        throw new NokashError(502, `NOKASH : page de paiement sur un hôte inattendu (${host})`)
      }
      paymentUrl = url
    }
  }

  let virement: Virement | null = null
  if (params.moyen === 'virement') {
    const s = (v: unknown) => (v == null || v === '' ? null : String(v))
    const compte = s(data?.va_account_number)
    if (!compte) throw new NokashError(502, 'NOKASH : pas de compte de virement')
    virement = {
      banque: s(data?.va_bank_name),
      codeBanque: s(data?.va_bank_code),
      compte,
      expireLe: s(data?.va_expiry_date_in_utc),
    }
  }

  return { paymentRef: mode === 'test' ? `${PREFIXE_TEST}${id}` : id, paymentUrl, virement }
}

export type NokashTransaction = {
  id: string
  orderId: string | null
  status: string // PENDING | SUCCESS | FAILED | CANCELED | TIMEOUT
  amount: number
  statusReason: string | null
}

/** Interroge NOKASH sur l'état réel d'une transaction (source de vérité). null = inconnue. */
export async function lireTransaction(id: string): Promise<NokashTransaction | null> {
  const r = await appeler(
    `${BASE_URL}/lapas-on-trans/trans/310/status-request?transaction_id=${encodeURIComponent(id)}`,
    { method: 'POST', headers: { Accept: 'application/json' } },
    'status'
  )
  if (r.status !== 'REQUEST_OK' || !r.data || typeof r.data !== 'object') return null
  const d = r.data
  const str = (v: unknown) => (v == null ? null : String(v))
  return {
    id: String(d.id ?? ''),
    orderId: str(d.orderId ?? d.order_id),
    status: String(d.status ?? '').toUpperCase(),
    amount: Number(d.amount), // "5000" (chaîne) ou 5000 (nombre)
    statusReason: str(d.statusReason),
  }
}

// ─── Verdict ─────────────────────────────────────────────────────────────────

export type ConfirmResult = 'completed' | 'failed' | 'pending'

const ECHECS_DEFINITIFS = new Set(['FAILED', 'CANCELED', 'CANCELLED', 'TIMEOUT'])

/**
 * Tranche le sort d'un achat NOKASH. Utilisé par le callback ET par le polling de la fiche :
 * mêmes contrôles sur les deux chemins.
 *
 * - SUCCESS + tous les contrôles OK          → 'completed' (débloque le document)
 * - FAILED / CANCELED / TIMEOUT (définitifs)  → 'failed'
 * - PENDING, inconnu, erreur, incohérence     → 'pending' (on ne débloque rien)
 */
export async function confirmNokashPurchase(
  supabase: SupabaseClient,
  purchaseId: string,
  hintId?: string | null
): Promise<ConfirmResult> {
  const { data: purchase, error } = await supabase
    .from('document_purchases')
    .select('id, amount, pay_amount, payment_status, payment_ref, payment_method')
    .eq('id', purchaseId)
    .maybeSingle()

  if (error || !purchase) return 'pending'
  if (purchase.payment_method !== 'nokash') return 'pending'
  // Montant attendu : celui réellement demandé à NOKASH (monnaie du pays), sinon le prix FCFA
  const attendu = Number(purchase.pay_amount ?? purchase.amount)
  if (purchase.payment_status === 'completed') return 'completed'
  if (purchase.payment_status === 'refunded') return 'failed'

  // id NOKASH : celui stocké au lancement ; à défaut celui annoncé par le callback (mode
  // courant), mais NOKASH doit alors confirmer que la transaction porte bien NOTRE purchase.id.
  const storedRef: string | null = purchase.payment_ref
  const hint = hintId && /^[A-Za-z0-9_-]{6,80}$/.test(hintId) ? hintId : null
  const ref = storedRef || (hint ? (modeNokash() === 'test' ? `${PREFIXE_TEST}${hint}` : hint) : null)
  if (!ref) return purchase.payment_status === 'failed' ? 'failed' : 'pending'

  // Un achat lancé avec les clés de test ne peut jamais débloquer quoi que ce soit en live
  // (et inversement) : on le classe en échec.
  const achatTest = ref.startsWith(PREFIXE_TEST)
  if (achatTest !== (modeNokash() === 'test')) {
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'failed' })
      .eq('id', purchaseId)
      .eq('payment_status', 'pending')
    return 'failed'
  }
  const id = achatTest ? ref.slice(PREFIXE_TEST.length) : ref

  let tx: NokashTransaction | null
  try {
    tx = await lireTransaction(id)
  } catch (e) {
    console.warn('[NOKASH] confirmNokashPurchase — NOKASH injoignable:', e)
    return purchase.payment_status === 'failed' ? 'failed' : 'pending'
  }
  if (!tx) return purchase.payment_status === 'failed' ? 'failed' : 'pending'

  // Contrôles d'identité : la transaction doit être LA NÔTRE
  const sameId = tx.id === id
  const sameOrder = tx.orderId === purchase.id
  if (!sameId || !sameOrder) {
    console.error('[NOKASH] INCOHÉRENCE d’identité — rien n’est modifié', { purchaseId, id, recu: tx })
    return 'pending'
  }

  if (tx.status === 'SUCCESS') {
    const sameAmount = Number.isFinite(tx.amount) && tx.amount === attendu
    if (!sameAmount) {
      console.error('[NOKASH] INCOHÉRENCE de montant — achat NON débloqué', {
        purchaseId,
        attendu,
        recu: tx.amount,
      })
      return 'pending'
    }
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'completed', payment_ref: ref })
      .eq('id', purchaseId)
      .in('payment_status', ['pending', 'failed'])
    console.log(`[NOKASH] Achat ${purchaseId} → completed`)
    return 'completed'
  }

  if (ECHECS_DEFINITIFS.has(tx.status)) {
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'failed' })
      .eq('id', purchaseId)
      .eq('payment_status', 'pending')
    return 'failed'
  }

  return 'pending'
}
