"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { BookOpen, FileText, GraduationCap, Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Document {
  id: string;
  title: string;
  slug: string;
  type: "business_plan" | "fiche_technique" | "guide";
  category_id: string | null;
  speculation: string | null;
  price: number;
  description: string | null;
  status: string;
  published_at: string | null;
  document_categories: { name: string }[] | null;
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof BookOpen; color: string; bg: string }> = {
  business_plan:   { label: "Business Plan",   icon: FileText,      color: "text-amber",  bg: "bg-amber-light" },
  fiche_technique: { label: "Fiche Technique", icon: BookOpen,      color: "text-forest",  bg: "bg-forest-light" },
  guide:           { label: "Guide Éducatif",  icon: GraduationCap, color: "text-[#185FA5]", bg: "bg-[#E6F1FB]" },
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function BibliothequePage() {
  useScrollReveal();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      const [docsRes, catsRes] = await Promise.all([
        supabase
          .from("documents")
          .select("id, title, slug, type, category_id, speculation, price, description, status, published_at, document_categories(name)")
          .eq("status", "published")
          .order("published_at", { ascending: false }),
        supabase
          .from("document_categories")
          .select("id, name, slug")
          .order("sort_order"),
      ]);
      if (docsRes.data) setDocuments(docsRes.data as Document[]);
      if (catsRes.data) setCategories(catsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  // Filtrage
  const filtered = documents.filter((d) => {
    if (filterType !== "all" && d.type !== filterType) return false;
    if (filterCategory !== "all" && d.category_id !== filterCategory) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (!d.title.toLowerCase().includes(s) && !(d.speculation || "").toLowerCase().includes(s) && !(d.description || "").toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const usedCategories = categories.filter((c) => documents.some((d) => d.category_id === c.id));

  return (
    <>
      <Navbar />

      {/* HERO COURT */}
      <section className="bg-forest-dark pt-28 pb-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -right-[8%] -top-[20%] w-[45%] opacity-[0.05]" viewBox="0 0 600 600">
            <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Bibliothèque</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Tout le savoir agricole,<br /><em className="text-amber-light">accessible et structuré.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Business plans, fiches techniques et guides éducatifs — des ressources conçues pour le terrain camerounais, par des professionnels du secteur.
          </p>
        </div>
      </section>

      {/* CATALOGUE */}
      <section className="py-16 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">

          {/* Filtres */}
          <div className="reveal flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" />
              <input
                type="text"
                placeholder="Rechercher un document…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-neutral-mid text-ink focus:outline-none focus:border-forest transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white border border-neutral-mid text-ink-mid text-sm focus:outline-none focus:border-forest transition-colors"
              >
                <option value="all">Tous les types</option>
                <option value="business_plan">Business Plans</option>
                <option value="fiche_technique">Fiches Techniques</option>
                <option value="guide">Guides Éducatifs</option>
              </select>
              {usedCategories.length > 0 && (
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border border-neutral-mid text-ink-mid text-sm focus:outline-none focus:border-forest transition-colors"
                >
                  <option value="all">Toutes les catégories</option>
                  {usedCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Compteur */}
          <p className="reveal text-ink-light text-sm mb-6">
            {loading ? "Chargement…" : `${filtered.length} document${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
          </p>

          {/* Grille de documents */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-neutral-mid rounded w-1/3 mb-4" />
                  <div className="h-6 bg-neutral-mid rounded w-3/4 mb-3" />
                  <div className="h-4 bg-neutral-mid rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-mid rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-neutral-mid mb-4" />
              <p className="text-ink-light text-lg">
                {documents.length === 0
                  ? "La bibliothèque est en cours de construction. Revenez bientôt !"
                  : "Aucun document ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc, i) => {
                const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
                const Icon = config.icon;

                return (
                  <div
                    key={doc.id}
                    className={`reveal reveal-delay-${(i % 3) + 1} bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col`}
                  >
                    {/* Badge type */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} text-xs font-medium px-3 py-1 rounded-full`}>
                        <Icon size={14} />
                        {config.label}
                      </span>
                      {doc.speculation && (
                        <span className="text-xs text-ink-light bg-neutral rounded-full px-3 py-1">
                          {doc.speculation}
                        </span>
                      )}
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-forest-dark mb-2" style={{ fontFamily: "var(--serif)" }}>
                      {doc.title}
                    </h3>

                    {/* Description */}
                    {doc.description && (
                      <p className="text-ink-light text-sm leading-relaxed mb-4 flex-1">
                        {doc.description}
                      </p>
                    )}

                    {/* Catégorie */}
                    {doc.document_categories?.[0]?.name && (
                      <p className="text-xs text-ink-light mb-4">
                        {doc.document_categories[0].name}
                      </p>
                    )}

                    {/* Prix + CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-mid mt-auto">
                      <span className="text-lg font-bold text-amber" style={{ fontFamily: "var(--mono)" }}>
                        {doc.price.toLocaleString("fr-FR")} FCFA
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-forest hover:bg-forest-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer">
                        Bientôt
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA — Consultation */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Besoin d&apos;un accompagnement sur mesure ?</p>
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>
            Ces documents sont des <em>outils de compréhension.</em>
          </h2>
          <p className="reveal reveal-delay-2 text-ink-light leading-relaxed mb-8 max-w-xl mx-auto">
            Pour un business plan utilisable auprès des bailleurs de fonds, adapté à votre parcelle et à vos objectifs, nos équipes réalisent des études personnalisées sur devis.
          </p>
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/237659374501"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6 0-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6 0 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.6-.4M12 21.8c-1.7 0-3.3-.4-4.7-1.3l-3.3.9.9-3.2c-1-1.4-1.5-3.1-1.5-4.8C3.4 8.7 7.2 4.9 12 4.9c4.8 0 8.6 3.8 8.6 8.6.1 4.7-3.8 8.3-8.6 8.3M12 3C7.2 3 3 7.2 3 12c0 1.8.5 3.6 1.5 5.1L3 22l5-1.3c1.4.8 3 1.2 4.7 1.2h.3c5 0 9-4.1 9-9.1 0-2.4-1-4.7-2.7-6.4S14.4 3 12 3" />
              </svg>
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-forest hover:bg-forest-light text-forest font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
