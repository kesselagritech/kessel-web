"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

const zones = [
  {
    id: 1,
    name: "Hauts Plateaux de l'Ouest",
    shortName: "Hauts Plateaux",
    color: "#3B6D11",
    regions: ["Ouest", "Nord-Ouest", "Partie de l'Adamaoua"],
    altitude: "1 000 – 2 500 m",
    pluvio: "1 500 – 2 500 mm/an",
    climat: "Climat tropical d'altitude, frais et humide",
    saisons: [
      { nom: "Saison sèche", mois: "Novembre – Février" },
      { nom: "Saison des pluies", mois: "Mars – Octobre" },
    ],
    speculations: ["Maïs", "Haricot", "Pomme de terre", "Chou", "Tomate", "Café arabica", "Thé", "Élevage bovin"],
    specificites: [
      "Sols volcaniques très fertiles",
      "Températures fraîches favorables aux cultures tempérées",
      "Forte densité de population agricole",
      "Risque d'érosion sur les pentes",
    ],
  },
  {
    id: 2,
    name: "Forêts Équatoriales Bimodales",
    shortName: "Forêts Bimodales",
    color: "#1A5D3A",
    regions: ["Centre", "Sud", "Est"],
    altitude: "400 – 1 000 m",
    pluvio: "1 500 – 2 000 mm/an",
    climat: "Climat équatorial à 4 saisons",
    saisons: [
      { nom: "Grande saison sèche", mois: "Décembre – Février" },
      { nom: "Petite saison des pluies", mois: "Mars – Juin" },
      { nom: "Petite saison sèche", mois: "Juillet – Août" },
      { nom: "Grande saison des pluies", mois: "Septembre – Novembre" },
    ],
    speculations: ["Cacao", "Manioc", "Plantain", "Arachide", "Maïs", "Palmier à huile", "Hévéa"],
    specificites: [
      "Deux cycles de culture par an possibles",
      "Sols ferrallitiques acides",
      "Forte pression des maladies fongiques",
      "Zone de prédilection du cacao",
    ],
  },
  {
    id: 3,
    name: "Forêts Équatoriales Monomodales",
    shortName: "Forêts Monomodales",
    color: "#2D7A4E",
    regions: ["Littoral", "Sud-Ouest"],
    altitude: "0 – 500 m",
    pluvio: "2 500 – 4 000 mm/an",
    climat: "Climat équatorial très humide",
    saisons: [
      { nom: "Saison sèche courte", mois: "Décembre – Février" },
      { nom: "Saison des pluies", mois: "Mars – Novembre" },
    ],
    speculations: ["Palmier à huile", "Hévéa", "Banane", "Plantain", "Cacao", "Ananas", "Poivre"],
    specificites: [
      "Pluviométrie la plus élevée du pays",
      "Un seul cycle cultural principal",
      "Sols hydromorphes dans les bas-fonds",
      "Adapté aux cultures pérennes",
    ],
  },
  {
    id: 4,
    name: "Hautes Savanes Guinéennes",
    shortName: "Savanes Guinéennes",
    color: "#8B7355",
    regions: ["Adamaoua"],
    altitude: "900 – 1 500 m",
    pluvio: "1 400 – 1 800 mm/an",
    climat: "Climat tropical d'altitude, transition forêt-savane",
    saisons: [
      { nom: "Saison sèche", mois: "Novembre – Mars" },
      { nom: "Saison des pluies", mois: "Avril – Octobre" },
    ],
    speculations: ["Maïs", "Manioc", "Igname", "Sorgho", "Élevage bovin", "Pomme de terre", "Haricot"],
    specificites: [
      "Zone de transition écologique",
      "Grand potentiel pastoral (zébus)",
      "Sols assez fertiles mais sensibles",
      "Températures modérées toute l'année",
    ],
  },
  {
    id: 5,
    name: "Soudano-Sahélienne",
    shortName: "Soudano-Sahélienne",
    color: "#C4A35A",
    regions: ["Nord", "Extrême-Nord"],
    altitude: "200 – 500 m",
    pluvio: "400 – 1 200 mm/an",
    climat: "Climat tropical sec, semi-aride au nord",
    saisons: [
      { nom: "Saison sèche longue", mois: "Octobre – Mai" },
      { nom: "Saison des pluies courte", mois: "Juin – Septembre" },
    ],
    speculations: ["Sorgho", "Mil", "Arachide", "Coton", "Oignon", "Niébé", "Élevage (bovins, caprins, ovins)"],
    specificites: [
      "Contrainte hydrique majeure",
      "Un seul cycle cultural par an",
      "Agriculture pluviale dominante",
      "Irrigation indispensable en contre-saison",
    ],
  },
];

export default function ZonesPage() {
  useScrollReveal();
  const [activeZone, setActiveZone] = useState(0);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Agronomie</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Les 5 zones agro-écologiques<br /><em className="text-amber-light">du Cameroun.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-3xl mx-auto">
            Le Cameroun est souvent appelé « l'Afrique en miniature » grâce à sa diversité climatique exceptionnelle. Kessel adapte ses recommandations à chaque zone pour des conseils vraiment pertinents.
          </p>
        </div>
      </section>

      {/* POURQUOI C'EST IMPORTANT */}
      <section className="py-16 bg-amber-light/30 border-y border-amber/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", title: "Calendriers adaptés", desc: "Chaque zone a ses propres saisons. Kessel ajuste automatiquement les dates de semis et de récolte." },
              { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", title: "Itinéraires techniques ciblés", desc: "Les fiches ITK tiennent compte des spécificités locales : sols, maladies, variétés adaptées." },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Meilleurs rendements", desc: "Cultiver la bonne spéculation au bon endroit, c'est maximiser vos chances de succès." },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="w-14 h-14 bg-amber/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-amber-dark" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-forest-dark mb-2">{item.title}</h3>
                <p className="text-ink-light text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {zones.map((zone, i) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeZone === i
                    ? "bg-forest text-white shadow-lg"
                    : "bg-white text-forest-dark hover:bg-forest-light"
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }}></span>
                {zone.shortName}
              </button>
            ))}
          </div>

          {/* Détail zone */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="p-2">
              <div className="h-4 rounded-t-2xl" style={{ backgroundColor: zones[activeZone].color }}></div>
            </div>
            <div className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Infos */}
                <div>
                  <h2 className="text-3xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>
                    {zones[activeZone].name}
                  </h2>
                  <p className="text-ink-mid mb-6">{zones[activeZone].climat}</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-forest-light rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <div className="text-sm text-ink-light">Régions</div>
                        <div className="font-semibold text-forest-dark">{zones[activeZone].regions.join(", ")}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-forest-light rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                      </div>
                      <div>
                        <div className="text-sm text-ink-light">Pluviométrie</div>
                        <div className="font-semibold text-forest-dark">{zones[activeZone].pluvio}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-forest-light rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      </div>
                      <div>
                        <div className="text-sm text-ink-light">Altitude</div>
                        <div className="font-semibold text-forest-dark">{zones[activeZone].altitude}</div>
                      </div>
                    </div>
                  </div>

                  {/* Saisons */}
                  <h3 className="text-lg font-semibold text-forest-dark mb-3">Saisons</h3>
                  <div className="space-y-2 mb-8">
                    {zones[activeZone].saisons.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 bg-forest-light/50 rounded-lg px-4 py-2">
                        <div className={`w-2 h-2 rounded-full ${s.nom.includes("sèche") ? "bg-amber" : "bg-blue-500"}`}></div>
                        <span className="font-medium text-forest-dark">{s.nom}</span>
                        <span className="text-ink-light text-sm ml-auto">{s.mois}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spéculations et spécificités */}
                <div>
                  <h3 className="text-lg font-semibold text-forest-dark mb-3">Spéculations adaptées</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {zones[activeZone].speculations.map((spec, i) => (
                      <span key={i} className="bg-forest-light text-forest-dark px-3 py-1.5 rounded-full text-sm font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-forest-dark mb-3">Spécificités</h3>
                  <ul className="space-y-3">
                    {zones[activeZone].specificites.map((spec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                        <span className="text-ink-mid">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Des conseils adaptés<br /><em className="text-amber-light">à votre zone.</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Kessel utilise ces données pour vous proposer des itinéraires techniques et des calendriers parfaitement adaptés à votre environnement.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/itk" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Voir les ITK
            </Link>
            <Link href="/speculations" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              Explorer les spéculations
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}