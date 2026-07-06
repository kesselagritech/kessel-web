// lib/campay.ts — Client CamPay (serveur uniquement)

const CAMPAY_BASE_URL = process.env.CAMPAY_BASE_URL || 'https://demo.campay.net/api'
const CAMPAY_TOKEN = process.env.CAMPAY_PERMANENT_TOKEN

async function campayFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${CAMPAY_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${CAMPAY_TOKEN}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[CAMPAY] ${res.status} ${endpoint}:`, body)
    throw new Error(`CamPay ${res.status}: ${body}`)
  }

  return res.json()
}

/** Crée un lien de paiement hébergé par CamPay */
export async function createPaymentLink(params: {
  amount: number
  description: string
  externalReference: string
  redirectUrl: string
  failureRedirectUrl: string
}) {
  return campayFetch('/get_payment_link/', {
    method: 'POST',
    body: JSON.stringify({
      amount: String(params.amount),
      currency: 'XAF',
      description: params.description,
      external_reference: params.externalReference,
      redirect_url: params.redirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
    }),
  })
}

/** Vérifie le statut d'une transaction par sa référence CamPay */
export async function getTransactionStatus(reference: string) {
  return campayFetch(`/transaction/${reference}/`)
}
