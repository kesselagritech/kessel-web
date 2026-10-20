// lib/taux.ts — Taux de change du jour (serveur uniquement) — [nokash v2]
// Source : ExchangeRate-API, accès libre (https://www.exchangerate-api.com/docs/free) :
// mise à jour quotidienne, usage commercial permis, MENTION OBLIGATOIRE « Rates By Exchange
// Rate API » sur les pages qui affichent un prix converti, redistribution des données interdite.
// Base EUR : le FCFA y est fixe (655,957), le prix FCFA est donc converti sans dérive.
//
// FAIL-CLOSED : taux absent, périmé ou hors des bornes de vraisemblance → on refuse de vendre
// dans cette monnaie (message « momentanément indisponible ») plutôt que de vendre à un prix faux.

import { prixConverti, sansConversion, XAF_PAR_EUR, type Monnaie } from '@/lib/nokashPays'

const URL_TAUX = 'https://open.er-api.com/v6/latest/EUR'

/** Valeurs relevées le 20/10/2026 (1 EUR = …). Bornes de vraisemblance : ÷3 à ×3. */
const REFERENCE: Record<Exclude<Monnaie, 'XAF' | 'XOF'>, number> = {
  CDF: 2600.6,
  KES: 145.7,
  MZN: 71.6,
  NGN: 1494.6,
  RWF: 1661.8,
  SLE: 27.3,
}

export class TauxIndisponible extends Error {}

type Taux = { rates: Record<string, number>; maj: number }

async function lireTaux(): Promise<Taux> {
  // Mis en cache 6 h par Next (la source ne change qu'une fois par jour)
  const res = await fetch(URL_TAUX, { next: { revalidate: 21600 } })
  if (!res.ok) throw new TauxIndisponible(`taux HTTP ${res.status}`)
  const d = (await res.json()) as { result?: string; rates?: Record<string, number>; time_last_update_unix?: number }
  if (d.result !== 'success' || !d.rates) throw new TauxIndisponible('taux : réponse invalide')
  // Contrôle de cohérence de la source : la parité FCFA/euro est fixe
  if (Math.abs(Number(d.rates.XAF) - XAF_PAR_EUR) > 0.5) throw new TauxIndisponible('taux : parité FCFA incohérente')
  const maj = Number(d.time_last_update_unix) * 1000
  if (!Number.isFinite(maj) || Date.now() - maj > 4 * 24 * 3600 * 1000) throw new TauxIndisponible('taux périmés')
  return { rates: d.rates, maj }
}

function tauxValide(m: keyof typeof REFERENCE, v: unknown): number {
  const t = Number(v)
  const ref = REFERENCE[m]
  if (!Number.isFinite(t) || t < ref / 3 || t > ref * 3) throw new TauxIndisponible(`taux ${m} invraisemblable : ${v}`)
  return t
}

/** Prix à demander dans la monnaie du pays (entier). XAF / XOF : prix FCFA inchangé. */
export async function prixLocal(prixXaf: number, monnaie: Monnaie): Promise<number> {
  if (sansConversion(monnaie)) return prixXaf
  const { rates } = await lireTaux()
  const m = monnaie as keyof typeof REFERENCE
  return prixConverti(prixXaf, tauxValide(m, rates[m]))
}

/** Prix dans toutes les monnaies (pour l'affichage). Une monnaie sans taux fiable vaut null. */
export async function grilleDePrix(prixXaf: number): Promise<Record<Monnaie, number | null>> {
  const grille: Record<Monnaie, number | null> = {
    XAF: prixXaf, XOF: prixXaf, CDF: null, KES: null, MZN: null, NGN: null, RWF: null, SLE: null,
  }
  let taux: Taux | null = null
  try {
    taux = await lireTaux()
  } catch (e) {
    console.warn('[TAUX] indisponibles :', e)
    return grille
  }
  for (const m of Object.keys(REFERENCE) as (keyof typeof REFERENCE)[]) {
    try {
      grille[m] = prixConverti(prixXaf, tauxValide(m, taux.rates[m]))
    } catch (e) {
      console.warn('[TAUX]', e)
    }
  }
  return grille
}
