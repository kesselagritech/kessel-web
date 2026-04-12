"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const prerequis = [
  { 
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", 
    title: "Consultation professionnelle", 
    desc: "Rencontrez un technicien agricole ou un ingénieur agronome pour définir votre projet. Cette étape est indispensable.",
    important: true
  },
  { 
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", 
    title: "Cahier des charges", 
    desc: "Document définissant la spéculation, la zone d'implantation, la superficie, les objectifs de production.",
    important: true
  },
  { 
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", 
    title: "Compte d'exploitation prévisionnel", 
    desc: "Budget détaillé, charges prévisionnelles, chiffre d'affaires attendu, seuil de rentabilité.",
    important: true
  },
  { 
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", 
    title: "Numéro de téléphone", 
    desc: "Un numéro camerounais valide (+237) pour créer votre compte Kessel.",
    important: false
  },
];

const etapesPrealables = [
  {
    num: "01",
    title: "Choisir sa spéculation",
    desc: "Quelle culture ou quel élevage voulez-vous entreprendre ? Ce choix dépend de vos compétences, du marché local, du climat et des sols de votre zone.",
    questions: ["Quel est le marché pour ce produit ?", "Ai-je les compétences nécessaires ?", "Le climat et les sols sont-ils adaptés ?"]
  },
  {
    num: "02",
    title: "Définir la zone d'implantation",
    desc: "Où sera située votre exploitation ? La région détermine la zone agro-écologique, donc les calendriers culturaux et les variétés adaptées.",
    questions: ["Dans quelle région vais-je m'installer ?", "Ai-je accès à l'eau, aux routes ?", "Quel est le régime foncier ?"]
  },
  {
    num: "03",
    title: "Établir le budget prévisionnel",
    desc: "Combien allez-vous investir ? Un compte d'exploitation prévisionnel détaille toutes les charges et permet de calculer la rentabilité attendue.",
    questions: ["Quels sont les coûts d'installation ?", "Quelles sont les charges d'exploitation ?", "De quel fonds de roulement ai-je besoin ?"]
  },
  {
    num: "04",
    title: "Estimer le chiffre d'affaires",
    desc: "Combien pensez-vous vendre ? Cette projection est basée sur les rendements attendus et les prix du marché dans votre zone.",
    questions: ["Quel rendement puis-je espérer ?", "À quel prix vais-je vendre ?", "Quels sont mes débouchés ?"]
  },
];

const steps = [
  {
    id: 1,
    title: "Créez votre compte",
    desc: "Téléchargez l'application et inscrivez-vous avec votre numéro de téléphone. Renseignez votre nom, votre région et créez un mot de passe sécurisé.",
    mockup: {
      header: "Inscription",
      content: [
        { type: "input", label: "Téléphone", value: "+237 6XX XXX XXX" },
        { type: "input", label: "Nom complet", value: "Jean Mbarga" },
        { type: "select", label: "Région", value: "Centre" },
        { type: "input", label: "Mot de passe", value: "••••••••" },
        { type: "button", label: "Créer mon compte" },
      ],
    },
  },
  {
    id: 2,
    title: "Choisissez votre zone agro-écologique",
    desc: "Lors de la création de votre premier projet, sélectionnez la zone agro-écologique correspondant à votre exploitation. Cette information est essentielle pour obtenir des recommandations adaptées.",
    mockup: {
      header: "Nouveau projet",
      content: [
        { type: "select", label: "Zone agro-écologique", value: "Forêts Équatoriales Bimodales" },
        { type: "badge", label: "5 zones disponibles", color: "green" },
        { type: "text", value: "La zone détermine les calendriers de culture et les variétés recommandées" },
      ],
    },
  },
  {
    id: 3,
    title: "Créez votre projet agricole",
    desc: "Renseignez les informations de votre cahier des charges : spéculation, superficie, budget prévisionnel. Kessel génère automatiquement l'itinéraire technique adapté.",
    mockup: {
      header: "Nouveau projet",
      content: [
        { type: "input", label: "Nom du projet", value: "Plantation Cacao Kribi" },
        { type: "select", label: "Spéculation", value: "Cacao" },
        { type: "input", label: "Superficie (ha)", value: "2.5" },
        { type: "input", label: "Budget (FCFA)", value: "1 500 000" },
        { type: "badge", label: "ITK généré automatiquement", color: "green" },
        { type: "button", label: "Créer le projet" },
      ],
    },
  },
  {
    id: 4,
    title: "Suivez vos finances",
    desc: "Enregistrez chaque dépense et revenu au fur et à mesure. Comparez avec votre compte d'exploitation prévisionnel pour piloter votre rentabilité.",
    mockup: {
      header: "Finances",
      content: [
        { type: "stat", label: "Budget total", value: "1 500 000 FCFA" },
        { type: "stat", label: "Dépenses", value: "680 000 FCFA", color: "red" },
        { type: "stat", label: "Revenus", value: "450 000 FCFA", color: "green" },
        { type: "progress", label: "Consommation budget", value: 45 },
        { type: "list", items: ["Achat semences — 120 000", "Main d'œuvre — 85 000", "Engrais NPK — 95 000"] },
      ],
    },
  },
  {
    id: 5,
    title: "Gérez vos tâches",
    desc: "Planifiez les opérations culturales selon l'ITK généré. Recevez des rappels et marquez les tâches comme terminées pour suivre votre avancement.",
    mockup: {
      header: "Tâches",
      content: [
        { type: "task", label: "Préparation du sol", status: "done", date: "15 mars" },
        { type: "task", label: "Semis", status: "done", date: "22 mars" },
        { type: "task", label: "Premier sarclage", status: "current", date: "12 avril" },
        { type: "task", label: "Application engrais", status: "pending", date: "20 avril" },
        { type: "task", label: "Traitement phyto", status: "pending", date: "5 mai" },
      ],
    },
  },
  {
    id: 6,
    title: "Consultez les prix des marchés",
    desc: "Accédez aux prix hebdomadaires de 60+ spéculations sur les principaux marchés camerounais avec les tendances de variation.",
    mockup: {
      header: "Prix des marchés",
      content: [
        { type: "price", name: "Cacao", price: "2 400 FCFA/kg", trend: "+3%" },
        { type: "price", name: "Maïs", price: "185 FCFA/kg", trend: "+8%" },
        { type: "price", name: "Tomate", price: "320 FCFA/kg", trend: "-5%" },
        { type: "price", name: "Plantain", price: "250 FCFA/kg", trend: "+5%" },
      ],
    },
  },
  {
    id: 7,
    title: "Invitez votre technicien",
    desc: "Partagez un code d'accès unique à votre conseiller agricole. Il pourra consulter vos projets et soumettre des rapports de visite avec photos.",
    mockup: {
      header: "Mon technicien",
      content: [
        { type: "code", value: "AB3K-WP7M" },
        { type: "text", value: "Partagez ce code avec votre technicien" },
        { type: "user", name: "Jean-Paul Nkodo", role: "Technicien", status: "Connecté" },
        { type: "report", title: "Rapport du 10 avril", status: "Nouveau" },
      ],
    },
  },
];

function PhoneMockup({ step }: { step: typeof steps[0] }) {
  return (
    <div className="w-[280px] h-[560px] bg-[#0a0a0a] rounded-[2.5rem] p-2 shadow-2xl mx-auto">
      <div className="w-full h-full bg-forest-dark rounded-[2rem] overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-2">
          <span className="text-white/50 text-xs">9:41</span>
          <div className="w-16 h-4 bg-black/30 rounded-full"></div>
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
          </div>
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-white font-semibold text-center">{step.mockup.header}</h3>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {step.mockup.content.map((item, i) => (
            <div key={i}>
              {item.type === "input" && (
                <div>
                  <div className="text-white/50 text-xs mb-1">{item.label}</div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-white/80 text-sm">{item.value}</div>
                </div>
              )}
              {item.type === "select" && (
                <div>
                  <div className="text-white/50 text-xs mb-1">{item.label}</div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-white/80 text-sm flex justify-between items-center">
                    <span>{item.value}</span>
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              )}
              {item.type === "button" && (
                <button className="w-full bg-amber text-white font-semibold py-2.5 rounded-xl text-sm mt-2">{item.label}</button>
              )}
              {item.type === "badge" && (
                <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full text-center">{item.label}</div>
              )}
              {item.type === "text" && (
                <div className="text-white/50 text-xs text-center leading-relaxed">{item.value}</div>
              )}
              {item.type === "stat" && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-white/60 text-xs">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color === "red" ? "text-red-400" : item.color === "green" ? "text-green-400" : "text-white"}`}>{item.value}</span>
                </div>
              )}
              {item.type === "progress" && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">{item.label}</span>
                    <span className="text-amber">{item.value} %</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber rounded-full" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              )}
              {item.type === "list" && (
                <div className="space-y-1.5">
                  {item.items?.map((li, j) => (
                    <div key={j} className="text-white/70 text-xs bg-white/5 rounded px-2 py-1.5">{li}</div>
                  ))}
                </div>
              )}
              {item.type === "task" && (
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${item.status === "current" ? "bg-amber/20" : "bg-white/5"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.status === "done" ? "bg-green-500" : item.status === "current" ? "bg-amber" : "bg-white/20"}`}>
                    {item.status === "done" && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm ${item.status === "done" ? "text-white/50 line-through" : "text-white"}`}>{item.label}</div>
                    <div className="text-white/40 text-xs">{item.date}</div>
                  </div>
                </div>
              )}
              {item.type === "price" && (
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-white text-sm">{item.name}</span>
                  <div className="text-right">
                    <div className="text-white/80 text-sm">{item.price}</div>
                    <div className={`text-xs ${item.trend?.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{item.trend}</div>
                  </div>
                </div>
              )}
              {item.type === "code" && (
                <div className="bg-amber/20 border-2 border-dashed border-amber/50 rounded-xl py-4 text-center">
                  <div className="text-amber text-2xl font-mono font-bold tracking-widest">{item.value}</div>
                </div>
              )}
              {item.type === "user" && (
                <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                  <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-white font-bold">JP</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{item.name}</div>
                    <div className="text-white/50 text-xs">{item.role}</div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              )}
              {item.type === "report" && (
                <div className="flex items-center justify-between bg-amber/10 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <span className="text-white text-sm">{item.title}</span>
                  </div>
                  <span className="bg-amber text-white text-xs px-2 py-0.5 rounded-full">{item.status}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GuidePage() {
  useScrollReveal();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Guide d'utilisation</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Maîtrisez Kessel<br /><em className="text-amber-light">en 7 étapes.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Kessel est un outil de suivi, pas de conception. Avant de l'utiliser, préparez votre projet avec un professionnel.
          </p>
        </div>
      </section>

      {/* ALERTE IMPORTANTE */}
      <section className="bg-amber py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Consultez un professionnel avant de commencer</h3>
              <p className="text-white/90">
                La réussite d'un projet agricole se joue en amont. Kessel vous aide à suivre votre projet, mais ne remplace pas l'accompagnement d'un technicien agricole ou d'un ingénieur agronome pour sa conception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AVANT DE COMMENCER - PRÉREQUIS */}
      <section className="py-20 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Prérequis indispensables</p>
            <h2 className="reveal reveal-delay-1 text-2xl md:text-3xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Ce qu'il vous faut<br /><em>avant d'utiliser Kessel.</em>
            </h2>
            <p className="reveal reveal-delay-2 text-ink-mid mt-4 max-w-2xl mx-auto">
              Pour remplir les informations de création de projet de façon fluide et assurée, vous devez avoir préparé votre projet en amont avec un professionnel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {prerequis.map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} p-6 rounded-2xl ${item.important ? "bg-forest-dark text-white" : "bg-white shadow-sm"}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.important ? "bg-amber" : "bg-amber/20"}`}>
                  <svg className={`w-6 h-6 ${item.important ? "text-white" : "text-amber"}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${item.important ? "text-white" : "text-forest-dark"}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${item.important ? "text-white/70" : "text-ink-light"}`}>{item.desc}</p>
                {item.important && (
                  <div className="mt-3 inline-flex items-center gap-1 text-amber text-xs font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Indispensable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉTAPES PRÉALABLES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Conception du projet</p>
            <h2 className="reveal reveal-delay-1 text-2xl md:text-3xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Les questions à résoudre<br /><em>avec votre technicien.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {etapesPrealables.map((etape, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} bg-forest-light/50 p-6 rounded-2xl`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-forest text-white rounded-xl flex items-center justify-center text-lg font-bold shrink-0" style={{ fontFamily: "var(--mono)" }}>
                    {etape.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>{etape.title}</h3>
                    <p className="text-ink-mid mt-1">{etape.desc}</p>
                  </div>
                </div>
                <div className="ml-16">
                  <p className="text-xs text-ink-light uppercase tracking-wide mb-2">Questions à se poser :</p>
                  <ul className="space-y-1">
                    {etape.questions.map((q, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-ink-mid">
                        <svg className="w-4 h-4 text-amber shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Encart récapitulatif */}
          <div className="reveal mt-12 bg-forest-dark text-white p-8 rounded-2xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-amber rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2" style={{ fontFamily: "var(--serif)" }}>Le conseil professionnel : un sine qua non</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Un projet agricole viable nécessite une étude préalable rigoureuse. Le technicien agricole ou l'ingénieur agronome vous aidera à établir :
                </p>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[
                    "Un cahier des charges définissant les objectifs",
                    "Un compte d'exploitation prévisionnel détaillé",
                    "Le choix de la spéculation adaptée à votre zone",
                    "Le budget réaliste et le seuil de rentabilité"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/90">
                      <svg className="w-5 h-5 text-amber shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-amber mt-4 text-sm font-medium">
                  Une fois ces documents en main, vous pourrez créer votre projet dans Kessel avec des données fiables et réalistes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SÉPARATEUR */}
      <section className="py-12 bg-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-white/50 text-sm uppercase tracking-wider mb-2">Vous avez préparé votre projet ?</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--serif)" }}>
            Passons maintenant à<br /><em className="text-amber-light">l'utilisation de Kessel.</em>
          </h2>
        </div>
      </section>

      {/* GUIDE INTERACTIF */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          {/* Navigation étapes */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeStep === i
                    ? "bg-forest text-white"
                    : "bg-white text-forest-dark hover:bg-forest-light"
                }`}
              >
                {step.id}. {step.title}
              </button>
            ))}
          </div>

          {/* Contenu étape */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="reveal">
                <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/30 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-amber font-semibold">Étape {steps[activeStep].id}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
                  {steps[activeStep].title}
                </h2>
                <p className="text-lg text-ink-mid leading-relaxed mb-8">
                  {steps[activeStep].desc}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="px-6 py-3 border-2 border-forest text-forest rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-forest-light transition-colors"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="px-6 py-3 bg-forest text-white rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-forest-dark transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 reveal reveal-delay-1">
              <PhoneMockup step={steps[activeStep]} />
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS RAPIDES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">En résumé</p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>
              Tout ce que vous pouvez faire<br /><em>avec Kessel.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "Créer des projets", desc: "Maïs, cacao, élevage… choisissez parmi 60+ spéculations." },
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Suivre les finances", desc: "Comparez réel vs prévisionnel en temps réel." },
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", title: "Gérer les tâches", desc: "Planifiez et suivez chaque opération culturale." },
              { icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", title: "Consulter les prix", desc: "Prix hebdomadaires sur les marchés camerounais." },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Collaborer", desc: "Invitez vos techniciens et recevez leurs rapports." },
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Accéder aux ITK", desc: "78 fiches techniques adaptées à votre zone." },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${(i % 3) + 1} bg-forest-light p-6 rounded-2xl`}>
                <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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

      {/* CTA */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Prêt à commencer ?
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Téléchargez Kessel et commencez à suivre votre projet agricole professionnellement.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#telecharger" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Télécharger l'app
            </Link>
            <a href="https://wa.me/237659374501" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              Contacter un technicien
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}