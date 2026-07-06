"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Lock, LogIn, FileText, BookOpen, GraduationCap, CreditCard, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; icon: typeof FileText; accent: string }> = {
  business_plan:   { label: "Business Plan",   icon: FileText,      accent: "#BA7517" },
  fiche_technique: { label: "Fiche Technique", icon: BookOpen,      accent: "#2D4A35" },
  guide:           { label: "Guide Éducatif",  icon: GraduationCap, accent: "#185FA5" },
};

interface DocumentDetail {
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

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DocumentPage() {
  useScrollReveal();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();

  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  // États paiement CamPay
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const slug = params.slug as string;
  const paiement = searchParams.get("paiement");
  const purchaseRef = searchParams.get("ref");

  // 1. Charger les métadonnées du document (sans le contenu)
  useEffect(() => {
    async function loadDoc() {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, slug, type, category_id, speculation, price, description, status, published_at, document_categories(name)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error || !data) {
        router.push("/bibliotheque");
        return;
      }
      setDoc(data as DocumentDetail);
      setLoading(false);
    }
    loadDoc();
  }, [slug, router]);

  // 2. Vérifier l'achat + charger le contenu si acheté
  useEffect(() => {
    async function checkAndFetch() {
      if (!doc) return;

      if (!session?.user) {
        setCheckingPurchase(false);
        return;
      }

      // Vérifier l'achat
      const { data: purchases } = await supabase
        .from("document_purchases")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("document_id", doc.id)
        .eq("payment_status", "completed")
        .limit(1);

      const isFondateur = session.user.email?.toLowerCase() === "philatine04@gmail.com";
      const purchased = isFondateur || (purchases || []).length > 0;
      setHasPurchased(purchased);

      // Charger le contenu via RPC sécurisée
      if (purchased) {
        const { data: contentData } = await supabase
          .rpc("get_document_content", { p_document_id: doc.id });
        if (contentData) setContent(contentData as string);
      }

      setCheckingPurchase(false);
    }
    checkAndFetch();
  }, [session, doc]);

  // 3. Polling post-paiement — quand le visiteur revient de CamPay
  useEffect(() => {
    if (paiement !== "succes" || !purchaseRef || !session?.access_token || hasPurchased) return;

    setVerifying(true);
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    async function pollStatus() {
      while (!cancelled && attempts < maxAttempts) {
        attempts++;
        try {
          const res = await fetch(`/api/campay/status?purchaseId=${purchaseRef}`, {
            headers: { Authorization: `Bearer ${session!.access_token}` },
          });
          const data = await res.json();

          if (data.status === "completed") {
            // Recharger proprement sans les query params
            window.location.href = `/bibliotheque/${slug}`;
            return;
          }
          if (data.status === "failed") {
            setPaymentError("Le paiement a échoué. Réessaie ou contacte-nous.");
            setVerifying(false);
            return;
          }
        } catch {
          // Erreur réseau, on continue de poller
        }

        await new Promise((r) => setTimeout(r, 3000));
      }

      if (!cancelled && attempts >= maxAttempts) {
        setPaymentError("La vérification prend du temps. Rafraîchis la page dans quelques instants.");
        setVerifying(false);
      }
    }

    pollStatus();
    return () => { cancelled = true; };
  }, [paiement, purchaseRef, session, slug, hasPurchased]);

  // ─── Lancer le paiement CamPay ──────────────────────────
  const handlePurchase = useCallback(async () => {
    if (!session?.access_token || !doc) return;

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const res = await fetch("/api/campay/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ documentId: doc.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // Déjà acheté — recharger pour afficher le contenu
          window.location.reload();
          return;
        }
        setPaymentError(data.error || "Erreur lors du paiement");
        setPaymentLoading(false);
        return;
      }

      // Rediriger vers la page de paiement CamPay
      window.location.href = data.paymentUrl;
    } catch {
      setPaymentError("Erreur de connexion. Vérifie ton accès internet.");
      setPaymentLoading(false);
    }
  }, [session, doc]);

  // ─── LOADING ────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-neutral flex items-center justify-center pt-16">
          <div className="animate-pulse text-ink-light">Chargement…</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!doc) return null;

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

          {checkingPurchase ? (
            /* ── Vérification en cours ───────────────── */
            <div className="text-center py-16">
              <div className="animate-pulse text-ink-light">Vérification…</div>
            </div>

          ) : hasPurchased && content ? (
            /* ── CONTENU COMPLET (acheté) ────────────── */
            <article className="bg-white rounded-2xl shadow-sm p-6 md:p-10 prose-kessel" onContextMenu={(e) => e.preventDefault()}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.replace(/^#\s+.+\n*/m, '')}
              </ReactMarkdown>
            </article>

          ) : verifying ? (
            /* ── VÉRIFICATION POST-PAIEMENT ──────────── */
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw size={28} className="text-amber animate-spin" />
              </div>
              <h2
                className="text-2xl font-bold text-forest-dark mb-3"
                style={{ fontFamily: "var(--serif)" }}
              >
                Vérification du paiement…
              </h2>
              <p className="text-ink-light max-w-md mx-auto">
                Nous confirmons ton paiement auprès de ton opérateur. Cela peut prendre quelques secondes.
              </p>
            </div>

          ) : paiement === "echec" ? (
            /* ── ÉCHEC PAIEMENT ──────────────────────── */
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={28} className="text-red-500" />
              </div>
              <h2
                className="text-2xl font-bold text-forest-dark mb-3"
                style={{ fontFamily: "var(--serif)" }}
              >
                Paiement non abouti
              </h2>
              <p className="text-ink-light mb-6 max-w-md mx-auto">
                Le paiement n'a pas été confirmé. Aucun montant n'a été prélevé. Tu peux réessayer.
              </p>
              <button
                onClick={() => window.location.href = `/bibliotheque/${slug}`}
                className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              >
                <RefreshCw size={18} />
                Réessayer
              </button>
            </div>

          ) : (
            /* ── PAYWALL ─────────────────────────────── */
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={28} className="text-amber" />
              </div>

              <h2
                className="text-2xl font-bold text-forest-dark mb-3"
                style={{ fontFamily: "var(--serif)" }}
              >
                Document payant
              </h2>

              <p className="text-ink-light mb-2 max-w-md mx-auto">
                {`Accède à l'intégralité de ce ${config.label.toLowerCase()} pour`}
              </p>

              <p
                className="text-3xl font-bold mb-8"
                style={{ fontFamily: "var(--mono)", color: config.accent }}
              >
                {doc.price.toLocaleString("fr-FR")}{" "}
                <span className="text-base text-ink-light">FCFA</span>
              </p>

              {!session?.user ? (
                /* Pas connecté */
                <div className="space-y-4">
                  <Link
                    href={`/connexion?redirect=/bibliotheque/${slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    <LogIn size={18} />
                    Connecte-toi pour acheter
                  </Link>
                  <p className="text-sm text-ink-light">
                    {`Pas encore de compte ? L'inscription prend 30 secondes.`}
                  </p>
                </div>
              ) : (
                /* Connecté mais pas acheté */
                <div className="space-y-4">
                  {paymentError && (
                    <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2 mb-2">
                      {paymentError}
                    </p>
                  )}
                  <button
                    onClick={handlePurchase}
                    disabled={paymentLoading}
                    className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {paymentLoading ? (
                      <span className="animate-pulse">Redirection vers le paiement…</span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        {`Acheter — ${doc.price.toLocaleString("fr-FR")} FCFA`}
                      </>
                    )}
                  </button>
                  <p className="text-sm text-ink-light">
                    Paiement sécurisé par Mobile Money (MTN / Orange)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA CONSULTATION ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">
            {`Besoin d'un accompagnement sur mesure ?`}
          </p>
          <h2
            className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-forest-dark mb-6"
            style={{ fontFamily: "var(--serif)" }}
          >
            Ce document est un <em>outil de compréhension.</em>
          </h2>
          <p className="reveal reveal-delay-2 text-ink-light leading-relaxed mb-8 max-w-xl mx-auto">
            {`Pour un accompagnement adapté à ta parcelle et à tes objectifs, nos équipes réalisent des études personnalisées sur devis.`}
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
