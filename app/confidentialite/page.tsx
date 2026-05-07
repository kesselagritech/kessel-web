"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

export default function ConfidentialitePage() {
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
            Politique de<br /><em className="text-amber-light">confidentialité.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-white/70 text-sm">
            Version 1.0 · En vigueur le 3 mai 2026 · <Link href="/confidentialite/en" className="underline hover:text-amber">English version</Link>
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="prose prose-lg max-w-none">

              <div className="reveal">
                <p className="text-ink-mid leading-relaxed mb-8">
                  Kessel Agritech (« <strong>Kessel</strong> », « nous ») s'engage à protéger la vie privée des utilisateurs de son application mobile et de ses services associés (le « <strong>Service</strong> »). La présente politique explique quelles données personnelles nous collectons, pourquoi, comment nous les utilisons, et quels sont vos droits.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Identité du responsable de traitement</h2>
                <div className="bg-forest-light p-6 rounded-xl mb-6">
                  <p className="text-forest-dark"><strong>Kessel Agritech</strong> (immatriculation RCCM en cours)</p>
                  <p className="text-ink-mid">Représenté par : Atine Mvom Philippe André, Fondateur et Directeur</p>
                  <p className="text-ink-mid">Adresse : Ebome, Kribi, Cameroun</p>
                  <p className="text-ink-mid">Email : <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a></p>
                </div>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Vu la taille de notre structure, le responsable de traitement assure également les fonctions de Délégué à la Protection des Données (DPO).
                </p>
              </div>

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Données collectées</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Nous collectons uniquement les données strictement nécessaires au fonctionnement du Service. <strong>Aucune donnée n'est vendue à des tiers.</strong>
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Catégorie</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Données</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Finalité</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid">
                        <td className="p-3 font-medium text-forest-dark">Identité</td>
                        <td className="p-3 text-ink-mid">Numéro de téléphone, prénom, nom (optionnel), langue</td>
                        <td className="p-3 text-ink-mid">Création et gestion de compte</td>
                      </tr>
                      <tr className="border-b border-neutral-mid">
                        <td className="p-3 font-medium text-forest-dark">Localisation</td>
                        <td className="p-3 text-ink-mid">Coordonnées GPS lors de la prise de photos terrain</td>
                        <td className="p-3 text-ink-mid">Géolocaliser les rapports agricoles</td>
                      </tr>
                      <tr className="border-b border-neutral-mid">
                        <td className="p-3 font-medium text-forest-dark">Photos</td>
                        <td className="p-3 text-ink-mid">Images capturées via la caméra (preuves terrain)</td>
                        <td className="p-3 text-ink-mid">Documenter les rapports de projets</td>
                      </tr>
                      <tr className="border-b border-neutral-mid">
                        <td className="p-3 font-medium text-forest-dark">Métier</td>
                        <td className="p-3 text-ink-mid">Projets, tâches, dépenses, revenus, rapports</td>
                        <td className="p-3 text-ink-mid">Fourniture du service de gestion agricole</td>
                      </tr>
                      <tr className="border-b border-neutral-mid">
                        <td className="p-3 font-medium text-forest-dark">Technique</td>
                        <td className="p-3 text-ink-mid">Jeton de notification push, identifiants de session, modèle d'appareil</td>
                        <td className="p-3 text-ink-mid">Notifications, sécurité, support</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-forest-dark">Logs</td>
                        <td className="p-3 text-ink-mid">Pannes applicatives, identifiants techniques anonymisés</td>
                        <td className="p-3 text-ink-mid">Diagnostic via Sentry</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-6">2.1 Données que nous ne collectons PAS</h3>
                <ul className="space-y-2 mb-8">
                  {[
                    "Carnet de contacts du téléphone",
                    "Historique de navigation hors de l'application",
                    "Photos ou fichiers stockés sur le téléphone (autres que celles capturées via Kessel)",
                    "Données biométriques",
                    "Numéros de carte bancaire ou autres données de paiement (aucun paiement n'est requis pour utiliser le Service)",
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

              <div className="reveal reveal-delay-3">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Bases légales du traitement</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Conformément à la loi camerounaise n° 2010/012 du 21 décembre 2010 ainsi qu'aux principes du Règlement Général sur la Protection des Données (RGPD) que nous appliquons par alignement, chaque traitement repose sur l'une des bases suivantes :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Exécution du contrat (compte, projets, rapports).",
                    "Consentement explicite (localisation GPS, accès à la caméra).",
                    "Intérêt légitime (sécurité, diagnostic technique).",
                    "Obligation légale (opérations financières, lutte contre la fraude).",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Permissions demandées par l'application</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  L'application Kessel demande votre consentement explicite avant d'accéder aux ressources sensibles de votre téléphone :
                </p>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Permission</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Pourquoi</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Refusable ?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Caméra</td><td className="p-3 text-ink-mid">Capturer les preuves terrain</td><td className="p-3 text-ink-mid">Oui</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Localisation précise</td><td className="p-3 text-ink-mid">Géolocaliser les photos</td><td className="p-3 text-ink-mid">Oui</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Notifications</td><td className="p-3 text-ink-mid">Rappels, messages, alertes prix</td><td className="p-3 text-ink-mid">Oui</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Stockage local</td><td className="p-3 text-ink-mid">Mode hors-ligne</td><td className="p-3 text-ink-mid">Non (essentiel)</td></tr>
                      <tr><td className="p-3 font-medium">Internet</td><td className="p-3 text-ink-mid">Synchronisation serveurs</td><td className="p-3 text-ink-mid">Non (essentiel)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Hébergement et sous-traitants</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Vos données sont hébergées par les prestataires suivants, tous engagés contractuellement à respecter des standards de sécurité élevés :
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Sous-traitant</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Service</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Localisation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Supabase Inc.</td><td className="p-3 text-ink-mid">Base de données, auth, stockage fichiers</td><td className="p-3 text-ink-mid">États-Unis (us-west-2, Oregon)</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Expo (EAS)</td><td className="p-3 text-ink-mid">Distribution notifications push</td><td className="p-3 text-ink-mid">États-Unis</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Vercel Inc.</td><td className="p-3 text-ink-mid">Site web et outils d'administration</td><td className="p-3 text-ink-mid">États-Unis / UE (CDN global)</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Sentry</td><td className="p-3 text-ink-mid">Diagnostic des pannes</td><td className="p-3 text-ink-mid">Union européenne</td></tr>
                      <tr><td className="p-3 font-medium">Google FCM</td><td className="p-3 text-ink-mid">Distribution technique des notifs</td><td className="p-3 text-ink-mid">États-Unis</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-6">5.1 Transferts hors du Cameroun</h3>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Certains de nos sous-traitants sont situés hors du Cameroun (États-Unis, Union européenne). Pour garantir un niveau de protection adéquat, ces transferts sont encadrés par les <strong>clauses contractuelles types</strong> de la Commission européenne et les politiques de conformité des prestataires.
                </p>
              </div>

              <div className="reveal reveal-delay-6">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Durée de conservation</h2>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Type de donnée</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Compte (actif)</td><td className="p-3 text-ink-mid">Tant que le compte est actif</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Compte (après suppression)</td><td className="p-3 text-ink-mid">Effacement immédiat et définitif</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Photos et rapports</td><td className="p-3 text-ink-mid">Tant que le projet est actif, ou jusqu'à suppression manuelle</td></tr>
                      <tr><td className="p-3 font-medium">Logs techniques</td><td className="p-3 text-ink-mid">90 jours maximum</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>7. Vos droits</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Vous disposez à tout moment des droits suivants sur vos données :
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Droit d'accès : obtenir une copie de toutes les données que nous détenons sur vous.",
                    "Droit de rectification : corriger les données inexactes ou incomplètes.",
                    "Droit à l'effacement : demander la suppression de votre compte.",
                    "Droit à la portabilité : recevoir vos données dans un format structuré.",
                    "Droit d'opposition : vous opposer à un traitement particulier.",
                    "Droit de retrait du consentement : à tout moment, sans effet rétroactif.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Pour exercer ces droits, écrivez à <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a> en précisant votre numéro de téléphone associé au compte. Nous vous répondrons sous <strong>30 jours</strong> maximum.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  En cas de désaccord, vous pouvez saisir <strong>l'Agence Nationale des Technologies de l'Information et de la Communication (ANTIC)</strong> au Cameroun, ou toute autorité compétente de votre pays de résidence.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>8. Sécurité</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Communications chiffrées de bout en bout (HTTPS/TLS 1.3).",
                    "Mots de passe stockés hashés (PBKDF2 avec sel unique).",
                    "Politiques d'accès strictes (Row Level Security) côté base de données.",
                    "Authentification à plusieurs facteurs côté équipe technique.",
                    "Sauvegardes chiffrées et redondantes.",
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
                  En cas de violation de données affectant vos droits, nous nous engageons à vous notifier dans un délai maximum de <strong>72 heures</strong>.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>9. Mineurs</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Le Service n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données concernant des mineurs. Si vous pensez qu'un enfant nous a fourni des données, contactez-nous : nous procéderons à une suppression immédiate.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>10. Cookies et stockage local</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  L'application mobile n'utilise pas de cookies au sens web du terme. Cependant, elle stocke localement sur votre appareil :
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Vos jetons de session (chiffrés via SecureStore d'iOS / Keystore d'Android).",
                    "Une copie locale chiffrée de vos données pour le mode hors-ligne.",
                    "Vos préférences (langue, paramètres de notification).",
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
                  Ces données sont effacées automatiquement lors de la désinstallation de l'application ou de la déconnexion manuelle.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>11. Modifications de cette politique</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous pouvons mettre à jour cette politique pour refléter des évolutions du Service ou des exigences légales. En cas de changement substantiel, nous vous en informerons par notification dans l'application et par email au moins 30 jours avant l'entrée en vigueur.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>12. Loi applicable</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  La présente politique est régie par la loi camerounaise. Tout litige relatif à son interprétation ou à son exécution relèvera de la compétence exclusive des juridictions de Kribi, Cameroun.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>13. Contact</h2>
                <p className="text-ink-mid leading-relaxed">
                  Pour toute question concernant cette politique ou vos données :<br />
                  📧 <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a><br />
                  📱 WhatsApp : <a href="https://wa.me/237659374501" className="text-amber hover:underline">+237 659 374 501</a><br />
                  🏢 Kessel Agritech, Ebome, Kribi, Cameroun
                </p>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-neutral-mid text-center">
              <p className="text-ink-light text-sm">Dernière mise à jour : 3 mai 2026 · Version 1.0</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
