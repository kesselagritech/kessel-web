// lib/monetbil.ts — Client Monetbil (serveur uniquement) — [monetbil-backend v1]
// Passerelle Mobile Money, remplace CamPay côté web (DEC-190-1/2).
// Flux « redirection Widget v2.1 » : on demande un lien de paiement, le client
// paie sur la page Monetbil, puis Monetbil notifie /api/monetbil/notify.
//
// Références officielles : librairie Monetbil/monetbil-php (algorithme de signature),
// doc Widget v2.1 et doc Payment Notification.

import { createHash, timingSafeEqual } from 'crypto'

const MONETBIL_WIDGET_URL = 'https://api.monetbil.com/widget/v2.1'
const MONETBIL_CHECK_URL = 'https://api.monetbil.com/payment/v1/checkPayment'

const SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY
const SERVICE_SECRET = process.env.MONETBIL_SERVICE_SECRET

// Codes de statut Monetbil (checkPayment / retour widget)
export const MONETBIL_STATUS = {
  SUCCESS: 1,
  FAILED: 0,
  CANCELLED: -1,
  SUCCESS_TESTMODE: 7,
  FAILED_TESTMODE: 8,
  CANCELLED_TESTMODE: 9,
} as const

export function isSuccessStatus(status: number): boolean {
  return status === MONETBIL_STATUS.SUCCESS || status === MONETBIL_STATUS.SUCCESS_TESTMODE
}

export function isFailedStatus(status: number): boolean {
  return (
    status === MONETBIL_STATUS.FAILED ||
    status === MONETBIL_STATUS.FAILED_TESTMODE ||
    status === MONETBIL_STATUS.CANCELLED ||
    status === MONETBIL_STATUS.CANCELLED_TESTMODE
  )
}

/**
 * Signature Monetbil — algorithme officiel (monetbil-php) :
 *   ksort(params)  →  concatène les VALEURS (sans séparateur)  →  md5(secret + concat)
 * Autrement dit : on trie les CLÉS par ordre alphabétique, puis on colle les
 * valeurs bout à bout, et on hache avec le service_secret en préfixe.
 */
export function signParams(params: Record<string, string>): string {
  if (!SERVICE_SECRET) throw new Error('MONETBIL_SERVICE_SECRET manquant')
  const concat = Object.keys(params)
    .sort()
    .map((k) => params[k])
    .join('')
  return createHash('md5').update(SERVICE_SECRET + concat).digest('hex')
}

/**
 * Vérifie la signature d'une notification Monetbil (le « sceau »).
 * On retire `sign`, on recalcule sur tout le reste, on compare en temps constant.
 * Fail-closed : la moindre anomalie renvoie false → on NE débloque PAS le document.
 */
export function verifyNotificationSign(params: Record<string, string>): boolean {
  try {
    const received = params['sign']
    if (!received) return false
    const rest: Record<string, string> = { ...params }
    delete rest['sign']
    const expected = signParams(rest)
    const a = Buffer.from(received.toLowerCase())
    const b = Buffer.from(expected.toLowerCase())
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Crée un lien de paiement hébergé par Monetbil (Widget v2.1, redirection).
 * Retourne { success, payment_url }.
 * NB : la requête est authentifiée par le service_key dans l'URL — pas de `sign`
 * sur l'aller (conforme au module officiel Prestashop et à l'exemple cURL).
 */
export async function createPayment(params: {
  amount: number
  itemRef: string
  paymentRef: string
  user?: string
  returnUrl: string
  notifyUrl: string
}): Promise<{ success: boolean; payment_url?: string }> {
  if (!SERVICE_KEY) throw new Error('MONETBIL_SERVICE_KEY manquant')

  const form = new URLSearchParams()
  form.set('amount', String(params.amount))
  form.set('currency', 'XAF')
  form.set('country', 'CM')
  form.set('locale', 'fr')
  form.set('item_ref', params.itemRef)
  form.set('payment_ref', params.paymentRef)
  if (params.user) form.set('user', params.user)
  form.set('return_url', params.returnUrl)
  form.set('notify_url', params.notifyUrl)

  const res = await fetch(`${MONETBIL_WIDGET_URL}/${SERVICE_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[MONETBIL] widget ${res.status}:`, body)
    throw new Error(`Monetbil ${res.status}: ${body}`)
  }
  return res.json()
}

/**
 * Extrait l'identifiant de paiement (paymentId) depuis le payment_url.
 *   payment_url = https://api.monetbil.com/pay/v2.1/<paymentId>
 * ⚠️ À confirmer en sandbox : que ce token == paymentId attendu par checkPayment.
 * (Peu risqué : le webhook reste la source de vérité ; checkPayment n'est qu'un
 *  filet de secours pour le polling.)
 */
export function extractPaymentId(paymentUrl: string): string {
  return paymentUrl.split('/').filter(Boolean).pop() || ''
}

/**
 * Vérifie l'état d'un paiement côté serveur (POST checkPayment).
 * Réponse Monetbil : { transaction: { status, testmode, ... } }.
 */
export async function checkPayment(
  paymentId: string
): Promise<{ status: number; testmode: number }> {
  const form = new URLSearchParams()
  form.set('paymentId', paymentId)

  const res = await fetch(MONETBIL_CHECK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[MONETBIL] checkPayment ${res.status}:`, body)
    throw new Error(`Monetbil checkPayment ${res.status}: ${body}`)
  }
  const data = await res.json()
  const tx = data?.transaction || {}
  return { status: Number(tx.status), testmode: Number(tx.testmode) }
}
