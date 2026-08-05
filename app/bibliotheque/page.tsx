"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  created_at: string | null;
  document_categories: { name: string }[] | null;
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof BookOpen; accent: string }> = {
  business_plan:   { label: "Business Plan",   icon: FileText,      accent: "#BA7517" },
  fiche_technique: { label: "Fiche Technique", icon: BookOpen,      accent: "#2D4A35" },
  guide:           { label: "Guide Éducatif",  icon: GraduationCap, accent: "#185FA5" },
};

// Ordre stable des types pour le tri
const TYPE_ORDER: Record<string, number> = {
  business_plan: 1,
  fiche_technique: 2,
  guide: 3,
};

// Pagination
const PAGE_SIZE = 15;

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 1;
  const range: (number | "…")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  range.push(total);
  return range;
}

// ─── Vignette imagée ──────────────────────────────────────────────────────────
// Cherche /public/images/bibliotheque/{slug-du-document}.jpg
const NEW_WINDOW_DAYS = 30;
function isNew(doc: Document): boolean {
  const ref = doc.published_at ?? doc.created_at;
  if (!ref) return false;
  const t = new Date(ref).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

function getCoverImage(doc: Document): string {
  return `/images/bibliotheque/${doc.slug}.jpg`;
}

function DocCover({ doc }: { doc: Document }) {
  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
  const Icon = config.icon;
  const coverUrl = getCoverImage(doc);

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-forest-dark">
      {/* Miniature optimisée : next/image gère AVIF/WebP + resize CDN Vercel + lazy loading */}
      <Image
        src={coverUrl}
        alt={doc.title}
        fill
        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        quality={80}
      />
      {/* Voile dégradé pour lisibilité du badge */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 via-transparent to-forest-dark/40" />

      {/* Badge type */}
      <div className="absolute top-4 left-4">
        <span
          className="inline-flex items-center gap-1.5 bg-white/95 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
          style={{ color: config.accent }}
        >
          <Icon size={13} />
          {config.label}
        </span>
      </div>

      {/* Badge nouveauté */}
      {isNew(doc) && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center bg-amber text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
            Nouveau
          </span>
        </div>
      )}

      {/* Spéculation en bas */}
      {doc.speculation && (
        <div className="absolute bottom-4 left-4">
          <span className="text-white text-sm font-semibold" style={{ fontFamily: "var(--serif)" }}>
            {doc.speculation}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Sélecteur custom (flèche bien positionnée) ───────────────────────────────
function FilterSelect({
  value, onChange, children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 min-w-[160px] max-w-[240px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-white border border-neutral-mid text-ink-mid text-sm focus:outline-none focus:border-forest transition-colors cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none"
      />
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function BibliothequePage() {
  useScrollReveal();
  const { user } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const [docsRes, catsRes] = await Promise.all([
        supabase
          .from("documents")
          .select("id, title, slug, type, category_id, speculation, price, description, status, published_at, created_at, document_categories(name)")
          .eq("status", "published"),
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

  // Filtrage + tri (type puis alpha)
  const sorted = useMemo(() => {
    const filtered = documents.filter((d) => {
      if (filterType !== "all" && d.type !== filterType) return false;
      if (filterCategory !== "all" && d.category_id !== filterCategory) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        if (
          !d.title.toLowerCase().includes(s) &&
          !(d.speculation || "").toLowerCase().includes(s) &&
          !(d.description || "").toLowerCase().includes(s)
        ) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      const typeCompare = (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99);
      if (typeCompare !== 0) return typeCompare;
      return a.title.localeCompare(b.title, "fr", { sensitivity: "base" });
    });
  }, [documents, filterType, filterCategory, searchTerm]);

  // Reset pagination quand filtres/recherche changent
  useEffect(() => {
    setPageIndex(0);
  }, [filterType, filterCategory, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const paginated = sorted.slice(safePageIndex * PAGE_SIZE, (safePageIndex + 1) * PAGE_SIZE);
  const startIdx = sorted.length === 0 ? 0 : safePageIndex * PAGE_SIZE + 1;
  const endIdx = Math.min((safePageIndex + 1) * PAGE_SIZE, sorted.length);

  const usedCategories = categories.filter((c) => documents.some((d) => d.category_id === c.id));

  return (
    <>
      <Navbar />

      {/* HERO COURT */}
      <section className="relative bg-forest-dark pt-28 pb-16 overflow-hidden">
        <Image
          src="/images/bibliotheque-hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-forest-dark/70" />
        <svg className="absolute -right-[8%] -top-[20%] w-[45%] opacity-[0.05] pointer-events-none" viewBox="0 0 600 600">
          <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
        </svg>

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
          <div className="flex flex-col gap-4 mb-10">
            <div className="relative w-full max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" />
              <input
                type="text"
                placeholder="Rechercher un document…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-neutral-mid text-ink focus:outline-none focus:border-forest transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <FilterSelect value={filterType} onChange={setFilterType}>
                <option value="all">Tous les types</option>
                <option value="business_plan">Business Plans</option>
                <option value="fiche_technique">Fiches Techniques</option>
                <option value="guide">Guides Éducatifs</option>
              </FilterSelect>
              {usedCategories.length > 0 && (
                <FilterSelect value={filterCategory} onChange={setFilterCategory}>
                  <option value="all">Toutes les catégories</option>
                  {usedCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </FilterSelect>
              )}

              {user && (
                <Link
                  href="/mes-documents"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-forest text-forest hover:bg-forest-light font-medium text-sm transition-colors sm:ml-auto"
                >
                  <BookOpen size={16} />
                  Mes achats
                </Link>
              )}
            </div>
          </div>

          {/* Compteur */}
          <p className="text-ink-light text-sm mb-6">
            {loading
              ? "Chargement…"
              : sorted.length === 0
              ? "0 document"
              : `${sorted.length} document${sorted.length > 1 ? "s" : ""} · Affichage ${startIdx}–${endIdx}`}
          </p>

          {/* Grille */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-neutral-mid" />
                  <div className="p-5">
                    <div className="h-5 bg-neutral-mid rounded w-3/4 mb-3" />
                    <div className="h-4 bg-neutral-mid rounded w-full mb-2" />
                    <div className="h-4 bg-neutral-mid rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-neutral-mid mb-4" />
              <p className="text-ink-light text-lg">
                {documents.length === 0
                  ? "La bibliothèque est en cours de construction. Revenez bientôt !"
                  : "Aucun document ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((doc) => {
                  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
                  return (
                    <Link
                      key={doc.id}
                      href={`/bibliotheque/${doc.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                    >
                      <DocCover doc={doc} />

                      <div className="p-5 flex flex-col flex-1">
                        {/* Titre */}
                        <h3 className="text-lg font-bold text-forest-dark mb-2 leading-tight" style={{ fontFamily: "var(--serif)" }}>
                          {doc.title}
                        </h3>

                        {/* Description */}
                        {doc.description && (
                          <p className="text-ink-light text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                            {doc.description}
                          </p>
                        )}

                        {/* Catégorie */}
                        {doc.document_categories?.[0]?.name && (
                          <p className="text-xs text-ink-light mb-3 uppercase tracking-wide">
                            {doc.document_categories[0].name}
                          </p>
                        )}

                        {/* Prix + CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-mid mt-auto">
                          <div>
                            <span className="text-xl font-bold" style={{ fontFamily: "var(--mono)", color: config.accent }}>
                              {doc.price.toLocaleString("fr-FR")}
                            </span>
                            <span className="text-xs text-ink-light ml-1">FCFA</span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 bg-forest hover:bg-forest-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors ">
                            Consulter
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center flex-wrap gap-2 mt-12">
                  <button
                    type="button"
                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                    disabled={safePageIndex === 0}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-neutral-mid text-forest-dark hover:border-forest hover:bg-forest-light disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-mid transition-colors"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageNumbers(safePageIndex + 1, totalPages).map((p, idx) =>
                    p === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-ink-light select-none">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPageIndex(p - 1)}
                        aria-label={`Page ${p}`}
                        aria-current={safePageIndex === p - 1 ? "page" : undefined}
                        className={
                          "min-w-[40px] h-10 px-3 rounded-xl font-medium text-sm transition-colors " +
                          (safePageIndex === p - 1
                            ? "bg-forest text-white"
                            : "bg-white border border-neutral-mid text-forest-dark hover:border-forest hover:bg-forest-light")
                        }
                        style={{ fontFamily: "var(--mono)" }}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={safePageIndex === totalPages - 1}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-neutral-mid text-forest-dark hover:border-forest hover:bg-forest-light disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-mid transition-colors"
                    aria-label="Page suivante"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
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
