"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

export default function CGUPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-16 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Legal</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Conditions générales<br /><em className="text-amber-light">d'utilisation.</em>
          </h1>
        </div>
      </section>

      {/* CONTENU */}
      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="prose prose-lg max-w-none">

              <div className="reveal">
                <p className="text-ink-mid leading-relaxed mb-8">
                  Les présentes Conditions Generales d Utilisation (CGU) régissent l utilisation de l'application mobile Kessel et du site web kesselagritech.com. En utilisant nos services, vous acceptez ces conditions.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Objet</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Kessel est une application de gestion de projets agricoles destinée aux promoteurs et techniciens agricoles au Cameroun. Elle permet de suivre les finances, les taches, les prix des marches et de gérer les équipes terrain.
                </p>
              </div>

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Acces au service</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  L application Kessel est gratuite pour les utilisateurs individuels (promoteurs et techniciens). L acces au service nécessite :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Un telephone compatible (Android)",
                    "Un numéro de telephone valide pour l'inscription",
                    "L acceptation des présentes CGU",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal reveal-delay-3">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Compte utilisateur</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Vous êtes responsable de :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "La confidentialite de vos identifiants de connexion",
                    "Toutes les activités effectuées depuis votre compte",
                    "L exactitude des informations fournies lors de l'inscription",
                    "La notification immediate en cas d'utilisation non autorisée de votre compte",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal reveal-delay-4">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Utilisation acceptable</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  En utilisant Kessel, vous vous engagez a ne pas :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Utiliser le service à des fins illégales ou non autorisées",
                    "Tenter d'accéder aux comptes d'autres utilisateurs",
                    "Introduire des virus ou codes malveillants",
                    "Collecter des données d'autres utilisateurs sans autorisation",
                    "Revendre ou redistribuer le service sans autorisation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-brick shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Propriete des données</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Vous conservez la propriété de toutes les données que vous saisissez dans l'application (projets, finances, observations). Kessel dispose d une licence limitee pour traiter ces données uniquement dans le but de fournir le service.
                </p>
              </div>

              <div className="reveal reveal-delay-6">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Disponibilite du service</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous nous efforcons de maintenir le service disponible 24h/24. Toutefois, nous ne pouvons garantir une disponibilité ininterrompue. Des interruptions peuvent survenir pour maintenance, mises a jour ou en cas de force majeure.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>7. Limitation de responsabilité</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Kessel est fourni "en l etat". Nous ne garantissons pas que le service repondra a tous vos besoins ou sera exempt d erreurs. En aucun cas Kessel Agritech ne pourra etre tenu responsable des dommages indirects, pertes de données ou pertes financières liees a l utilisation du service.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>8. Resiliation</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l'application. Nous nous réservons le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>9. Modifications</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous pouvons modifier ces CGU à tout moment. Les modifications entrent en vigueur dès leur publication. En continuant a utiliser le service après modification, vous acceptez les nouvelles conditions.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>10. Droit applicable</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Les présentes CGU sont regies par le droit camerounais. Tout litige sera soumis aux tribunaux compétents de Kribi, Cameroun.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>11. Contact</h2>
                <p className="text-ink-mid leading-relaxed">
                  Pour toute question concernant ces CGU, contactez-nous a <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a>.
                </p>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-neutral-mid text-center">
              <p className="text-ink-light text-sm">Derniere mise a jour : Avril 2026</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}