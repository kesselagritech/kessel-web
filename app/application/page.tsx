"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import NarrativeSection from "@/components/NarrativeSection";

export default function ApplicationPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* ─────────────────────────────────────────────
          HERO MOCKUP — Les écrans de l'app en premier
      ───────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-6 pt-28 pb-16 bg-forest-dark">
        {/* Hexagones décoratifs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -right-[8%] -top-[10%] w-[50%] opacity-[0.04]" viewBox="0 0 600 600">
            <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute -left-[10%] -bottom-[15%] w-[40%] opacity-[0.03]" viewBox="0 0 500 500">
            <polygon points="250,15 470,135 470,365 250,485 30,365 30,135" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 text-center mb-12">
          <div className="reveal inline-flex items-center gap-2 bg-amber/15 border border-amber/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <span className="text-amber-light text-sm font-medium">Application mobile</span>
          </div>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]" style={{ fontFamily: "var(--serif)" }}>
            Votre exploitation,<br /><em className="text-amber-light">dans votre poche.</em>
          </h1>
        </div>

        {/* Mockup généré */}
        <div className="reveal reveal-delay-2 relative z-10 w-full max-w-6xl mx-auto px-4">
          <Image
            src="/images/mockup-app.png"
            alt="Application Kessel — tableau de bord, finances et calendrier"
            width={2400}
            height={1350}
            className="w-full h-auto"
            priority
            quality={90}
          />
        </div>

        {/* Flèche scroll */}
        <div className="reveal reveal-delay-3 mt-12 animate-bounce">
          <svg className="w-6 h-6 text-white/40 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          HERO TEXTE — Pitch + téléchargement
      ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden flex items-center px-[5vw] py-24 grain-overlay hero-gradient">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          quality={85}
        />
        <div className="absolute inset-0 bg-forest-dark/72" />

        <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <h2 className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6" style={{ fontFamily: "var(--serif)" }}>
            Pilotez votre projet agricole, <em className="text-amber-light">même quand vous n&apos;êtes pas là.</em>
          </h2>

          <p className="reveal reveal-delay-1 text-lg text-white/75 mb-8 max-w-xl mx-auto leading-relaxed">
            Kessel relie promoteurs et techniciens dans un seul outil mobile, pour suivre vos finances, vos tâches et le terrain en temps réel — gratuitement.
          </p>

          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://wa.me/237659374501?text=Bonjour%2C%20je%20souhaite%20installer%20l%27application%20Kessel%20Agritech%20sur%20mon%20t%C3%A9l%C3%A9phone%20Android." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger pour Android
            </Link>
            <a href="https://apps.apple.com/app/kessel/id6766951512" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-black text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>
          </div>

          <div className="reveal reveal-delay-3 grid grid-cols-3 gap-6 mt-10 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>5</div>
              <div className="text-white/50 text-sm">zones</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>60+</div>
              <div className="text-white/50 text-sm">cultures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>78</div>
              <div className="text-white/50 text-sm">fiches ITK</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NARRATIVE */}
      <NarrativeSection />

      {/* ─────────────────────────────────────────────
          FONCTIONNALITÉS
      ───────────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden mb-16 shadow-lg">
            <Image
              src="/images/desk-flatlay.jpg"
              alt="Outil de gestion agricole Kessel sur un bureau"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover object-center"
              quality={85}
            />
          </div>

          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Fonctionnalités</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Tout ce dont vous avez besoin,<br /><em>dans votre poche.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Suivi financier", desc: "Revenus, dépenses, marges. Visualisez la rentabilité de chaque projet en temps réel." },
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "Gestion des tâches", desc: "Planifiez, assignez et suivez chaque tâche. Vos techniciens les voient en temps réel." },
              { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Prix des marchés", desc: "Consultez les prix actualisés des produits agricoles sur les marchés camerounais." },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Gestion des techniciens", desc: "Invitez vos techniciens, recevez leurs rapports, suivez leurs visites terrain." },
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Itinéraires techniques", desc: "78 fiches ITK détaillées pour guider vos pratiques culturales étape par étape." },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", title: "Adapté au Cameroun", desc: "5 zones agro-écologiques, 60+ spéculations locales, interface en français et anglais." },
            ].map((feature, i) => (
              <div key={i} className={`reveal reveal-delay-${(i % 3) + 1} bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 bg-forest-light rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>{feature.title}</h3>
                <p className="text-ink-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TELECHARGEMENT LIBRE */}
      <section className="py-24 bg-forest-light relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Accès</p>
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
            Téléchargement <em>libre.</em>
          </h2>
          <p className="reveal reveal-delay-2 text-lg text-ink-mid max-w-2xl mx-auto mb-12 leading-relaxed">
            Téléchargez Kessel et utilisez toutes les fonctionnalités essentielles, sans frais ni engagement.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                title: "Sans carte bancaire",
                desc: "Aucune information de paiement n'est demandée pour commencer."
              },
              {
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                title: "Sans publicité",
                desc: "Votre attention reste sur votre exploitation, jamais sur des annonces."
              },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} bg-white p-6 rounded-2xl shadow-sm`}>
                <div className="w-12 h-12 bg-forest-light rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-forest-dark mb-2" style={{ fontFamily: "var(--serif)" }}>{item.title}</h3>
                <p className="text-ink-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          RESSOURCES LIÉES
      ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Ressources</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Pour aller <em>plus loin.</em>
            </h2>
          </div>

          <div className="reveal reveal-delay-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/guide", label: "Guide d'utilisation" },
              { href: "/zones", label: "Zones agro-écologiques" },
              { href: "/itk", label: "Itinéraires techniques" },
              { href: "/speculations", label: "Spéculations" },
              { href: "/faq", label: "FAQ" },
              { href: "/a-propos", label: "À propos" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-4 bg-forest-light rounded-xl hover:bg-forest-100 transition-colors group"
              >
                <span className="text-forest-dark font-medium">{link.label}</span>
                <svg className="w-5 h-5 text-forest-400 group-hover:text-amber group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          CTA FINAL
      ───────────────────────────────────────────── */}
      <section id="telecharger" className="relative py-24 overflow-hidden">
        <Image
          src="/images/cta-aerial.jpg"
          alt=""
          fill
          className="object-cover object-center"
          quality={85}
        />
        <div className="absolute inset-0 bg-forest-dark/70" />

        <svg className="absolute -right-[5%] -bottom-[10%] w-[40%] opacity-[0.08] pointer-events-none" viewBox="0 0 400 400">
          <polygon points="200,10 370,105 370,295 200,390 30,295 30,105" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="absolute -left-[8%] -top-[15%] w-[35%] opacity-[0.06] pointer-events-none" viewBox="0 0 300 300">
          <polygon points="150,8 278,79 278,221 150,292 22,221 22,79" stroke="white" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Prêt à reprendre la main<br /><em className="text-amber-light">sur votre exploitation ?</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Téléchargez Kessel maintenant et commencez à piloter vos projets agricoles, où que vous soyez.
          </p>

          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://wa.me/237659374501?text=Bonjour%2C%20je%20souhaite%20installer%20l%27application%20Kessel%20Agritech%20sur%20mon%20t%C3%A9l%C3%A9phone%20Android." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger pour Android
            </Link>
            <a href="https://apps.apple.com/app/kessel/id6766951512" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-black text-white font-semibold px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
