"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  BookOpen,
  GraduationCap,
  Clock,
  RefreshCw,
  ArrowRight,
  LogIn,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; icon: typeof FileText; accent: string }> = {
  business_plan:   { label: "Business Plan",   icon: FileText,      accent: "#BA7517" },
  fiche_technique: { label: "Fiche Technique", icon: BookOpen,      accent: "#2D4A35" },
  guide:           { label: "Guide Éducatif",  icon: GraduationCap, accent: "#185FA5" },
};

interface MyDoc {
  document_id: string;
  title: string;
  slug: string;
  type: "business_plan" | "fiche_technique" | "guide";
  description: string | null;
  price: number;
  purchased_at: string | null;
  content_revised_at: string | null;
  updated_since_purchase: boolean;
}

function formatDateFr(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MesDocumentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [docs, setDocs] = useState<MyDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.rpc("list_my_documents");
      if (!error && data) setDocs(data as MyDoc[]);
      setLoading(false);
    }
    load();
  }, [user, authLoading]);

  const updatedCount = docs.filter((d) => d.updated_since_purchase).length;

  return (
    <>
      <Navbar />

      {/* HERO COURT */}
      <section className="relative bg-forest-dark pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-forest-dark/60" />
        <svg className="absolute -right-[8%] -top-[20%] w-[45%] opacity-[0.05] pointer-events-none" viewBox="0 0 600 600">
          <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
        </svg>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <p className="text-amber font-semibold text-sm uppercase tracking-wider mb-3">Espace personnel</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--serif)" }}>
            Mes documents
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Retrouve ici tous les documents que tu as acquis, accessibles à tout moment.
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <section className="py-16 bg-neutral min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-6">

          {loading ? (
            /* ── Chargement ─────────────────────────── */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                  <div className="h-5 bg-neutral-mid rounded w-1/3 mb-4" />
                  <div className="h-5 bg-neutral-mid rounded w-3/4 mb-3" />
                  <div className="h-4 bg-neutral-mid rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-mid rounded w-2/3" />
                </div>
              ))}
            </div>

          ) : !user ? (
            /* ── Non connecté ───────────────────────── */
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-forest-light rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={28} className="text-forest" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>
                Connecte-toi pour voir tes documents
              </h2>
              <p className="text-ink-light mb-6">
                Tes achats sont liés à ton compte. Connecte-toi pour y accéder à tout moment.
              </p>
              <Link
                href="/connexion?redirect=/mes-documents"
                className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              >
                <LogIn size={18} />
                Se connecter
              </Link>
            </div>

          ) : docs.length === 0 ? (
            /* ── Aucun document ─────────────────────── */
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-neutral-mid mb-4" />
              <p className="text-ink-light text-lg mb-6">
                Tu n&apos;as pas encore de document.
              </p>
              <Link
                href="/bibliotheque"
                className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              >
                Explorer la bibliothèque
                <ArrowRight size={18} />
              </Link>
            </div>

          ) : (
            /* ── Liste des documents ────────────────── */
            <>
              <p className="text-ink-light text-sm mb-8">
                {docs.length} document{docs.length > 1 ? "s" : ""}
                {updatedCount > 0 && (
                  <span className="text-amber font-semibold">
                    {" · "}{updatedCount} mis à jour depuis ton achat
                  </span>
                )}
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map((d) => {
                  const config = TYPE_CONFIG[d.type] || TYPE_CONFIG.guide;
                  const Icon = config.icon;
                  return (
                    <Link
                      key={d.document_id}
                      href={`/bibliotheque/${d.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                    >
                      {/* Bandeau mise à jour */}
                      {d.updated_since_purchase && (
                        <div className="flex items-center gap-2 bg-amber text-white text-xs font-semibold px-4 py-2">
                          <RefreshCw size={14} />
                          Mise à jour depuis ton achat
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1">
                        {/* Badge type */}
                        <div className="mb-3">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                            style={{ color: config.accent, borderColor: config.accent + "33" }}
                          >
                            <Icon size={13} />
                            {config.label}
                          </span>
                        </div>

                        {/* Titre */}
                        <h3 className="text-lg font-bold text-forest-dark mb-2 leading-tight" style={{ fontFamily: "var(--serif)" }}>
                          {d.title}
                        </h3>

                        {/* Description */}
                        {d.description && (
                          <p className="text-ink-light text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                            {d.description}
                          </p>
                        )}

                        {/* Méta + CTA */}
                        <div className="mt-auto pt-4 border-t border-neutral-mid flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs text-ink-light">
                            <Clock size={12} />
                            {d.purchased_at ? `Acheté le ${formatDateFr(d.purchased_at)}` : "Accès fondateur"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-forest font-medium text-sm group-hover:gap-2 transition-all whitespace-nowrap">
                            Consulter
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
