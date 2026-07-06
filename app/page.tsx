"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { BookOpen, BarChart3, Smartphone, Users, Sprout, TrendingUp, FileText, Scale, GraduationCap, Handshake } from "lucide-react";

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* ─────────────────────────────────────────────
          HERO — Kessel Agritech, la structure
      ───────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex items-center px-[5vw] pt-32 pb-16 lg:py-24 grain-overlay hero-gradient">
        <Image
          src="/images/hero-home.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-forest-dark/75" />

        {/* Hexagones décoratifs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -right-[8%] -top-[10%] w-[55%] opacity-[0.05]" viewBox="0 0 600 600">
            <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
            <polygon points="300,80 500,180 500,420 300,520 100,420 100,180" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
          <svg className="absolute -left-[10%] -bottom-[15%] w-[45%] opacity-[0.04]" viewBox="0 0 500 500">
            <polygon points="250,15 470,135 470,365 250,485 30,365 30,135" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <div className="reveal inline-flex items-center gap-2 bg-amber/15 border border-amber/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <span className="text-amber-light text-sm font-medium">Agriculture · Technologie · Cameroun</span>
          </div>

          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" style={{ fontFamily: "var(--serif)" }}>
            Le secteur agricole mérite <em className="text-amber-light">des outils à sa hauteur.</em>
          </h1>

          <p className="reveal reveal-delay-2 text-lg text-white/75 mb-8 max-w-xl mx-auto leading-relaxed">
            Kessel Agritech est une structure spécialisée dans la digitalisation et la professionnalisation du secteur agricole camerounais. Nous démocratisons les connaissances essentielles et connectons les promoteurs à des professionnels engagés.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bibliotheque" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
              <BookOpen size={20} />
              Explorer la bibliothèque
            </Link>
            <Link href="/comparateur" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-7 py-3.5 rounded-xl transition-colors">
              <BarChart3 size={20} />
              Comparer des projets
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          MISSION — 3 piliers
      ───────────────────────────────────────────── */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Notre mission</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Trois engagements pour un secteur<br /><em>qui peut faire tellement plus.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Démocratiser le savoir",
                desc: "Rendre accessibles à chaque promoteur les connaissances fondamentales — pédologie, physiologie végétale, gestion financière, formalisation — pour que l'information ne soit plus un privilège."
              },
              {
                icon: TrendingUp,
                title: "Professionnaliser le secteur",
                desc: "Fournir des outils de gestion dignes de ce nom : suivi financier, planification, itinéraires techniques. Pour que chaque projet agricole soit piloté avec rigueur, pas à l'intuition."
              },
              {
                icon: Handshake,
                title: "Connecter les acteurs",
                desc: "Mettre en relation les promoteurs avec une équipe de professionnels qui veulent voir le secteur grandir et prendre son plein essor — techniciens, agronomes, conseillers."
              },
            ].map((pillar, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 bg-forest-light rounded-xl flex items-center justify-center mb-6">
                  <pillar.icon className="w-7 h-7 text-forest" />
                </div>
                <h3 className="text-xl font-semibold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>{pillar.title}</h3>
                <p className="text-ink-light leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          CE QUE NOUS PROPOSONS — 3 offres
      ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Nos outils</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Tout ce qu&apos;il faut pour décider,<br /><em>apprendre et agir.</em>
            </h2>
          </div>

          {/* Comparateur */}
          <div className="reveal grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-2 bg-forest-light rounded-full px-4 py-1.5 mb-4">
                <Scale size={16} className="text-forest" />
                <span className="text-forest text-sm font-medium">Gratuit</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>
                Comparateur de projets
              </h3>
              <p className="text-ink-light leading-relaxed mb-4">
                Palmier à huile ou cacao ? Maraîchage ou plantain ? Comparez les spéculations sur les indicateurs qui comptent : rentabilité à long terme, seuil de rentabilité, marge par hectare, coût d&apos;opportunité.
              </p>
              <p className="text-ink-light leading-relaxed mb-6">
                Des chiffres standards issus de données recoupées, pour investir en connaissance de cause — pas sur la base d&apos;un conseil de couloir.
              </p>
              <Link href="/comparateur" className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-colors">
                <BarChart3 size={20} />
                Comparer gratuitement
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-forest-light">
              <Image
                src="/images/comparateur-preview.jpg"
                alt="Aperçu du comparateur de projets agricoles Kessel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
                quality={85}
              />
            </div>
          </div>

          {/* Bibliothèque */}
          <div className="reveal grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 bg-amber-light rounded-full px-4 py-1.5 mb-4">
                <BookOpen size={16} className="text-amber" />
                <span className="text-amber-dark text-sm font-medium" style={{ color: "#854F0B" }}>À partir de 1 000 FCFA</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>
                Bibliothèque professionnelle
              </h3>
              <p className="text-ink-light leading-relaxed mb-4">
                Guides éducatifs (1 000 FCFA), fiches techniques détaillées (2 000 FCFA), et business plans complets par spéculation (5 500 FCFA) — pédologie, physiologie végétale, gestion intégrée, formalisation, chaîne de valeur.
              </p>
              <p className="text-ink-light leading-relaxed mb-4">
                Chaque document est conçu comme un outil de compréhension autonome, basé sur des données recoupées du secteur camerounais. Pour des projections adaptées à votre situation, nos équipes proposent des consultations sur devis.
              </p>
              <Link href="/bibliotheque" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
                <FileText size={20} />
                Parcourir la bibliothèque
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-forest-light lg:order-1">
              <Image
                src="/images/bibliotheque-preview.jpg"
                alt="Aperçu de la bibliothèque de fiches techniques Kessel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                quality={85}
              />
            </div>
          </div>

          {/* Application */}
          <div className="reveal grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-forest-light rounded-full px-4 py-1.5 mb-4">
                <Smartphone size={16} className="text-forest" />
                <span className="text-forest text-sm font-medium">Téléchargement libre</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>
                Application mobile Kessel
              </h3>
              <p className="text-ink-light leading-relaxed mb-4">
                L&apos;outil de terrain. Suivez vos finances, planifiez vos tâches, recevez les rapports de vos techniciens — le tout depuis votre téléphone, même sans connexion internet.
              </p>
              <p className="text-ink-light leading-relaxed mb-6">
                Disponible sur iOS et Android, gratuitement.
              </p>
              <Link href="/application" className="inline-flex items-center justify-center gap-2 border-2 border-forest hover:bg-forest-light text-forest font-semibold px-7 py-3.5 rounded-xl transition-colors">
                <Smartphone size={20} />
                Découvrir l&apos;application
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-forest-light">
              <Image
                src="/images/mockup-app.png"
                alt="Application mobile Kessel sur smartphone"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          CHIFFRES CLÉS
      ───────────────────────────────────────────── */}
      <section className="py-24 bg-forest-light">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">En chiffres</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Conçu pour le terrain <em>camerounais.</em>
            </h2>
          </div>

          <div className="reveal reveal-delay-2 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "5", label: "zones agro-écologiques" },
              { value: "60+", label: "spéculations couvertes" },
              { value: "78", label: "fiches ITK" },
              { value: "2", label: "langues (FR · EN)" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="text-3xl font-bold text-forest-dark mb-1" style={{ fontFamily: "var(--serif)" }}>{stat.value}</div>
                <div className="text-ink-light text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          CTA FINAL
      ───────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
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
            Prêt à investir<br /><em className="text-amber-light">en connaissance de cause ?</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Explorez nos ressources, comparez vos options, et prenez des décisions éclairées pour votre projet agricole.
          </p>

          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bibliotheque" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              <BookOpen size={20} />
              Parcourir la bibliothèque
            </Link>
            <Link href="/comparateur" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              <BarChart3 size={20} />
              Comparer des projets
            </Link>
          </div>

          <div className="reveal reveal-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-sm">
            <Link href="/application" className="text-white/60 hover:text-white underline underline-offset-4 transition-colors">
              Découvrir l&apos;application mobile
            </Link>
            <span className="hidden sm:block text-white/30">·</span>
            <a href="https://wa.me/237659374501" target="_blank" rel="noopener noreferrer" className="text-amber-light hover:text-amber font-medium inline-flex items-center gap-2 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6 0-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6 0 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.6-.4M12 21.8c-1.7 0-3.3-.4-4.7-1.3l-3.3.9.9-3.2c-1-1.4-1.5-3.1-1.5-4.8C3.4 8.7 7.2 4.9 12 4.9c4.8 0 8.6 3.8 8.6 8.6.1 4.7-3.8 8.3-8.6 8.3M12 3C7.2 3 3 7.2 3 12c0 1.8.5 3.6 1.5 5.1L3 22l5-1.3c1.4.8 3 1.2 4.7 1.2h.3c5 0 9-4.1 9-9.1 0-2.4-1-4.7-2.7-6.4S14.4 3 12 3"/>
              </svg>
              WhatsApp +237 659 374 501
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
