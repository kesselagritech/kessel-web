"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
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
          <p className="reveal reveal-delay-2 text-white/70 text-sm">
            Version 1.0 · En vigueur le 3 mai 2026 · <Link href="/cgu/en" className="underline hover:text-amber">English version</Link>
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
                  Les présentes Conditions Générales d'Utilisation (« <strong>CGU</strong> ») régissent l'utilisation de l'application mobile Kessel et de l'ensemble des services associés (le « <strong>Service</strong> »), édités par Kessel Agritech. En téléchargeant, installant ou utilisant le Service, vous (« <strong>Utilisateur</strong> ») reconnaissez avoir lu et accepté sans réserve les présentes CGU.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Identité de l'éditeur</h2>
                <div className="bg-forest-light p-6 rounded-xl mb-8">
                  <p className="text-forest-dark"><strong>Kessel Agritech</strong> (immatriculation RCCM en cours)</p>
                  <p className="text-ink-mid">Représenté par : Atine Mvom Philippe André, Fondateur et Directeur</p>
                  <p className="text-ink-mid">Adresse : Ebome, Kribi, Cameroun</p>
                  <p className="text-ink-mid">Email : <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a></p>
                </div>
              </div>

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Description du Service</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Kessel est une application mobile d'aide à la gestion de projets agricoles destinée aux agriculteurs et techniciens agricoles, principalement au Cameroun. Le Service permet notamment :
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "La création et le suivi de projets agricoles.",
                    "La planification et la gestion de tâches terrain.",
                    "La capture et la géolocalisation de rapports photo de preuves.",
                    "Le suivi financier des projets (dépenses, revenus).",
                    "La consultation de prix de marchés.",
                    "L'invitation et la collaboration avec des techniciens agricoles.",
                    "La réception de rappels et alertes (météo, prix, tâches).",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-light/30 border border-amber/30 rounded-xl p-5 mb-8">
                  <p className="text-forest-dark font-semibold mb-2">⚠️ Doctrine d'usage : « Kessel aide, ne prescrit pas »</p>
                  <p className="text-ink-mid text-sm">
                    Le Service fournit des informations, des outils de suivi et des indicateurs. Il n'a en aucun cas vocation à se substituer à l'expertise d'un technicien agricole, d'un agronome ou de tout professionnel qualifié. Les décisions agricoles relèvent de la seule responsabilité de l'Utilisateur.
                  </p>
                </div>
              </div>

              <div className="reveal reveal-delay-3">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Conditions d'accès</h2>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">3.1 Capacité juridique</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Le Service est réservé aux personnes <strong>majeures</strong> (18 ans révolus) disposant de la capacité juridique de contracter. En vous inscrivant, vous garantissez remplir ces conditions.
                </p>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">3.2 Création de compte</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  L'accès au Service nécessite la création d'un compte avec un numéro de téléphone valide (formats camerounais Orange ou MTN, ou autres formats internationaux supportés). Vous vous engagez à fournir des informations exactes et à les maintenir à jour. Vous êtes seul responsable de la confidentialité de votre code/mot de passe.
                </p>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">3.3 Compatibilité technique</h3>
                <ul className="space-y-2 mb-8">
                  {[
                    "Téléphone Android (version 7.0 / API 24 minimum) ou iPhone (iOS 15 minimum).",
                    "Connexion internet pour la synchronisation (mode hors-ligne disponible pour la majorité des fonctions).",
                    "Espace de stockage minimum de 200 Mo.",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Tarification</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Le Service est actuellement proposé <strong>gratuitement</strong> à l'ensemble des utilisateurs (promoteurs, techniciens, partenaires). Aucune carte bancaire ni moyen de paiement n'est requis pour utiliser l'Application ou ses fonctionnalités.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Des formules payantes destinées aux entreprises agricoles et coopératives pourront être introduites dans des versions ultérieures du Service. Leurs modalités, tarifs et conditions seront communiqués aux utilisateurs concernés en amont, et la souscription restera optionnelle. Aucun prélèvement ne pourra être effectué sans action explicite de votre part.
                </p>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Engagements de l'Utilisateur</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  En utilisant le Service, vous vous engagez à :
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Respecter la loi camerounaise (notamment loi n° 2010/012 sur la cybercriminalité).",
                    "Ne pas utiliser le Service à des fins frauduleuses ou contraires aux bonnes mœurs.",
                    "Ne pas tenter de contourner les mesures de sécurité.",
                    "Ne pas effectuer de rétro-ingénierie ou décompilation du code.",
                    "Ne pas surcharger ou perturber le fonctionnement des serveurs.",
                    "Ne pas usurper l'identité d'un autre utilisateur.",
                    "Respecter les techniciens agricoles que vous invitez : pas de harcèlement, pas de propos discriminatoires.",
                    "Garantir la véracité des informations agricoles que vous saisissez.",
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

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Contenu publié par l'Utilisateur</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Vous restez propriétaire des contenus que vous publiez via le Service (photos, rapports, données de projets). Toutefois, en utilisant le Service, vous nous accordez une <strong>licence non exclusive, mondiale, gratuite</strong> d'utiliser, stocker, reproduire et adapter ces contenus, uniquement dans la mesure nécessaire à la fourniture du Service. Vous garantissez disposer de tous les droits nécessaires sur les contenus publiés.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>7. Propriété intellectuelle</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  L'application Kessel, sa marque, son logo (l'hexagone et le « K »), son interface, son code source, ses textes, illustrations, et toute documentation associée sont la propriété exclusive de Kessel Agritech. Toute reproduction, représentation, modification ou exploitation non expressément autorisée constitue une contrefaçon et est passible de poursuites.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>8. Disponibilité du Service</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous nous efforçons d'assurer la disponibilité du Service 24h/24 et 7j/7, mais ne pouvons garantir une disponibilité absolue. Le Service peut être temporairement interrompu pour des opérations de maintenance, de mise à jour ou en cas de force majeure.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>9. Limitation de responsabilité</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Le Service est fourni « <strong>en l'état</strong> ». Nous ne garantissons pas :
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "L'exactitude absolue des informations fournies (prix de marché, météo, rappels).",
                    "L'absence totale de bogues ou d'interruptions.",
                    "L'adéquation du Service à un usage particulier autre que celui décrit.",
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
                  Notre responsabilité est limitée au montant effectivement versé par l'Utilisateur au cours des 12 derniers mois. Nous ne sommes en aucun cas responsables des dommages indirects (perte de récolte, manque à gagner, perte de données utilisateur).
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>10. Données personnelles</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Le traitement de vos données personnelles est régi par notre <Link href="/confidentialite" className="text-amber hover:underline">Politique de confidentialité</Link>, qui fait partie intégrante des présentes CGU.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>11. Suppression de compte</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Vous pouvez supprimer votre compte à tout moment :
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-ink-mid">
                    <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    Depuis l'application : Paramètres → Supprimer mon compte.
                  </li>
                  <li className="flex items-start gap-2 text-ink-mid">
                    <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    Par email à <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a>.
                  </li>
                </ul>
                <p className="text-ink-mid leading-relaxed mb-8">
                  La suppression est effective sous 30 jours (délai de réversibilité). Au-delà, toutes vos données sont définitivement effacées, à l'exception des éléments soumis à des obligations légales de conservation.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>12. Résiliation par Kessel</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous pouvons suspendre ou résilier votre accès au Service en cas de manquement grave aux présentes CGU, d'utilisation frauduleuse, de mise en danger de la sécurité du Service ou d'inactivité prolongée (plus de 24 mois sans connexion). Dans la mesure du possible, nous vous notifierons préalablement.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>13. Modifications des CGU</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Nous pouvons modifier les présentes CGU pour refléter des évolutions du Service ou des exigences légales. Toute modification substantielle vous sera notifiée au moins 30 jours avant son entrée en vigueur, par notification dans l'application et par email.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>14. Loi applicable et règlement des litiges</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Les présentes CGU sont régies par la <strong>loi camerounaise</strong>. En cas de litige, les parties s'efforceront d'abord de trouver une solution amiable. À défaut, le litige sera porté devant les juridictions compétentes de <strong>Kribi, Cameroun</strong>, sauf disposition légale impérative contraire.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>15. Contact</h2>
                <p className="text-ink-mid leading-relaxed">
                  Pour toute question relative aux présentes CGU :<br />
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
