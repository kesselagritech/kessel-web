// lib/telephone.ts — [bibliotheque-compte v2] Pays + numéro de téléphone exigés pour lire la bibliothèque.
// Enregistrés dans les métadonnées du compte du site : user_metadata.pays (code ISO, ex. « CM »)
// et user_metadata.telephone (format international, ex. « +237655000000 »).
// La base (fonction get_document_content) applique la même règle.

import type { User } from "@supabase/supabase-js";

export type Pays = { code: string; nom: string; indicatif: string };

// Pays où le 0 de tête fait partie du numéro, même à l'international (on ne le retire pas).
const GARDE_LE_ZERO = new Set(["CI", "BJ", "CG", "GA"]);

const LISTE: Pays[] = [
  // Afrique centrale
  { code: "CM", nom: "Cameroun", indicatif: "237" },
  { code: "GA", nom: "Gabon", indicatif: "241" },
  { code: "CG", nom: "Congo", indicatif: "242" },
  { code: "CD", nom: "RD Congo", indicatif: "243" },
  { code: "TD", nom: "Tchad", indicatif: "235" },
  { code: "CF", nom: "Centrafrique", indicatif: "236" },
  { code: "GQ", nom: "Guinée équatoriale", indicatif: "240" },
  { code: "ST", nom: "Sao Tomé-et-Principe", indicatif: "239" },
  // Afrique de l'Ouest
  { code: "CI", nom: "Côte d'Ivoire", indicatif: "225" },
  { code: "SN", nom: "Sénégal", indicatif: "221" },
  { code: "BF", nom: "Burkina Faso", indicatif: "226" },
  { code: "ML", nom: "Mali", indicatif: "223" },
  { code: "NE", nom: "Niger", indicatif: "227" },
  { code: "TG", nom: "Togo", indicatif: "228" },
  { code: "BJ", nom: "Bénin", indicatif: "229" },
  { code: "GN", nom: "Guinée", indicatif: "224" },
  { code: "GW", nom: "Guinée-Bissau", indicatif: "245" },
  { code: "NG", nom: "Nigeria", indicatif: "234" },
  { code: "GH", nom: "Ghana", indicatif: "233" },
  { code: "LR", nom: "Liberia", indicatif: "231" },
  { code: "SL", nom: "Sierra Leone", indicatif: "232" },
  { code: "GM", nom: "Gambie", indicatif: "220" },
  { code: "CV", nom: "Cap-Vert", indicatif: "238" },
  { code: "MR", nom: "Mauritanie", indicatif: "222" },
  // Afrique de l'Est, australe, océan Indien
  { code: "RW", nom: "Rwanda", indicatif: "250" },
  { code: "BI", nom: "Burundi", indicatif: "257" },
  { code: "KE", nom: "Kenya", indicatif: "254" },
  { code: "UG", nom: "Ouganda", indicatif: "256" },
  { code: "TZ", nom: "Tanzanie", indicatif: "255" },
  { code: "ET", nom: "Éthiopie", indicatif: "251" },
  { code: "DJ", nom: "Djibouti", indicatif: "253" },
  { code: "MG", nom: "Madagascar", indicatif: "261" },
  { code: "MU", nom: "Maurice", indicatif: "230" },
  { code: "KM", nom: "Comores", indicatif: "269" },
  { code: "ZA", nom: "Afrique du Sud", indicatif: "27" },
  { code: "AO", nom: "Angola", indicatif: "244" },
  { code: "ZM", nom: "Zambie", indicatif: "260" },
  { code: "MZ", nom: "Mozambique", indicatif: "258" },
  // Afrique du Nord
  { code: "MA", nom: "Maroc", indicatif: "212" },
  { code: "DZ", nom: "Algérie", indicatif: "213" },
  { code: "TN", nom: "Tunisie", indicatif: "216" },
  { code: "EG", nom: "Égypte", indicatif: "20" },
  // Diaspora
  { code: "FR", nom: "France", indicatif: "33" },
  { code: "BE", nom: "Belgique", indicatif: "32" },
  { code: "CH", nom: "Suisse", indicatif: "41" },
  { code: "DE", nom: "Allemagne", indicatif: "49" },
  { code: "IT", nom: "Italie", indicatif: "39" },
  { code: "ES", nom: "Espagne", indicatif: "34" },
  { code: "GB", nom: "Royaume-Uni", indicatif: "44" },
  { code: "CA", nom: "Canada", indicatif: "1" },
  { code: "US", nom: "États-Unis", indicatif: "1" },
  { code: "CN", nom: "Chine", indicatif: "86" },
];

/** Cameroun en tête, puis ordre alphabétique. */
export const PAYS: Pays[] = [
  LISTE[0],
  ...LISTE.slice(1).sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
];

export function paysParCode(code: string | null | undefined): Pays | null {
  return PAYS.find((p) => p.code === code) ?? null;
}

/**
 * Construit le numéro international à partir du pays choisi et du numéro saisi.
 * Renvoie { telephone } ou { erreur } (message prêt à afficher).
 */
export function normaliserTelephone(
  brut: string,
  codePays: string,
): { telephone: string; erreur?: undefined } | { telephone?: undefined; erreur: string } {
  const pays = paysParCode(codePays);
  if (!pays) return { erreur: "Choisis d'abord ton pays." };

  const s = brut.trim();
  let chiffres = s.replace(/\D/g, "");
  if (!chiffres) return { erreur: "Saisis ton numéro de téléphone." };

  let national: string;
  if (s.startsWith("+") || chiffres.startsWith("00")) {
    if (chiffres.startsWith("00")) chiffres = chiffres.slice(2);
    if (!chiffres.startsWith(pays.indicatif)) {
      return { erreur: `Ce numéro ne commence pas par +${pays.indicatif} (${pays.nom}). Vérifie le pays choisi.` };
    }
    national = chiffres.slice(pays.indicatif.length);
  } else {
    national = chiffres;
    // Numéro saisi avec l'indicatif mais sans « + »
    if (national.startsWith(pays.indicatif) && national.length > pays.indicatif.length + 7) {
      national = national.slice(pays.indicatif.length);
    }
    if (!GARDE_LE_ZERO.has(pays.code) && national.startsWith("0")) national = national.slice(1);
  }

  if (pays.code === "CM" && !/^[26]\d{8}$/.test(national)) {
    return { erreur: "Numéro camerounais invalide : 9 chiffres, par exemple 6XX XX XX XX." };
  }
  const total = pays.indicatif.length + national.length;
  if (national.length < 6 || total < 8 || total > 15) {
    return { erreur: "Numéro invalide : vérifie le nombre de chiffres." };
  }
  return { telephone: "+" + pays.indicatif + national };
}

/** Pays + numéro enregistrés sur le compte, ou null s'il en manque un. */
export function coordonneesDuCompte(
  user: User | null | undefined,
): { pays: string; telephone: string } | null {
  const t = user?.user_metadata?.telephone;
  const p = user?.user_metadata?.pays;
  if (typeof t !== "string" || !/^\+[0-9]{8,15}$/.test(t)) return null;
  if (typeof p !== "string" || !/^[A-Z]{2}$/.test(p)) return null;
  return { pays: p, telephone: t };
}
