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
    a: (
      <>
        L&apos;application, le comparateur et les pages d&apos;information sont gratuits. Seuls les documents de la
        bibliothèque sont payants, à l&apos;unité, sans abonnement : le prix est affiché en FCFA sur chaque fiche avant tout
        paiement. Voir les <L href="/cgv">Conditions générales de vente</L>.
      </>
    ),
  },
  {
    q: "Comment acheter un document de la bibliothèque ?",
    a: "Connectez-vous avec votre compte du site, ouvrez la fiche puis choisissez votre moyen de paiement. Le paiement se fait sur la page sécurisée de NOKASH, par Mobile Money (Orange Money, MTN Mobile Money) ou par carte bancaire (Visa, Mastercard), en FCFA. Le document se débloque dès que le paiement est confirmé.",
  },
  {
    q: "J'ai payé, mais le document reste verrouillé. Que faire ?",
    a: "Avec Orange Money, la confirmation peut arriver en retard si vous validez la transaction plus tard sur votre téléphone : le document se débloque alors tout seul. Sinon, écrivez-nous (contact@kesselagritech.com ou WhatsApp +237 659 374 501) avec votre e-mail de compte, le document, la date et la référence reçue par SMS. Nous débloquons le document ou vous remboursons.",
  },
  {
    q: "Puis-je télécharger un document acheté ?",
    a: "Non. Les documents se lisent en ligne, depuis « Mes achats », sur n'importe quel appareil connecté à votre compte. Les mises à jour d'un document acheté sont incluses sans frais.",
  },
  {
    q: "Puis-je être remboursé ?",
    a: (
      <>
        Le document étant accessible immédiatement, il n&apos;est pas remboursable une fois débloqué. Exceptions : double
        paiement, paiement débité sans accès, ou document non conforme à sa description. Détails à l&apos;article 6 des{" "}
        <L href="/cgv">CGV</L>.
      </>
    ),
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
        à partir du 12 novembre 2026). Le compte du site n&apos;est jamais supprimé pour inactivité, pour que vos achats restent
        accessibles. Voir l&apos;article 11 des <L href="/cgu">CGU</L>.
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
    q: "D'où viennent les prix de marché de l'application ?",
    a: "Ce sont des relevés transmis par des collecteurs sur les marchés camerounais. Ils sont indicatifs et peuvent varier d'un jour à l'autre et d'un marché à l'autre.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: (
      <>
        Nous ne vendons jamais vos données. Elles ne sont transmises qu&apos;aux prestataires indispensables au service
        (hébergement, paiement, notifications) et aux personnes que vous choisissez d&apos;inviter. Tout est détaillé dans la{" "}
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
