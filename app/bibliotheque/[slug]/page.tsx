import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseServer } from "@/lib/supabaseServer";
import { TYPE_CONFIG, DOC_PUBLIC_COLUMNS, formatDateFr, type DocumentDetail } from "./shared";
import DocumentInteractive from "./DocumentInteractive";

// ─── Chargement côté serveur (vitrine publique, sans contenu payant) ─────────
// cache() : une seule requête partagée entre generateMetadata et la page.

const getDocument = cache(async (slug: string): Promise<DocumentDetail | null> => {
  const { data, error } = await supabaseServer
    .from("documents")
    .select(DOC_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  // Erreur réseau/serveur → erreur 500 (Google réessaiera), surtout pas une 404
  if (error) throw new Error(`Chargement document « ${slug} » : ${error.message}`);
  return (data as unknown as DocumentDetail) ?? null;
});

type Props = { params: Promise<{ slug: string }> };

// ─── Étiquettes propres à chaque fiche (Google, WhatsApp, réseaux) ────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocument(slug);

  if (!doc) {
    return { title: "Document introuvable | Kessel Agritech", robots: { index: false } };
  }

  const label = (TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide).label;
  const title = `${doc.title} — ${label} | Kessel Agritech`;
  const description = doc.description || `${label} de la bibliothèque Kessel Agritech.`;
  const path = `/bibliotheque/${doc.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Kessel Agritech",
      locale: "fr_CM",
      type: "article",
      images: [{ url: `/images/bibliotheque/${doc.slug}.jpg` }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DocumentPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocument(slug);
  if (!doc) notFound();

  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
  const Icon = config.icon;
  const coverUrl = `/images/bibliotheque/${doc.slug}.jpg`;

  return (
    <>
      <Navbar />

      {/* ─── HERO DOCUMENT ──────────────────────────────────── */}
      <section className="relative bg-forest-dark pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${coverUrl}), url(/images/hero-home.jpg)`,
            backgroundColor: "#1A3D25",
          }}
        />
        <div className="absolute inset-0 bg-forest-dark/75" />
        <svg className="absolute -right-[8%] -top-[20%] w-[45%] opacity-[0.05] pointer-events-none" viewBox="0 0 600 600">
          <polygon points="300,20 560,150 560,450 300,580 40,450 40,150" stroke="white" strokeWidth="2" fill="none" />
        </svg>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Retour */}
          <Link
            href="/bibliotheque"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Bibliothèque
          </Link>

          {/* Badge type */}
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-1.5 bg-white/95 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ color: config.accent }}
            >
              <Icon size={13} />
              {config.label}
            </span>
          </div>

          {/* Titre */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--serif)" }}
          >
            {doc.title}
          </h1>

          {/* Spéculation + catégorie */}
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm">
            {doc.speculation && <span>{doc.speculation}</span>}
            {doc.speculation && doc.document_categories?.[0]?.name && (
              <span className="w-1 h-1 rounded-full bg-white/40" />
            )}
            {doc.document_categories?.[0]?.name && (
              <span>{doc.document_categories[0].name}</span>
            )}
            {doc.content_revised_at && (
              <>
                {(doc.speculation || doc.document_categories?.[0]?.name) && (
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  Mis à jour le {formatDateFr(doc.content_revised_at)}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── CONTENU ────────────────────────────────────────── */}
      <section className="py-16 bg-neutral">
        <div className="max-w-4xl mx-auto px-6">

          {/* Description */}
          {doc.description && (
            <p className="text-ink-light text-lg leading-relaxed mb-10">
              {doc.description}
            </p>
          )}

          {/* Partie interactive : achat, paiement, contenu, ressources liées */}
          <Suspense
            fallback={
              <div className="text-center py-16">
                <div className="animate-pulse text-ink-light">Vérification…</div>
              </div>
            }
          >
            <DocumentInteractive doc={doc} />
          </Suspense>
        </div>
      </section>

      {/* ─── CTA CONSULTATION ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-amber font-semibold text-sm uppercase tracking-wider mb-3">
            {`Besoin d'un accompagnement sur mesure ?`}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-forest-dark mb-6"
            style={{ fontFamily: "var(--serif)" }}
          >
            Ce document est un <em>outil de compréhension.</em>
          </h2>
          <p className="text-ink-light leading-relaxed mb-8 max-w-xl mx-auto">
            {`Pour un accompagnement adapté à ta parcelle et à tes objectifs, nos équipes réalisent des études personnalisées sur devis.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
