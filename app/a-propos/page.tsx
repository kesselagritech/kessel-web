"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AProposPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">A propos</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Notre mission : democratiser<br /><em className="text-amber-light">la gestion agricole.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Kessel est ne de la conviction que chaque promoteur agricole camerounais merite des outils professionnels pour gerer ses projets.
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
                Du terrain<br /><em>a l application.</em>
              </h2>
              <div className="reveal reveal-delay-2 space-y-4 text-ink-mid leading-relaxed">
                <p>
                  Kessel est fonde par Atine Mvom Philippe Andre, technicien agricole base a Kribi dans la Region du Sud du Cameroun.
                </p>
                <p>
                  Apres des annees a accompagner des promoteurs sur le terrain, le constat etait clair : les outils de gestion existants ne sont pas adaptes aux realites camerounaises. Trop complexes, trop chers, ou simplement indisponibles hors connexion.
                </p>
                <p>
                  Kessel est ne de cette frustration. Une application simple, accessible, qui fonctionne meme sans internet, avec des prix adaptes au marche local.
                </p>
              </div>
            </div>
            <div className="reveal reveal-delay-3 bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ fontFamily: "var(--serif)" }}>
                  AM
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>Atine Mvom Philippe Andre</h3>
                  <p className="text-ink-light">Fondateur de Kessel Agritech</p>
                </div>
              </div>
              <p className="text-ink-mid leading-relaxed italic">
                "Je voulais creer l outil que j aurais aime avoir quand j ai commence a accompagner des promoteurs. Un outil qui parle leur langue, qui comprend leurs contraintes, et qui les aide vraiment a reussir."
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
              { title: "Proximite terrain", desc: "Nous connaissons les realites des agriculteurs camerounais. Chaque fonctionnalite est pensee pour le terrain, pas pour un bureau climatise.", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
              { title: "Simplicite", desc: "Pas besoin d etre un expert en informatique. Kessel est concu pour etre intuitif et accessible a tous, du promoteur debutant au technicien experimente.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Accessibilite", desc: "Application gratuite, mode hors-ligne, interface en francais et anglais. Nous supprimons les barrieres a l entree pour que chacun puisse en beneficier.", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
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
            {[
              { value: "5", label: "zones agro-ecologiques" },
              { value: "60+", label: "speculations" },
              { value: "78", label: "fiches ITK" },
              { value: "2", label: "langues" },
            ].map((stat, i) => (
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
            Rejoignez l aventure<br /><em>Kessel.</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-ink-mid mb-10">
            Telechargez l application gratuitement et commencez a gerer vos projets agricoles comme un professionnel.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#telecharger" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Telecharger l app
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-forest text-forest hover:bg-forest-light font-semibold px-8 py-4 rounded-xl transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}