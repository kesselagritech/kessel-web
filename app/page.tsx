"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      
      {/* HERO */}
      <section className="relative min-h-screen bg-forest-dark overflow-hidden flex items-center px-[5vw] py-24 grain-overlay hero-gradient">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -right-[8%] -top-[10%] w-[65%] opacity-[0.06]" viewBox="0 0 600 600">
            <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
            <polygon points="300,80 500,180 500,420 300,520 100,420 100,180" stroke="white" strokeWidth="1.5" fill="none" />
            <polygon points="300,140 440,210 440,390 300,460 160,390 160,210" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="reveal inline-flex items-center gap-2 bg-amber/15 border border-amber/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
              <span className="text-amber-light text-sm font-medium">Application 100% gratuite</span>
            </div>

            <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--serif)" }}>
              GÃ©rez vos projets agricoles <em className="text-amber-light">comme un pro.</em>
            </h1>

            <p className="reveal reveal-delay-2 text-lg text-white/70 mb-8 max-w-lg">
              Kessel est l'application mobile qui aide les promoteurs agricoles camerounais Ã  suivre leurs finances, leurs tÃ¢ches, les prix des marchÃ©s et leurs techniciens.
            </p>

            <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4">
              <Link href="#telecharger" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                TÃ©lÃ©charger sur Play Store
              </Link>
              <a href="https://wa.me/237659374501" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-7 py-3.5 rounded-xl transition-colors">
                Nous contacter
              </a>
            </div>

            <div className="reveal reveal-delay-4 flex gap-8 mt-10 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>5</div>
                <div className="text-white/50 text-sm">zones agricoles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>60+</div>
                <div className="text-white/50 text-sm">spÃ©culations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>78</div>
                <div className="text-white/50 text-sm">fiches ITK</div>
              </div>
            </div>
          </div>

          {/* MOCKUP TELEPHONE */}
          <div className="reveal reveal-delay-2 hidden lg:flex justify-center">
            <div className="relative w-[260px] h-[520px] bg-[#0a0a0a] rounded-[2.5rem] p-2 shadow-2xl border border-white/10">
              {/* Encoche */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0a0a0a] rounded-full z-20" />
              
              {/* Ecran */}
              <div className="relative w-full h-full bg-forest-dark rounded-[2rem] overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className="flex justify-between items-center px-5 pt-5 pb-1 shrink-0">
                  <span className="text-white/60 text-[10px] font-mono">9:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-3 h-1.5 bg-white/60 rounded-sm" />
                    <div className="w-1 h-1.5 bg-white/40 rounded-sm" />
                  </div>
                </div>
                
                {/* Header app */}
                <div className="px-4 pb-2 shrink-0">
                  <p className="text-white/50 text-[9px]">Bonjour, AndrÃ©</p>
                  <h2 className="text-white font-semibold text-sm">Mes projets</h2>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-hidden px-3 pb-14">
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white/10 rounded-lg p-2.5">
                      <p className="text-white/50 text-[8px]">Projets actifs</p>
                      <p className="text-white font-bold text-lg leading-tight">3</p>
                    </div>
                    <div className="bg-amber/20 rounded-lg p-2.5">
                      <p className="text-amber-light/70 text-[8px]">Solde total</p>
                      <p className="text-amber-light font-bold text-base leading-tight">2.4M</p>
                      <p className="text-amber-light/50 text-[7px]">FCFA</p>
                    </div>
                  </div>

                  {/* Project cards */}
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="text-forest-dark font-semibold text-[11px]">Cacao Pama</p>
                          <p className="text-ink-light text-[8px]">2.5 ha - RÃ©gion Sud</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-[7px] px-1.5 py-0.5 rounded-full">Actif</span>
                      </div>
                      <div className="flex gap-3 text-[8px]">
                        <div>
                          <p className="text-ink-light">Revenus</p>
                          <p className="text-forest-dark font-semibold">850 000</p>
                        </div>
                        <div>
                          <p className="text-ink-light">DÃ©penses</p>
                          <p className="text-forest-dark font-semibold">320 000</p>
                        </div>
                        <div>
                          <p className="text-ink-light">Marge</p>
                          <p className="text-green-600 font-semibold">+62%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="text-forest-dark font-semibold text-[11px]">MaraÃ®chage Kribi</p>
                          <p className="text-ink-light text-[8px]">0.8 ha - Tomate, Piment</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-[7px] px-1.5 py-0.5 rounded-full">Actif</span>
                      </div>
                      <div className="flex gap-3 text-[8px]">
                        <div>
                          <p className="text-ink-light">Revenus</p>
                          <p className="text-forest-dark font-semibold">420 000</p>
                        </div>
                        <div>
                          <p className="text-ink-light">DÃ©penses</p>
                          <p className="text-forest-dark font-semibold">180 000</p>
                        </div>
                        <div>
                          <p className="text-ink-light">Marge</p>
                          <p className="text-green-600 font-semibold">+57%</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="text-forest-dark font-semibold text-[11px]">Banane Plantain</p>
                          <p className="text-ink-light text-[8px]">1.2 ha - Mpolongwe</p>
                        </div>
                        <span className="bg-amber/20 text-amber-dark text-[7px] px-1.5 py-0.5 rounded-full">En cours</span>
                      </div>
                      <div className="flex gap-3 text-[8px]">
                        <div>
                          <p className="text-ink-light">Revenus</p>
                          <p className="text-forest-dark font-semibold">0</p>
                        </div>
                        <div>
                          <p className="text-ink-light">DÃ©penses</p>
                          <p className="text-forest-dark font-semibold">145 000</p>
                        </div>
                        <div>
                          <p className="text-ink-light">Marge</p>
                          <p className="text-ink-light font-semibold">--</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="absolute bottom-0 left-0 right-0 bg-forest-dark/95 border-t border-white/10 px-4 py-2 flex justify-around">
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-amber text-[7px] mt-0.5">Accueil</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white/50 text-[7px] mt-0.5">Finances</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-white/50 text-[7px] mt-0.5">MarchÃ©s</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v2m0 18v2m-9-11h2m18 0h-2m-2.5-6.5l-1.4 1.4m-9.2 9.2l-1.4 1.4m0-12l1.4 1.4m9.2 9.2l1.4 1.4" />
                    </svg>
                    <span className="text-white/50 text-[7px] mt-0.5">Plus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITES */}
      <section id="fonctionnalites" className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">FonctionnalitÃ©s</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Tout ce dont vous avez besoin,<br /><em>dans votre poche.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Suivi financier", desc: "Revenus, dÃ©penses, marges. Visualisez la rentabilitÃ© de chaque projet en temps rÃ©el." },
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "Gestion des tÃ¢ches", desc: "Planifiez les activitÃ©s agricoles, suivez l'avancement et collaborez en temps rÃ©el entre promoteurs et techniciens." },
              { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Prix des marchÃ©s", desc: "Consultez les prix actualisÃ©s des produits agricoles sur les marchÃ©s camerounais." },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Gestion des techniciens", desc: "Invitez vos techniciens, recevez leurs rapports, suivez leurs visites terrain." },
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "ItinÃ©raires techniques", desc: "78 fiches ITK dÃ©taillÃ©es pour guider vos pratiques culturales Ã©tape par Ã©tape." },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", title: "AdaptÃ© au Cameroun", desc: "5 zones agro-Ã©cologiques, 60+ spÃ©culations locales, interface en franÃ§ais et anglais." },
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

      {/* TEMOIGNAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">TÃ©moignages</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Ce qu'en disent<br /><em>les premiers utilisateurs.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { initials: "JN", name: "Jean-NoÃ«l Mboua", role: "Promoteur cacao - RÃ©gion Sud", quote: "Avant Kessel, je notais tout dans un cahier. Aujourd'hui je sais exactement ma marge sur chaque projet." },
              { initials: "AM", name: "Awa Mbarga", role: "Promotrice maraÃ®chage - Bafoussam", quote: "Les prix marchÃ©s m'ont aidÃ© Ã  vendre mes tomates au bon moment. J'ai Ã©vitÃ© de vendre Ã  perte." },
              { initials: "PF", name: "Paul Fotso", role: "Technicien agricole - RÃ©gion Ouest", quote: "Je peux soumettre mes observations en temps rÃ©el. Le promoteur voit tout instantanÃ©ment." },
            ].map((testimonial, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} bg-forest-light p-8 rounded-2xl`}>
                <div className="text-amber text-xl mb-4">â˜…â˜…â˜…â˜…â˜…</div>
                <p className="text-forest-dark mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-white font-semibold">{testimonial.initials}</div>
                  <div>
                    <div className="font-semibold text-forest-dark">{testimonial.name}</div>
                    <div className="text-ink-light text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="telecharger" className="relative py-24 bg-forest-dark overflow-hidden">
        <svg className="absolute -right-[5%] -bottom-[10%] w-[40%] opacity-[0.08]" viewBox="0 0 400 400">
          <polygon points="200,10 370,105 370,295 200,390 30,295 30,105" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="absolute -left-[8%] -top-[15%] w-[35%] opacity-[0.06]" viewBox="0 0 300 300">
          <polygon points="150,8 278,79 278,221 150,292 22,221 22,79" stroke="white" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Commencez Ã  piloter<br />vos projets <em className="text-amber-light">dÃ¨s aujourd'hui.</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Application 100% gratuite. Aucune carte bancaire requise. TÃ©lÃ©chargez et commencez Ã  gÃ©rer vos projets agricoles immÃ©diatement.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                <path d="M10 8l6 4-6 4V8z" />
              </svg>
              TÃ©lÃ©charger sur Google Play
            </Link>
            <a href="https://wa.me/237659374501" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              Nous appeler
            </a>
          </div>
          <p className="reveal reveal-delay-3 text-white/40 text-sm mt-8">WhatsApp +237 659 374 501</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
