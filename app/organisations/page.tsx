"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrganisationsPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative bg-forest-dark pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -right-[10%] -top-[20%] w-[50%] opacity-[0.05]" viewBox="0 0 600 600">
            <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="reveal inline-flex items-center gap-2 bg-amber/15 border border-amber/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-amber-light text-sm font-medium">Pour les ONGs et bailleurs de fonds</span>
          </div>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--serif)" }}>
            Pilotez vos programmes agricoles <em className="text-amber-light">avec Kessel.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Suivez vos beneficiaires, collectez des donnees terrain et generez des rapports professionnels pour vos partenaires financiers.
          </p>
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#tarifs" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
              Voir les tarifs
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-7 py-3.5 rounded-xl transition-colors">
              Demander une demo
            </Link>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Avantages</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Ce que Kessel apporte<br /><em>a votre organisation.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Suivi des beneficiaires", desc: "Gerez les fiches de tous vos beneficiaires avec leurs exploitations, cultures et historique complet." },
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Rapports pour bailleurs", desc: "Generez des rapports professionnels avec indicateurs d impact pour vos partenaires financiers." },
              { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Collecte terrain", desc: "Vos techniciens saisissent les donnees sur le terrain, meme sans connexion internet." },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Donnees securisees", desc: "Vos donnees sont hebergees de maniere securisee et conformes aux standards internationaux." },
              { icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", title: "Tableau de bord", desc: "Visualisez en temps reel l avancement de vos programmes et les indicateurs cles." },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Gain de temps", desc: "Automatisez la collecte et l agregation des donnees. Fini les tableaux Excel eparpilles." },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${(i % 3) + 1} bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 bg-forest-light rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>{item.title}</h3>
                <p className="text-ink-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Processus</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Comment ca<br /><em>fonctionne.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Creez votre programme", desc: "Definissez votre zone d intervention, les cultures ciblees et vos indicateurs." },
              { step: "2", title: "Invitez vos techniciens", desc: "Ajoutez vos agents terrain et attribuez-leur des zones geographiques." },
              { step: "3", title: "Collectez les donnees", desc: "Vos techniciens enregistrent les beneficiaires et font le suivi sur le terrain." },
              { step: "4", title: "Generez vos rapports", desc: "Exportez des rapports professionnels pour vos bailleurs en quelques clics." },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="w-16 h-16 bg-forest-dark text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ fontFamily: "var(--serif)" }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-forest-dark mb-2" style={{ fontFamily: "var(--serif)" }}>{item.title}</h3>
                <p className="text-ink-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Tarifs</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Des plans adaptes<br /><em>a votre structure.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="reveal reveal-delay-1 bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-forest-dark mb-2" style={{ fontFamily: "var(--serif)" }}>Starter</h3>
              <p className="text-ink-light text-sm mb-6">Pour les petits programmes et projets pilotes.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-forest-dark">500 000</span>
                <span className="text-ink-light"> FCFA/an</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Jusqu a 100 beneficiaires", "3 techniciens", "Mode hors-ligne", "Export Excel", "Rapports standards", "Support email"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-ink-mid text-sm">
                    <svg className="w-5 h-5 text-forest shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block text-center bg-forest hover:bg-forest-dark text-white font-semibold py-3 rounded-xl transition-colors">
                Choisir Starter
              </Link>
            </div>

            {/* Pro - Recommande */}
            <div className="reveal reveal-delay-2 bg-forest-dark p-8 rounded-2xl shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber text-white text-xs font-semibold px-4 py-1 rounded-full">
                Recommande
              </div>
              <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "var(--serif)" }}>Pro</h3>
              <p className="text-white/60 text-sm mb-6">Pour les programmes de taille moyenne.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">1 500 000</span>
                <span className="text-white/60"> FCFA/an</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Jusqu a 500 beneficiaires", "10 techniciens", "Mode hors-ligne", "Export Excel", "Rapports personnalises", "Multi-programmes", "1 session de formation", "Support prioritaire"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <svg className="w-5 h-5 text-amber shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block text-center bg-amber hover:bg-amber-dark text-white font-semibold py-3 rounded-xl transition-colors">
                Choisir Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="reveal reveal-delay-3 bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-forest-dark mb-2" style={{ fontFamily: "var(--serif)" }}>Enterprise</h3>
              <p className="text-ink-light text-sm mb-6">Pour les grandes organisations et programmes nationaux.</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-forest-dark">Sur devis</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Beneficiaires illimites", "Techniciens illimites", "Tout le plan Pro inclus", "API acces donnees", "Formations illimitees", "Account manager dedie", "SLA garanti"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-ink-mid text-sm">
                    <svg className="w-5 h-5 text-forest shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block text-center border-2 border-forest text-forest hover:bg-forest-light font-semibold py-3 rounded-xl transition-colors">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-forest-dark overflow-hidden">
        <svg className="absolute -right-[5%] -bottom-[10%] w-[40%] opacity-[0.08]" viewBox="0 0 400 400">
          <polygon points="200,10 370,105 370,295 200,390 30,295 30,105" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Pret a digitaliser<br /><em className="text-amber-light">vos programmes ?</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Contactez-nous pour une demonstration personnalisee et decouvrez comment Kessel peut transformer le suivi de vos beneficiaires.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Demander une demo
            </Link>
            <a href="https://wa.me/237659374501" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}