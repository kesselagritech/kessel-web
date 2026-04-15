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
                  Kessel Agritech accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialite explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Donnees collectées</h2>
                <p className="text-ink-mid leading-relaxed mb-4">Nous collectons les données suivantes :</p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Informations d'identification : nom, prénom, numéro de telephone, email",
                    "Donnees de localisation : région, ville (pour adapter les zones agro-écologiques)",
                    "Donnees agricoles : projets, cultures, superficies, finances, taches",
                    "Donnees techniques : type d appareil, version de l'application, logs de connexion",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Utilisation des données</h2>
                <p className="text-ink-mid leading-relaxed mb-4">Vos données sont utilisées pour :</p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Fournir et améliorer les services de l'application",
                    "Personnaliser votre expérience (zone agro-ecologique, spéculations)",
                    "Generer des rapports et statistiques pour votre usage",
                    "Assurer le support technique et répondre a vos demandes",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Partage des données</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Nous ne vendons jamais vos données personnelles. Vos données peuvent etre partagées uniquement dans les cas suivants :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Avec vos techniciens : les techniciens que vous invitez peuvent voir les projets auxquels ils sont assignés",
                    "Prestataires techniques : hébergement (Supabase, Vercel) pour le fonctionnement du service",
                    "Obligations légales : si requis par la loi ou une autorite competente",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Securite des données</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous mettons en oeuvre des mesures de sécurité techniques et organisationnelles pour protégér vos données : chiffrement des communications (HTTPS/TLS), authentification sécurisée, sauvegardes regulieres, acces restreint aux données.
                </p>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Conservation des données</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données personnelles sont supprimées dans un délai de 30 jours. Les données agrégées et anonymisees peuvent etre conservées à des fins statistiques.
                </p>
              </div>

              <div className="reveal reveal-delay-6">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Vos droits</h2>
                <p className="text-ink-mid leading-relaxed mb-4">Vous disposez des droits suivants :</p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Droit d'accès : obtenir une copie de vos données",
                    "Droit de rectification : corriger vos données inexactes",
                    "Droit de suppression : demander la suppression de vos données",
                    "Droit à la portabilite : recevoir vos données dans un format structure",
                    "Droit d'opposition : vous opposer a certains traitements",
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
                  Nous pouvons modifier cette politique de confidentialite. Les modifications seront publiées sur cette page avec la date de mise a jour. Nous vous encourageons a consulter regulierement cette page.
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