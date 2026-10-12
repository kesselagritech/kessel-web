"use client";
// app/a-propos/page.tsx — À propos v2 (mission panafricaine + bibliothèque) — [legal-v2]

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";
import { supabase } from "@/lib/supabase";

type Counts = { business_plan: number; fiche_technique: number; guide: number };

export default function AProposPage() {
  useScrollReveal();

  // Chiffres de la bibliothèque lus en direct : ils restent justes à chaque publication.
  const [counts, setCounts] = useState<Counts | null>(null);
  useEffect(() => {
    supabase
      .from("documents")
      .select("type")
      .eq("status", "published")
      .then(({ data, error }) => {
        if (error || !data) return;
        const c: Counts = { business_plan: 0, fiche_technique: 0, guide: 0 };
        for (const d of data as { type: string }[]) {
          if (d.type in c) c[d.type as keyof Counts] += 1;
        }
        setCounts(c);
      });
  }, []);

  const stats = [
    { value: counts ? String(counts.business_plan) : "—", label: "business plans" },
    { value: counts ? String(counts.fiche_technique) : "—", label: "fiches techniques" },
    { value: counts ? String(counts.guide) : "—", label: "guides éducatifs" },
    { value: "5", label: "zones agro-écologiques couvertes au Cameroun" },
  ];

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">À propos</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Un savoir agricole fiable,<br /><em className="text-amber-light">accessible à tous.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Kessel veut devenir la référence de l&apos;information agronomique fiable, structurée et sourcée pour les porteurs de
            projets agricoles en Afrique.
          </p>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Notre histoire</p>
              <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
                Du terrain<br /><em>au savoir partagé.</em>
              </h2>
              <div className="reveal reveal-delay-2 space-y-4 text-ink-mid leading-relaxed">
                <p>
                  Kessel Agritech est fondée par Atine Mvom Philippe André, technicien supérieur d&apos;agriculture, qui gère des
                  exploitations agricoles près de Kribi, dans la Région du Sud du Cameroun.
                </p>
                <p>
                  Sur le terrain, le constat est clair : l&apos;information agricole circule beaucoup, notamment sur les réseaux
                  sociaux, mais elle est rarement vérifiée, rarement chiffrée et presque jamais sourcée. Et les outils de gestion
                  existants sont trop complexes, trop chers ou inutilisables sans connexion.
                </p>
                <p>
                  Kessel répond aux deux. Sur le site, une bibliothèque de documents vérifiés et un comparateur de projets aident
                  à décider avant d&apos;investir. Sur le terrain, une application mobile gratuite, qui fonctionne même sans
                  internet, aide à piloter ses projets au Cameroun.
                </p>
              </div>
            </div>
            <div className="reveal reveal-delay-3 bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ fontFamily: "var(--serif)" }}>
                  AM
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>Atine Mvom Philippe André</h3>
                  <p className="text-ink-light">Fondateur de Kessel Agritech</p>
                </div>
              </div>
              <p className="text-ink-mid leading-relaxed italic">
                « Je voulais créer l&apos;outil que j&apos;aurais aimé avoir quand j&apos;ai commencé à accompagner des promoteurs. Un
                outil qui parle leur langue, qui comprend leurs contraintes, et qui les aide vraiment à réussir. »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Nos valeurs</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Ce qui nous<br /><em>guide.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Fiabilité", desc: "Chaque donnée de nos documents est vérifiée et sourcée. Quand un chiffre est une estimation, nous le disons.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Proximité terrain", desc: "Nos contenus et notre application sont pensés pour la réalité des exploitations africaines, pas pour un bureau climatisé.", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
              { title: "Accessibilité", desc: "Application gratuite et utilisable hors connexion, documents à petit prix payables par Mobile Money, en français et en anglais.", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
            ].map((value, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="w-16 h-16 bg-forest-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>{value.title}</h3>
                <p className="text-ink-light leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Kessel en chiffres</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>
              Une base solide<br /><em className="text-amber-light">pour grandir.</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--serif)" }}>{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
            Rejoignez l&apos;aventure<br /><em>Kessel.</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-ink-mid mb-10">
            Préparez votre projet avec la bibliothèque, puis pilotez-le sur le terrain avec l&apos;application.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bibliotheque" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Explorer la bibliothèque
            </Link>
            <Link href="/application" className="inline-flex items-center justify-center gap-2 border-2 border-forest text-forest hover:bg-forest-light font-semibold px-8 py-4 rounded-xl transition-colors">
              Découvrir l&apos;application
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
