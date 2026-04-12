"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConfidentialitePage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Legal</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Politique de<br /><em className="text-amber-light">confidentialite.</em>
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
                  Kessel Agritech accorde une grande importance a la protection de vos donnees personnelles. Cette politique de confidentialite explique quelles donnees nous collectons, comment nous les utilisons et quels sont vos droits.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Donnees collectees</h2>
                <p className="text-ink-mid leading-relaxed mb-4">Nous collectons les donnees suivantes :</p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Informations d identification : nom, prenom, numero de telephone, email",
                    "Donnees de localisation : region, ville (pour adapter les zones agro-ecologiques)",
                    "Donnees agricoles : projets, cultures, superficies, finances, taches",
                    "Donnees techniques : type d appareil, version de l application, logs de connexion",
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

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Utilisation des donnees</h2>
                <p className="text-ink-mid leading-relaxed mb-4">Vos donnees sont utilisees pour :</p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Fournir et ameliorer les services de l application",
                    "Personnaliser votre experience (zone agro-ecologique, speculations)",
                    "Generer des rapports et statistiques pour votre usage",
                    "Assurer le support technique et repondre a vos demandes",
                    "Envoyer des notifications importantes sur le service",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Partage des donnees</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Nous ne vendons jamais vos donnees personnelles. Vos donnees peuvent etre partagees uniquement dans les cas suivants :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Avec vos techniciens : les techniciens que vous invitez peuvent voir les projets auxquels ils sont assignes",
                    "Prestataires techniques : hebergement (Supabase, Vercel) pour le fonctionnement du service",
                    "Obligations legales : si requis par la loi ou une autorite competente",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Securite des donnees</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous mettons en oeuvre des mesures de securite techniques et organisationnelles pour proteger vos donnees : chiffrement des communications (HTTPS/TLS), authentification securisee, sauvegardes regulieres, acces restreint aux donnees.
                </p>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Conservation des donnees</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Vos donnees sont conservees tant que votre compte est actif. En cas de suppression de compte, vos donnees personnelles sont supprimees dans un delai de 30 jours. Les donnees agregees et anonymisees peuvent etre conservees a des fins statistiques.
                </p>
              </div>

              <div className="reveal reveal-delay-6">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Vos droits</h2>
                <p className="text-ink-mid leading-relaxed mb-4">Vous disposez des droits suivants :</p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Droit d acces : obtenir une copie de vos donnees",
                    "Droit de rectification : corriger vos donnees inexactes",
                    "Droit de suppression : demander la suppression de vos donnees",
                    "Droit a la portabilite : recevoir vos donnees dans un format structure",
                    "Droit d opposition : vous opposer a certains traitements",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Pour exercer ces droits, contactez-nous a <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a>.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>7. Modifications</h2>
                <p className="text-ink-mid leading-relaxed">
                  Nous pouvons modifier cette politique de confidentialite. Les modifications seront publiees sur cette page avec la date de mise a jour. Nous vous encourageons a consulter regulierement cette page.
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