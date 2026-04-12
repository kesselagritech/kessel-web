"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const itkExamples = [
  {
    speculation: "Cacao",
    zone: "Forêts Équatoriales Bimodales",
    duree: "3-5 ans jusqu'à production",
    etapes: [
      { semaine: "S1-S4", operation: "Préparation pépinière", detail: "Construction ombrière, préparation substrat" },
      { semaine: "S5-S8", operation: "Semis en pépinière", detail: "Sélection fèves, trempage, semis en sachets" },
      { semaine: "S9-S24", operation: "Entretien pépinière", detail: "Arrosage, désherbage, traitement phyto" },
      { semaine: "S25-S28", operation: "Préparation terrain", detail: "Défrichement, piquetage 3m x 3m" },
      { semaine: "S29-S32", operation: "Transplantation", detail: "Trouaison, plantation, paillage" },
      { semaine: "S33+", operation: "Entretien plantation", detail: "Désherbage, taille, traitement pourriture brune" },
    ],
    intrants: ["Semences certifiées", "Fongicide (oxyde cuivreux)", "Engrais NPK 20-10-10", "Insecticide"],
  },
  {
    speculation: "Maïs",
    zone: "Hauts Plateaux de l'Ouest",
    duree: "90-120 jours",
    etapes: [
      { semaine: "S1", operation: "Préparation du sol", detail: "Labour, hersage, nivellement" },
      { semaine: "S2", operation: "Semis", detail: "Écartement 80cm x 25cm, 2-3 graines/poquet" },
      { semaine: "S3-S4", operation: "Levée et démariage", detail: "Garder 1-2 plants/poquet" },
      { semaine: "S5", operation: "Premier sarclage", detail: "Désherbage manuel ou mécanique" },
      { semaine: "S6", operation: "Apport engrais", detail: "Urée 100kg/ha en side-dressing" },
      { semaine: "S8", operation: "Deuxième sarclage", detail: "Buttage des plants" },
      { semaine: "S12-S14", operation: "Récolte", detail: "Séchage sur pied puis égrenage" },
    ],
    intrants: ["Semences hybrides", "NPK 20-10-10", "Urée 46%", "Herbicide pré-levée"],
  },
  {
    speculation: "Tomate",
    zone: "Toutes zones (maraîchage)",
    duree: "90-120 jours",
    etapes: [
      { semaine: "S1-S3", operation: "Pépinière", detail: "Semis en planches, ombrière" },
      { semaine: "S4", operation: "Préparation planches", detail: "Fumure de fond, billonnage" },
      { semaine: "S5", operation: "Repiquage", detail: "Plants de 15-20cm, écart 50cm x 40cm" },
      { semaine: "S6-S8", operation: "Tuteurage", detail: "Piquets + ficelle, ébourgeonnage" },
      { semaine: "S7", operation: "Apport engrais", detail: "NPK + Urée en localisé" },
      { semaine: "S8-S12", operation: "Traitements phyto", detail: "Mildiou, alternariose, mouche blanche" },
      { semaine: "S10-S14", operation: "Récoltes échelonnées", detail: "Tous les 3-4 jours, fruits rosés" },
    ],
    intrants: ["Semences (Roma, Mongal)", "Fongicide (Mancozèbe)", "Insecticide", "NPK + Urée", "Tuteurs"],
  },
];

export default function ITKPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Ressources techniques</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Itinéraires techniques<br /><em className="text-amber-light">professionnels.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-3xl mx-auto">
            78 fiches ITK détaillées, adaptées aux 5 zones agro-écologiques du Cameroun. De la préparation du sol à la récolte, chaque étape est documentée.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-amber-light/30 border-b border-amber/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "78", label: "Fiches ITK" },
              { value: "60+", label: "Spéculations" },
              { value: "5", label: "Zones couvertes" },
              { value: "2", label: "Langues (FR/EN)" },
            ].map((stat, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <div className="text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>{stat.value}</div>
                <div className="text-ink-light text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QU'EST-CE QU'UN ITK */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Définition</p>
              <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
                Qu'est-ce qu'un<br /><em>itinéraire technique ?</em>
              </h2>
              <div className="reveal reveal-delay-2 space-y-4 text-ink-mid leading-relaxed">
                <p>
                  Un <strong>ITK (Itinéraire Technique de Culture)</strong> est un guide complet qui décrit, étape par étape, toutes les opérations à réaliser pour cultiver une spéculation donnée dans une zone précise.
                </p>
                <p>
                  C'est la feuille de route de l'agriculteur : du choix des semences à la récolte, en passant par la fertilisation, les traitements phytosanitaires et la gestion de l'eau.
                </p>
                <p>
                  Les ITK de Kessel sont <strong>adaptés au contexte camerounais</strong> : variétés locales, calendriers calés sur les saisons, intrants disponibles sur le marché.
                </p>
              </div>
            </div>
            <div className="reveal reveal-delay-3 bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>Contenu d'une fiche ITK</h3>
              <ul className="space-y-4">
                {[
                  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Calendrier cultural", desc: "Dates optimales de semis et récolte" },
                  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", label: "Étapes détaillées", desc: "Opérations semaine par semaine" },
                  { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", label: "Intrants recommandés", desc: "Semences, engrais, produits phyto" },
                  { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", label: "Ravageurs et maladies", desc: "Identification et traitements" },
                  { icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", label: "Rendements attendus", desc: "Objectifs de production réalistes" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-forest-light rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-forest-dark">{item.label}</div>
                      <div className="text-ink-light text-sm">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXEMPLES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Exemples</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Aperçu de nos<br /><em>fiches ITK.</em>
            </h2>
          </div>

          <div className="space-y-8">
            {itkExamples.map((itk, idx) => (
              <div key={idx} className={`reveal reveal-delay-${idx + 1} bg-forest-light/30 rounded-2xl overflow-hidden`}>
                <div className="bg-forest p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>{itk.speculation}</h3>
                      <p className="text-white/70">{itk.zone}</p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full">
                      <span className="text-white font-medium">Cycle : {itk.duree}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Étapes */}
                    <div>
                      <h4 className="font-semibold text-forest-dark mb-4">Étapes principales</h4>
                      <div className="space-y-3">
                        {itk.etapes.map((etape, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-16 text-xs font-mono bg-forest/10 text-forest rounded px-2 py-1 text-center shrink-0">
                              {etape.semaine}
                            </div>
                            <div>
                              <div className="font-medium text-forest-dark">{etape.operation}</div>
                              <div className="text-ink-light text-sm">{etape.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Intrants */}
                    <div>
                      <h4 className="font-semibold text-forest-dark mb-4">Intrants recommandés</h4>
                      <ul className="space-y-2">
                        {itk.intrants.map((intrant, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                            <span className="text-ink-mid">{intrant}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-ink-light mb-6">Ceci n'est qu'un aperçu. L'application contient 78 fiches ITK complètes.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Accédez à toutes<br /><em className="text-amber-light">les fiches ITK.</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Téléchargez Kessel et bénéficiez de 78 itinéraires techniques détaillés, adaptés à votre zone agro-écologique.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#telecharger" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Télécharger l'app
            </Link>
            <Link href="/zones" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              Voir les zones
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}