// lib/nokashPays.ts — Pays ouverts au paiement NOKASH — [nokash v2]
// Fichier partagé navigateur + serveur : AUCUN secret ici.
// Source : GET https://api.nokash.app/lapas-on-trans/transaction-options/payin?country=XX
// (relevé du 20/10/2026), puis essais sandbox du 20/10/2026 par pays et par opérateur :
//   - Gabon, Congo : acceptés seulement si « currency » est précisée (sinon « currency is invalid »).
//   - Orange Money en Côte d'Ivoire, Sénégal, Burkina Faso, Mali : exige « om_otp » (code que le
//     client génère par USSD) → masqué tant que NOKASH n'a pas fourni la procédure.
//   - Moov Sénégal : « Server error » côté NOKASH → masqué.
//   - RD Congo, Kenya, Mozambique, Rwanda, Sierra Leone : « Code pays envoyé non reconnue » →
//     pays non activés sur le compte ; Nigeria : aucun compte de virement renvoyé → en attente.
//   - Centrafrique, Tchad, Guinée équatoriale : aucun opérateur côté API.
// Les pays en attente sont dans PAYS_EN_ATTENTE : les déplacer dans PAYS_NOKASH suffit à les ouvrir.

export type Monnaie = 'XAF' | 'XOF' | 'CDF' | 'KES' | 'MZN' | 'NGN' | 'RWF' | 'SLE'

export type PaysNokash = {
  code: string
  nom: string
  indicatif: string
  monnaie: Monnaie
  /** payment_type NOKASH */
  type: string
  /** 'momo' = demande sur le téléphone ; 'virement' = compte bancaire temporaire (Nigeria) */
  mode: 'momo' | 'virement'
  operateurs: { code: string; nom: string }[]
  /** Longueur du numéro national tel que NOKASH l'attend après l'indicatif */
  chiffres: number
  /** true : le 0 de tête fait partie du numéro (Côte d'Ivoire, Congo, Bénin) ; false : 0 local à retirer */
  zeroInclus: boolean
  exemple: string
}

const op = (code: string, nom: string) => ({ code, nom })

/** Pays ouverts à l'achat (tous en zone FCFA au 20/10/2026). */
export const PAYS_NOKASH: PaysNokash[] = [
  // ── Zone FCFA d'Afrique centrale (XAF) ──
  { code: 'CM', nom: 'Cameroun', indicatif: '237', monnaie: 'XAF', type: 'CM_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MTN_MOMO', 'MTN MoMo'), op('ORANGE_MONEY', 'Orange Money')], chiffres: 9, zeroInclus: false, exemple: '6 77 12 34 56' },
  { code: 'GA', nom: 'Gabon', indicatif: '241', monnaie: 'XAF', type: 'GA_MOBILEMONEY', mode: 'momo',
    operateurs: [op('AIRTEL_MONEY', 'Airtel Money'), op('MOOV', 'Moov Money')], chiffres: 8, zeroInclus: false, exemple: '077 12 34 56' },
  { code: 'CG', nom: 'Congo', indicatif: '242', monnaie: 'XAF', type: 'CG_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MTN_MOMO', 'MTN MoMo'), op('AIRTEL_MONEY', 'Airtel Money')], chiffres: 9, zeroInclus: true, exemple: '06 123 4567' },
  // ── Zone FCFA d'Afrique de l'Ouest (XOF, même valeur que le XAF) ──
  { code: 'CI', nom: "Côte d'Ivoire", indicatif: '225', monnaie: 'XOF', type: 'CI_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MTN_MOMO', 'MTN MoMo'), op('WAVE', 'Wave'), op('MOOV', 'Moov Money')], chiffres: 10, zeroInclus: true, exemple: '07 07 12 34 56' },
  { code: 'SN', nom: 'Sénégal', indicatif: '221', monnaie: 'XOF', type: 'SN_MOBILEMONEY', mode: 'momo',
    operateurs: [op('FREE_MONEY', 'Free Money')], chiffres: 9, zeroInclus: false, exemple: '76 123 45 67' },
  { code: 'BJ', nom: 'Bénin', indicatif: '229', monnaie: 'XOF', type: 'BJ_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MTN_MOMO', 'MTN MoMo'), op('MOOV', 'Moov Money')], chiffres: 10, zeroInclus: true, exemple: '01 97 12 34 56' },
  { code: 'BF', nom: 'Burkina Faso', indicatif: '226', monnaie: 'XOF', type: 'BF_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MOOV', 'Moov Money')], chiffres: 8, zeroInclus: false, exemple: '70 12 34 56' },
  { code: 'ML', nom: 'Mali', indicatif: '223', monnaie: 'XOF', type: 'ML_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MOOV', 'Moov Money')], chiffres: 8, zeroInclus: false, exemple: '66 12 34 56' },
  { code: 'TG', nom: 'Togo', indicatif: '228', monnaie: 'XOF', type: 'TG_MOBILEMONEY', mode: 'momo',
    operateurs: [op('T_MONEY', 'T-Money'), op('MOOV', 'Moov Money')], chiffres: 8, zeroInclus: false, exemple: '90 12 34 56' },
]

/** Pays prévus mais NON activés côté NOKASH (voir en-tête). Code de conversion prêt (lib/taux.ts). */
export const PAYS_EN_ATTENTE: PaysNokash[] = [
  // ── Hors zone FCFA (prix converti au taux du jour) ──
  { code: 'CD', nom: 'RD Congo', indicatif: '243', monnaie: 'CDF', type: 'CD_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MPESA', 'M-Pesa'), op('AIRTEL_MONEY', 'Airtel Money'), op('ORANGE_MONEY', 'Orange Money')], chiffres: 9, zeroInclus: false, exemple: '081 234 5678' },
  { code: 'KE', nom: 'Kenya', indicatif: '254', monnaie: 'KES', type: 'KE_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MPESA', 'M-Pesa')], chiffres: 9, zeroInclus: false, exemple: '0712 345 678' },
  { code: 'MZ', nom: 'Mozambique', indicatif: '258', monnaie: 'MZN', type: 'MZ_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MPESA', 'M-Pesa')], chiffres: 9, zeroInclus: false, exemple: '84 123 4567' },
  { code: 'RW', nom: 'Rwanda', indicatif: '250', monnaie: 'RWF', type: 'RW_MOBILEMONEY', mode: 'momo',
    operateurs: [op('MTN_MOMO', 'MTN MoMo'), op('AIRTEL_MONEY', 'Airtel Money')], chiffres: 9, zeroInclus: false, exemple: '078 123 4567' },
  { code: 'SL', nom: 'Sierra Leone', indicatif: '232', monnaie: 'SLE', type: 'SL_MOBILEMONEY', mode: 'momo',
    operateurs: [op('ORANGE_MONEY', 'Orange Money')], chiffres: 8, zeroInclus: false, exemple: '076 123 456' },
  { code: 'NG', nom: 'Nigeria', indicatif: '234', monnaie: 'NGN', type: 'NG_BANKTRANSFER', mode: 'virement',
    operateurs: [op('BANK_TRANSFER', 'Virement bancaire')], chiffres: 10, zeroInclus: false, exemple: '' },
]

export function paysNokash(code?: string | null): PaysNokash | null {
  const c = (code || '').trim().toUpperCase()
  return PAYS_NOKASH.find((p) => p.code === c) ?? null
}

/** Monnaies de même valeur que le FCFA d'Afrique centrale : aucun taux, prix identique. */
export function sansConversion(m: Monnaie): boolean {
  return m === 'XAF' || m === 'XOF'
}

/** Numéro saisi → format NOKASH « indicatif + numéro national ». null si invalide. */
export function normaliserNumero(pays: PaysNokash, brut: string): string | null {
  let d = String(brut || '').replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith(pays.indicatif) && d.length >= pays.indicatif.length + pays.chiffres) {
    d = d.slice(pays.indicatif.length)
  }
  if (!pays.zeroInclus && d.length === pays.chiffres + 1 && d.startsWith('0')) d = d.slice(1)
  if (d.length !== pays.chiffres) return null
  if (pays.zeroInclus && !d.startsWith('0')) return null
  if (pays.code === 'CM' && !d.startsWith('6')) return null
  return `${pays.indicatif}${d}`
}

/** Arrondi supérieur à un montant rond : 1 sous 100, 10 sous 10 000, 100 sous 100 000, 1 000 au-delà
 *  (au-delà de 1 000, l'arrondi ajoute moins de 1 %). */
export function arrondiRond(v: number): number {
  const pas = v < 100 ? 1 : v < 10000 ? 10 : v < 100000 ? 100 : 1000
  return Math.ceil(v / pas - 1e-9) * pas
}

/** Marge appliquée aux monnaies converties (variations de taux, frais de conversion). */
export const MARGE_CONVERSION = 0.05
/** Parité fixe FCFA / euro (BEAC – BCEAO). */
export const XAF_PAR_EUR = 655.957

/** Prix en monnaie locale à partir du prix FCFA et du taux « 1 EUR = taux monnaie ». */
export function prixConverti(prixXaf: number, tauxParEur: number): number {
  return arrondiRond((prixXaf / XAF_PAR_EUR) * tauxParEur * (1 + MARGE_CONVERSION))
}
