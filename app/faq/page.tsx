"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  { q: "Kessel est-il vraiment gratuit ?", a: "Oui, l application Kessel est 100% gratuite pour les promoteurs individuels. Vous pouvez gerer vos projets, suivre vos finances et acceder aux prix des marches sans aucun frais." },
  { q: "L application fonctionne-t-elle sans internet ?", a: "Oui, Kessel est concu pour fonctionner hors-ligne. Vous pouvez saisir vos donnees meme sans connexion. Elles seront synchronisees automatiquement des que vous retrouverez internet." },
  { q: "Dans quelles langues l application est-elle disponible ?", a: "Kessel est disponible en francais et en anglais. Vous pouvez changer la langue dans les parametres de l application." },
  { q: "Quelles cultures sont supportees ?", a: "Kessel couvre plus de 60 speculations reparties sur les 5 zones agro-ecologiques du Cameroun : cultures vivrieres, maraichage, cultures de rente, elevage, et plus encore." },
  { q: "Qu est-ce qu un ITK ?", a: "Un ITK (Itineraire Technique de Culture) est un guide detaille qui decrit etape par etape les pratiques a suivre pour cultiver une speculation. Kessel propose 78 fiches ITK pour vous accompagner." },
  { q: "Puis-je inviter mon technicien agricole ?", a: "Oui, vous pouvez inviter vos techniciens a rejoindre vos projets. Ils pourront soumettre des rapports de visite et des observations directement depuis leur telephone." },
  { q: "Comment sont calcules les prix des marches ?", a: "Les prix des marches sont collectes et mis a jour regulierement a partir de sources fiables sur les principaux marches camerounais comme le Marche Mokolo a Yaounde." },
  { q: "Mes donnees sont-elles securisees ?", a: "Oui, vos donnees sont stockees de maniere securisee sur des serveurs proteges. Nous ne partageons jamais vos informations personnelles avec des tiers." },
  { q: "L offre Organisations, c est quoi ?", a: "L offre Organisations est destinee aux ONGs, cooperatives et programmes de developpement qui souhaitent suivre leurs beneficiaires et generer des rapports pour leurs bailleurs de fonds." },
  { q: "Comment contacter le support ?", a: "Vous pouvez nous joindre par WhatsApp au +237 659 374 501 ou par email a contact@kesselagritech.com. Nous repondons generalement sous 24h." },
];

export default function FAQPage() {
  useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">FAQ</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Questions<br /><em className="text-amber-light">frequentes.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Retrouvez les reponses aux questions les plus posees sur Kessel.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`reveal reveal-delay-${(i % 3) + 1} bg-white rounded-xl overflow-hidden shadow-sm`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-forest-dark pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-forest shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {open === i && (
                  <div className="px-6 pb-6 text-ink-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
            Vous avez d autres<br /><em>questions ?</em>
          </h2>
          <p className="reveal reveal-delay-1 text-ink-mid mb-10">
            Notre equipe est disponible pour repondre a toutes vos interrogations.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Nous contacter
            </Link>
            <a href="https://wa.me/237659374501" className="inline-flex items-center justify-center gap-2 border-2 border-forest text-forest hover:bg-forest-light font-semibold px-8 py-4 rounded-xl transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}