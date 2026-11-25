"use client";

// [bibliotheque-compte v2] Choix du pays puis saisie du numéro (indicatif affiché devant).
// Utilisé à l'inscription et sur la fiche document (comptes créés sans numéro).

import { Globe, Phone } from "lucide-react";
import { PAYS, paysParCode } from "@/lib/telephone";

export default function ChampTelephone({
  pays,
  onPays,
  telephone,
  onTelephone,
}: {
  pays: string;
  onPays: (code: string) => void;
  telephone: string;
  onTelephone: (v: string) => void;
}) {
  const choisi = paysParCode(pays);
  const champ =
    "w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800/20 focus:border-green-800 outline-none transition-all text-sm bg-white";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Pays</label>
        <div className="relative">
          <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={pays}
            onChange={(e) => onPays(e.target.value)}
            required
            className={`${champ} pl-10 pr-4 appearance-none`}
          >
            <option value="" disabled>
              Choisis ton pays
            </option>
            {PAYS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.nom} (+{p.indicatif})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Numéro de téléphone (WhatsApp)
        </label>
        <div className="relative">
          <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          {choisi && (
            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              +{choisi.indicatif}
            </span>
          )}
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={telephone}
            onChange={(e) => onTelephone(e.target.value)}
            required
            disabled={!choisi}
            placeholder={choisi ? (choisi.code === "CM" ? "6XX XX XX XX" : "Ton numéro") : "Choisis d'abord ton pays"}
            className={`${champ} pr-4 disabled:bg-gray-50 disabled:cursor-not-allowed`}
            style={{ paddingLeft: choisi ? `${3.4 + 0.55 * (choisi.indicatif.length + 1)}rem` : "2.5rem" }}
          />
        </div>
      </div>
    </div>
  );
}
