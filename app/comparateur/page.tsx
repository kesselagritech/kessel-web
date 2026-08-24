"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Wheat,
  Wallet,
  Clock,
  TrendingUp,
  BarChart2,
  Receipt,
  AlertTriangle,
  ArrowRight,
  ArrowLeftRight,
  ChevronDown,
  Lightbulb,
  Check,
  BookOpen,
} from "lucide-react";

/* ────────────────────────────────────────────
   Types
──────────────────────────────────────────── */

interface KPI {
  key: string;
  label: string;
  value: string;
  raw: number | null;
  icon?: string;
}

interface Speculation {
  id: string;
  title: string;
  slug: string;
  price: number;
  kpis: KPI[];
}

/* ────────────────────────────────────────────
   Icônes
──────────────────────────────────────────── */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  Clock,
  Wheat,
  Receipt,
  BarChart2,
  TrendingUp,
  AlertTriangle,
};

function KpiIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? iconMap[name] : null;
  return Icon ? <Icon className={className} /> : null;
}

/* ────────────────────────────────────────────
   Métadonnées par indicateur
   sens "higher" : valeur haute = avantage
   sens "lower"  : valeur basse = avantage
   sens "text"   : pas de comparaison chiffrée
──────────────────────────────────────────── */

type Sens = "higher" | "lower" | "text";

const KPI_META: Record<string, { sens: Sens; intro: string }> = {
  capital: {
    sens: "lower",
    intro:
      "Le capital minimum, c'est la somme à réunir avant de planter le premier pied. Plus il est bas, plus la culture est accessible à petit budget.",
  },
  delai: {
    sens: "lower",
    intro:
      "Le délai avant premier revenu, c'est l'attente entre la plantation et la première rentrée d'argent. Plus il est court, plus tu récupères ta mise vite.",
  },
  rendement: {
    sens: "higher",
    intro:
      "Le rendement, c'est la quantité récoltée sur un hectare. Plus il est élevé, plus la parcelle produit — mais un gros rendement ne veut pas dire gros bénéfice si les coûts suivent.",
  },
  cout: {
    sens: "lower",
    intro:
      "Le coût de production, c'est ce que tu dépenses pour cultiver un hectare sur un cycle. Plus il est bas, moins la culture pèse sur ta trésorerie.",
  },
  marge: {
    sens: "higher",
    intro:
      "La marge brute, c'est ce qu'il te reste dans la poche après avoir payé la production, sur un hectare. C'est le vrai gain de la campagne.",
  },
  roi: {
    sens: "higher",
    intro:
      "Le ROI dit combien chaque franc investi te rapporte. Un ROI de 72 %, c'est : pour 100 000 FCFA mis, tu récupères 72 000 FCFA de bénéfice en plus de ta mise.",
  },
  risque: {
    sens: "text",
    intro:
      "Chaque culture a son talon d'Achille — le point de vigilance à surveiller. Ce n'est pas un chiffre, mais ça compte dans la décision.",
  },
};

/* ────────────────────────────────────────────
   Génération de la conclusion (gabarits)
──────────────────────────────────────────── */

interface Verdict {
  text: string;
  advantage: "A" | "B" | "equal" | "text";
}

function buildVerdict(
  key: string,
  nameA: string,
  nameB: string,
  kpiA: KPI | undefined,
  kpiB: KPI | undefined
): Verdict {
  const meta = KPI_META[key];
  if (!meta) return { text: "", advantage: "equal" };

  // Cas texte (risque)
  if (meta.sens === "text") {
    return {
      text: `${nameA} : ${kpiA?.value || "—"}. ${nameB} : ${kpiB?.value || "—"}. À évaluer selon ta zone et tes moyens de parade.`,
      advantage: "text",
    };
  }

  const rawA = kpiA?.raw ?? null;
  const rawB = kpiB?.raw ?? null;

  if (rawA === null || rawB === null) {
    return {
      text: "Données insuffisantes pour comparer cet indicateur sur ces deux cultures.",
      advantage: "equal",
    };
  }

  const bigger = Math.max(rawA, rawB);
  const smaller = Math.min(rawA, rawB);
  const ecartRelatif = bigger === 0 ? 0 : (bigger - smaller) / bigger;

  // Sous 8 % d'écart → coude à coude
  if (ecartRelatif < 0.08) {
    return {
      text: `${nameA} et ${nameB} sont au coude à coude sur ce point. La différence est trop faible pour faire pencher la balance.`,
      advantage: "equal",
    };
  }

  let winnerSide: "A" | "B";
  if (meta.sens === "higher") {
    winnerSide = rawA > rawB ? "A" : "B";
  } else {
    winnerSide = rawA < rawB ? "A" : "B";
  }
  const winnerName = winnerSide === "A" ? nameA : nameB;
  const loserName = winnerSide === "A" ? nameB : nameA;

  const phrases: Record<string, string> = {
    capital: `${winnerName} demande moins de capital de départ que ${loserName}. Si ton budget est serré, ${winnerName} est plus facile à lancer.`,
    delai: `${winnerName} rapporte plus vite que ${loserName}. Pour une trésorerie qui tourne rapidement, ${winnerName} prend l'avantage.`,
    rendement: `${winnerName} produit davantage à l'hectare que ${loserName}. À surface égale, tu récoltes plus avec ${winnerName}.`,
    cout: `${winnerName} coûte moins cher à produire que ${loserName}. Moins de dépenses engagées, moins de risque financier avec ${winnerName}.`,
    marge: `${winnerName} laisse une meilleure marge que ${loserName}. À la fin de la campagne, il te reste plus dans la poche avec ${winnerName}.`,
    roi: `${winnerName} fait mieux travailler ton argent que ${loserName}. Chaque franc investi rend davantage avec ${winnerName}.`,
  };

  return { text: phrases[key] || "", advantage: winnerSide };
}

/* ────────────────────────────────────────────
   Utilitaires
──────────────────────────────────────────── */

function cleanTitle(t: string): string {
  return t.replace(/^BP\s+/i, "").replace(/^Business\s+Plan\s+/i, "").trim();
}

const KPI_ORDER = ["capital", "delai", "rendement", "cout", "marge", "roi", "risque"];

/* ────────────────────────────────────────────
   Page
──────────────────────────────────────────── */

export default function ComparateurPage() {
  useScrollReveal();

  const [specs, setSpecs] = useState<Speculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [idA, setIdA] = useState<string>("");
  const [idB, setIdB] = useState<string>("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, slug, price, kpis, status")
        .eq("status", "published")
        .order("title");

      if (!error && data) {
        const withKpis = data.filter(
          (d) => Array.isArray(d.kpis) && d.kpis.length > 0
        ) as Speculation[];
        setSpecs(withKpis);
        if (withKpis.length >= 2) {
          setIdA(withKpis[0].id);
          setIdB(withKpis[1].id);
        } else if (withKpis.length === 1) {
          setIdA(withKpis[0].id);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const specA = useMemo(() => specs.find((s) => s.id === idA), [specs, idA]);
  const specB = useMemo(() => specs.find((s) => s.id === idB), [specs, idB]);

  const kpiByKey = (spec: Speculation | undefined, key: string): KPI | undefined =>
    spec?.kpis.find((k) => k.key === key);

  const ready = specA && specB && specA.id !== specB.id;

  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────── */}
      <section className="relative bg-forest-dark pt-24 pb-16 overflow-hidden">
        <Image
          src="/images/comparateur-hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-forest-dark/70" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute -right-[8%] -top-[15%] w-[50%] opacity-[0.06]"
            viewBox="0 0 600 600"
          >
            <polygon
              points="300,20 560,150 560,450 300,580 40,450 40,150"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">
            Outil gratuit
          </p>
          <h1
            className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--serif)" }}
          >
            Deux cultures,
            <br />
            <em className="text-amber-light">face à face.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Choisis deux spéculations et compare-les indicateur par indicateur.
            Chaque ligne t&apos;explique, en clair, ce que les chiffres veulent dire.
          </p>
        </div>
      </section>

      {/* ── SÉLECTEURS ────────────────────────── */}
      <section className="py-8 bg-neutral border-b border-neutral-mid">
        <div className="max-w-5xl mx-auto px-6">
          {loading ? (
            <p className="text-center text-ink-light">Chargement des cultures…</p>
          ) : specs.length < 2 ? (
            <p className="text-center text-ink-light">
              Il faut au moins deux business plans publiés pour comparer. Reviens bientôt !
            </p>
          ) : (
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-end">
              <div>
                <label className="block text-xs text-ink-light uppercase tracking-wide mb-2">
                  Culture A
                </label>
                <div className="relative">
                  <select
                    value={idA}
                    onChange={(e) => setIdA(e.target.value)}
                    className="w-full appearance-none pl-3 sm:pl-4 pr-10 py-3 rounded-xl bg-white border-2 border-forest/30 focus:border-forest text-forest-dark font-semibold outline-none transition-colors cursor-pointer"
                  >
                    {specs.map((s) => (
                      <option key={s.id} value={s.id} disabled={s.id === idB}>
                        {cleanTitle(s.title)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest pointer-events-none" />
                </div>
              </div>

              <div className="pb-2">
                <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ink-light uppercase tracking-wide mb-2">
                  Culture B
                </label>
                <div className="relative">
                  <select
                    value={idB}
                    onChange={(e) => setIdB(e.target.value)}
                    className="w-full appearance-none pl-3 sm:pl-4 pr-10 py-3 rounded-xl bg-white border-2 border-amber/40 focus:border-amber text-forest-dark font-semibold outline-none transition-colors cursor-pointer"
                  >
                    {specs.map((s) => (
                      <option key={s.id} value={s.id} disabled={s.id === idA}>
                        {cleanTitle(s.title)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-dark pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TABLEAU COMPARATIF ────────────────── */}
      {ready && (
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            {/* En-têtes cultures */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center py-4 rounded-xl bg-forest-light border-2 border-forest/20">
                <h2
                  className="text-xl sm:text-2xl font-bold text-forest-dark"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {cleanTitle(specA!.title)}
                </h2>
              </div>
              <div className="text-center py-4 rounded-xl bg-amber-light border-2 border-amber/30">
                <h2
                  className="text-xl sm:text-2xl font-bold text-forest-dark"
                  style={{ fontFamily: "var(--serif)" }}
                >
                  {cleanTitle(specB!.title)}
                </h2>
              </div>
            </div>

            {/* Lignes indicateurs */}
            <div className="space-y-5">
              {KPI_ORDER.map((key) => {
                const kA = kpiByKey(specA, key);
                const kB = kpiByKey(specB, key);
                if (!kA && !kB) return null;

                const meta = KPI_META[key];
                const verdict = buildVerdict(
                  key,
                  cleanTitle(specA!.title),
                  cleanTitle(specB!.title),
                  kA,
                  kB
                );

                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-neutral-mid overflow-hidden"
                  >
                    {/* Titre indicateur */}
                    <div className="flex items-center gap-2 px-5 py-3 bg-neutral border-b border-neutral-mid">
                      <KpiIcon name={kA?.icon || kB?.icon} className="w-4 h-4 text-forest" />
                      <span className="font-semibold text-forest-dark text-sm uppercase tracking-wide">
                        {kA?.label || kB?.label}
                      </span>
                    </div>

                    {/* Valeurs face à face */}
                    <div className="grid grid-cols-2">
                      <div
                        className={`px-4 py-4 text-center transition-colors ${
                          verdict.advantage === "A" ? "bg-forest-light" : "bg-white"
                        }`}
                      >
                        <span className="text-base sm:text-lg font-bold text-forest-dark">
                          {kA?.value || "—"}
                        </span>
                        {verdict.advantage === "A" && (
                          <span className="flex items-center justify-center gap-1 text-xs text-forest font-semibold mt-1">
                            <Check className="w-3 h-3" /> avantage
                          </span>
                        )}
                      </div>
                      <div
                        className={`px-4 py-4 text-center border-l border-neutral-mid transition-colors ${
                          verdict.advantage === "B" ? "bg-amber-light" : "bg-white"
                        }`}
                      >
                        <span className="text-base sm:text-lg font-bold text-forest-dark">
                          {kB?.value || "—"}
                        </span>
                        {verdict.advantage === "B" && (
                          <span className="flex items-center justify-center gap-1 text-xs text-amber-dark font-semibold mt-1">
                            <Check className="w-3 h-3" /> avantage
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note explicative */}
                    <div className="px-5 py-4 bg-forest-xlight border-t border-neutral-mid">
                      <p className="text-sm text-ink-light leading-relaxed mb-2">
                        {meta?.intro}
                      </p>
                      <p className="text-sm text-forest-dark leading-relaxed font-medium flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
                        {verdict.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Encart lecture BP complet (insere avant les CTA) */}
            <div className="mt-12 flex items-start gap-3 px-5 py-4 rounded-xl bg-forest-xlight border border-neutral-mid">
              <BookOpen className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
              <p className="text-sm text-forest-dark leading-relaxed">
                Ces chiffres offrent une première lecture, mais ils ne se comprennent pleinement qu&apos;à la lumière des business plans complets dont ils sont issus&nbsp;: hypothèses, conditions de réussite et méthode de calcul y sont détaillées.
              </p>
            </div>

            {/* CTA vers les deux BP */}
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Link
                href={`/bibliotheque/${specA!.slug}`}
                className="flex items-center justify-between gap-2 px-6 py-4 rounded-xl bg-forest hover:bg-forest-dark text-white font-semibold transition-colors"
              >
                <span>BP {cleanTitle(specA!.title)}</span>
                <span className="flex items-center gap-2 text-sm opacity-90">
                  {specA!.price.toLocaleString("fr-FR")} FCFA
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                href={`/bibliotheque/${specB!.slug}`}
                className="flex items-center justify-between gap-2 px-6 py-4 rounded-xl bg-amber hover:bg-amber-dark text-white font-semibold transition-colors"
              >
                <span>BP {cleanTitle(specB!.title)}</span>
                <span className="flex items-center gap-2 text-sm opacity-90">
                  {specB!.price.toLocaleString("fr-FR")} FCFA
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ─────────────────────────── */}
      <section className="relative py-24 bg-forest-dark overflow-hidden">
        <Image
          src="/images/cta-aerial.jpg"
          alt=""
          fill
          className="object-cover object-center"
          quality={85}
        />
        <div className="absolute inset-0 bg-forest-dark/80" />
        <svg
          className="absolute -right-[5%] -bottom-[10%] w-[40%] opacity-[0.08] z-10"
          viewBox="0 0 400 400"
        >
          <polygon
            points="200,10 370,105 370,295 200,390 30,295 30,105"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2
            className="reveal text-3xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--serif)" }}
          >
            Le comparateur éclaire,
            <br />
            <em className="text-amber-light">le business plan décide.</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Ces indicateurs donnent une première idée. Pour comprendre tous
            les contours d&apos;une spéculation, le business plan vous offre
            une vue complète sur chaque détail important.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bibliotheque"
              className="bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Consulter la bibliothèque
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
