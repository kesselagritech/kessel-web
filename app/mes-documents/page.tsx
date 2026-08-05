"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  RefreshCw,
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
  speculation: string | null;
  category_name: string | null;
  description: string | null;
  price: number;
  purchased_at: string | null;
  content_revised_at: string | null;
  updated_since_purchase: boolean;
}

// ─── Vignette imagée (identique à la bibliothèque) ────────────────────────────
function getCoverImage(slug: string): string {
  return `/images/bibliotheque/${slug}.jpg`;
}

function DocCover({ doc }: { doc: MyDoc }) {
  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
  const Icon = config.icon;
  const coverUrl = getCoverImage(doc.slug);

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-forest-dark">
      <Image
        src={coverUrl}
        alt={doc.title}
        fill
        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        quality={80}
      />
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

      {/* Badge mise à jour depuis l'achat */}
      {doc.updated_since_purchase && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 bg-amber text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
            <RefreshCw size={12} />
            Mis à jour
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

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MesAchatsPage() {
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

      {/* HERO — même photo que la bibliothèque */}
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

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Bouton retour */}
          <Link
            href="/bibliotheque"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à la bibliothèque
          </Link>

          <p className="text-amber font-semibold text-sm uppercase tracking-wider mb-3">Espace personnel</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--serif)" }}>
            Mes achats
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Retrouve ici tous les documents que tu as acquis, accessibles à tout moment.
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <section className="py-16 bg-neutral min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-6">

          {loading ? (
            /* ── Chargement ─────────────────────────── */
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

          ) : !user ? (
            /* ── Non connecté ───────────────────────── */
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-forest-light rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={28} className="text-forest" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>
                Connecte-toi pour voir tes achats
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
            /* ── Aucun achat ────────────────────────── */
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-neutral-mid mb-4" />
              <p className="text-ink-light text-lg mb-6">
                Tu n&apos;as pas encore acheté de document.
              </p>
              <Link
                href="/bibliotheque"
                className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              >
                Explorer la bibliothèque
              </Link>
            </div>

          ) : (
            /* ── Grille des achats (carte identique à la vitrine) ── */
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
                {docs.map((doc) => {
                  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
                  return (
                    <Link
                      key={doc.document_id}
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
                        {doc.category_name && (
                          <p className="text-xs text-ink-light mb-3 uppercase tracking-wide">
                            {doc.category_name}
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
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
