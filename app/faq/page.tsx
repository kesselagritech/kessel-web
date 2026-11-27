"use client";
// app/faq/page.tsx — FAQ v2 (site + bibliothèque + application) — [legal-v2]

import { useState, type ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

const L = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="text-amber hover:underline">
    {children}
  </Link>
);

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "Qu'est-ce que Kessel ?",
    a: "Kessel Agritech réunit deux outils. Le site kesselagritech.com, ouvert à toute l'Afrique, propose une bibliothèque de business plans, fiches techniques et guides, un comparateur de projets et des pages d'information. L'application mobile Kessel, conçue pour le Cameroun, sert à gérer ses projets agricoles sur le terrain.",
  },
  {
    q: "Kessel est-il payant ?",
    a: "Non. L'application, le comparateur, les pages d'information et tous les documents de la bibliothèque (business plans, fiches techniques, guides) sont gratuits. Seules les études personnalisées réalisées sur demande font l'objet d'un devis.",
  },
  {
    q: "Comment lire un document de la bibliothèque ?",
    a: "Créez un compte gratuit sur le site avec votre adresse e-mail, votre pays et votre numéro de téléphone, puis ouvrez n'importe quel document : il s'affiche en entier, sans paiement. Sans compte, seul le début de chaque document est visible. Les mises à jour sont visibles dès leur publication.",
  },
  {
    q: "J'ai acheté un document avant le passage au gratuit. Que se passe-t-il ?",
    a: "Le document reste accessible, comme tous les autres. Pour toute question sur un ancien achat, écrivez-nous (contact@kesselagritech.com ou WhatsApp +237 659 374 501) avec votre e-mail de compte et la référence de paiement.",
  },
  {
    q: "Mon compte du site est-il le même que celui de l'application ?",
    a: "Non. Le compte du site (e-mail et mot de passe) sert à la bibliothèque et à l'espace collaborateur. Le compte de l'application utilise votre numéro de téléphone et un code PIN. Ce sont deux comptes distincts.",
  },
  {
    q: "Que devient mon compte si je ne l'utilise plus ?",
    a: (
      <>
        Un compte de l&apos;application sans connexion pendant 6 mois consécutifs est supprimé avec ses projets (règle appliquée
        à partir du 12 novembre 2026). Le compte du site n&apos;est jamais supprimé pour inactivité, pour que vous gardiez votre accès
        à la bibliothèque et à l&apos;espace collaborateur. Voir l&apos;article 11 des <L href="/cgu">CGU</L>.
      </>
    ),
  },
  {
    q: "Qu'est-ce que l'espace collaborateur ?",
    a: "Un promoteur peut transmettre un code d'exploitation à un associé, un investisseur ou un proche. Cette personne, connectée avec un compte du site, suit alors les projets de l'exploitation en lecture seule, sans pouvoir rien modifier.",
  },
  {
    q: "L'application fonctionne-t-elle sans internet ?",
    a: "Oui. Vous saisissez vos données sans connexion ; elles se synchronisent automatiquement dès que vous retrouvez internet.",
  },
  {
    q: "Dans quelles langues l'application est-elle disponible ?",
    a: "En français et en anglais. Vous changez la langue dans les paramètres de l'application.",
  },
  {
    q: "Qu'est-ce qu'une fiche technique (ITK) ?",
    a: "Un itinéraire technique décrit, étape par étape, comment conduire une culture ou un élevage : préparation, mise en place, entretien, protection, récolte. La bibliothèque en propose pour de nombreuses spéculations.",
  },
  {
    q: "Puis-je inviter mon technicien agricole ?",
    a: "Oui. Depuis l'application, invitez vos techniciens sur vos projets : ils envoient leurs rapports et observations directement depuis leur téléphone.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: (
      <>
        Nous ne vendons jamais vos données. Elles ne sont transmises qu&apos;aux prestataires indispensables au service
        (hébergement, notifications) et aux personnes que vous choisissez d&apos;inviter. Tout est détaillé dans la{" "}
        <L href="/confidentialite">Politique de confidentialité</L>.
      </>
    ),
  },
  {
    q: "Comment contacter le support ?",
    a: "Par WhatsApp au +237 659 374 501 ou par e-mail à contact@kesselagritech.com. Nous répondons généralement sous 24 heures.",
  },
];

export default function FAQPage() {
  useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">FAQ</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Questions<br /><em className="text-amber-light">fréquentes.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Le site, la bibliothèque et l&apos;application : les réponses aux questions les plus posées.
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
                  aria-expanded={open === i}
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
            Vous avez d&apos;autres<br /><em>questions ?</em>
          </h2>
          <p className="reveal reveal-delay-1 text-ink-mid mb-10">
            Écrivez-nous, nous répondons à toutes vos questions.
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
