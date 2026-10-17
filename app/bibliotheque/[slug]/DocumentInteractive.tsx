"use client";

// Partie interactive de la fiche : vérification d'achat, paiement (CamPay pour le
// Mobile Money, CamerPay pour la carte bancaire), contenu payant (RPC sécurisée), ressources liées.
// Logique reprise à l'identique de l'ancienne page ; seul le chargement de la
// vitrine (titre, description…) a été déplacé côté serveur (page.tsx).

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowRight,
  Lock,
  LogIn,
  GraduationCap,
  CreditCard,
  Smartphone,
  RefreshCw,
  Clock,
} from "lucide-react";
import { TYPE_CONFIG, type DocumentDetail, type DocumentPreview, type RelatedDoc } from "./shared";

// [camerpay-carte v1] Carte bancaire via CamerPay. Interrupteur NEXT_PUBLIC_CAMERPAY_CARD :
// "1" = proposée à tous ; "test:adresse@mail" = proposée à ce seul compte (essais) ; vide = masquée.
// Même règle que carteActivee() côté serveur (lib/camerpay.ts), qui reste seule juge.
const CARTE_REGLE = (process.env.NEXT_PUBLIC_CAMERPAY_CARD || "").trim();
function carteVisible(email?: string | null): boolean {
  if (CARTE_REGLE === "1") return true;
  if (CARTE_REGLE.toLowerCase().startsWith("test:")) {
    const testeur = CARTE_REGLE.slice(5).trim().toLowerCase();
    return Boolean(testeur) && (email || "").trim().toLowerCase() === testeur;
  }
  return false;
}
const XAF_PAR_EUR = 655.957; // taux fixe BEAC appliqué par CamerPay
type Moyen = "momo" | "carte";

export default function DocumentInteractive({
  doc,
  preview,
}: {
  doc: DocumentDetail;
  preview: DocumentPreview | null;
}) {
  useScrollReveal();
  const searchParams = useSearchParams();
  const { session } = useAuth();

  const [content, setContent] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  // États paiement (Mobile Money CamPay / carte CamerPay)
  const [paymentLoading, setPaymentLoading] = useState<Moyen | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Ressources liées
  const [relatedDoc, setRelatedDoc] = useState<RelatedDoc | null>(null);
  const [relatedGuides, setRelatedGuides] = useState<RelatedDoc[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const slug = doc.slug;
  const paiement = searchParams.get("paiement");
  const purchaseRef = searchParams.get("ref");

  // 1-bis. Journaliser la consultation de la fiche (compteur bibliotheque)
  useEffect(() => {
    let sid: string | null = null;
    try {
      sid = sessionStorage.getItem("kessel_sid");
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("kessel_sid", sid);
      }
    } catch {
      sid = null;
    }
    supabase.rpc("log_document_view_by_slug", { p_slug: doc.slug, p_session_id: sid }).then(({ error }) => { if (error) console.error("log_document_view_by_slug:", error); });
  }, [doc.slug]);

  // 2. Vérifier l'achat + charger le contenu si acheté
  useEffect(() => {
    async function checkAndFetch() {
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
  }, [session, doc.id]);

  // 3. Polling post-paiement — quand le visiteur revient de CamPay
  useEffect(() => {
    if (paiement !== "retour" || !purchaseRef || !session?.access_token || hasPurchased) return;

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

  // 4. Charger les ressources liées (contrepartie BP↔ITK ou suggestions guides)
  useEffect(() => {
    async function loadRelated() {
      setRelatedLoading(true);
      setRelatedDoc(null);
      setRelatedGuides([]);

      try {
        if (doc.type === "guide") {
          // Suggestions : d'autres guides publiés
          const { data } = await supabase
            .from("documents")
            .select("id, title, slug, type, speculation, description, price")
            .eq("type", "guide")
            .eq("status", "published")
            .neq("id", doc.id);

          if (data && data.length > 0) {
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setRelatedGuides(shuffled.slice(0, 3) as RelatedDoc[]);
          }
        } else {
          // Contrepartie : BP → ITK ou ITK → BP
          const targetType = doc.type === "business_plan" ? "fiche_technique" : "business_plan";
          const speculationKey = (doc.speculation || "").toLowerCase().trim();

          let found: RelatedDoc | null = null;

          // Tentative 1 : match par colonne speculation (méthode principale)
          if (speculationKey) {
            const { data } = await supabase
              .from("documents")
              .select("id, title, slug, type, speculation, description, price")
              .eq("type", targetType)
              .eq("status", "published")
              .ilike("speculation", speculationKey)
              .limit(1);
            if (data && data.length > 0) found = data[0] as RelatedDoc;
          }

          // Tentative 2 : fallback slug construit
          if (!found) {
            const targetSlug =
              doc.type === "business_plan"
                ? `itk-${doc.slug}`
                : doc.slug.replace(/^itk-/, "");
            const { data } = await supabase
              .from("documents")
              .select("id, title, slug, type, speculation, description, price")
              .eq("type", targetType)
              .eq("status", "published")
              .eq("slug", targetSlug)
              .maybeSingle();
            if (data) found = data as RelatedDoc;
          }

          setRelatedDoc(found);
        }
      } finally {
        setRelatedLoading(false);
      }
    }
    loadRelated();
  }, [doc.id, doc.type, doc.slug, doc.speculation]);

  // ─── Lancer le paiement (Mobile Money → CamPay, carte → CamerPay) ──
  const handlePurchase = useCallback(async (moyen: Moyen) => {
    if (!session?.access_token) return;

    setPaymentLoading(moyen);
    setPaymentError(null);

    try {
      const endpoint = moyen === "carte" ? "/api/camerpay/initiate" : "/api/campay/initiate";
      const res = await fetch(endpoint, {
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
        setPaymentLoading(null);
        return;
      }

      // Rediriger vers la page de paiement du prestataire
      window.location.href = data.paymentUrl;
    } catch {
      setPaymentError("Erreur de connexion. Vérifie ton accès internet.");
      setPaymentLoading(null);
    }
  }, [session, doc.id]);

  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.guide;
  const CARTE_ACTIVEE = carteVisible(session?.user?.email);
  const showRelated = hasPurchased && content && !relatedLoading;

  // Aperçu gratuit : affiché dès le rendu serveur (lisible par Google), pendant la
  // vérification d'achat comme devant le bouton de paiement.
  const hasPreview = Boolean(preview && preview.preview.trim());
  const previewBlock = hasPreview && preview ? (
    <div className="mb-8">
      <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
        <article
          className="prose-kessel p-6 md:p-10 pb-24 md:pb-28"
          onContextMenu={(e) => e.preventDefault()}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {preview.preview.replace(/^#\s+.+\n*/m, "")}
          </ReactMarkdown>
        </article>
        {/* Fondu : le texte s'efface là où la lecture devient intéressante */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-white/0 via-white/85 to-white"
        />
      </div>

      {preview.locked.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <p className="text-amber font-semibold text-xs uppercase tracking-wider mb-4">
            La suite du document
          </p>
          <ol className="space-y-2.5">
            {preview.locked.map((titre) => (
              <li key={titre} className="flex items-start gap-3 text-sm text-forest-dark">
                <Lock size={15} className="text-ink-light mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{titre}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      {checkingPurchase ? (
        /* ── Vérification en cours (l'aperçu reste visible) ── */
        <>
          {previewBlock}
          <div className="text-center py-10">
            <div className="animate-pulse text-ink-light">Vérification…</div>
          </div>
        </>

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
            Nous confirmons ton paiement auprès du prestataire de paiement. Cela peut prendre quelques secondes.
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
        <>
        {previewBlock}

        {/* ── PAYWALL ─────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-amber" />
          </div>

          <h2
            className="text-2xl font-bold text-forest-dark mb-3"
            style={{ fontFamily: "var(--serif)" }}
          >
            {hasPreview ? "Envie de lire la suite ?" : "Document payant"}
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
              {CARTE_ACTIVEE ? (
                /* Deux moyens : Mobile Money (CamPay) ou carte bancaire (CamerPay) */
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-xl mx-auto">
                  <button
                    onClick={() => handlePurchase("momo")}
                    disabled={paymentLoading !== null}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {paymentLoading === "momo" ? (
                      <span className="animate-pulse">Redirection…</span>
                    ) : (
                      <>
                        <Smartphone size={18} />
                        Mobile Money
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handlePurchase("carte")}
                    disabled={paymentLoading !== null}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {paymentLoading === "carte" ? (
                      <span className="animate-pulse">Redirection…</span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Carte bancaire
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase("momo")}
                  disabled={paymentLoading !== null}
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
              )}
              {CARTE_ACTIVEE ? (
                <p className="text-sm text-ink-light max-w-md mx-auto">
                  Mobile Money : MTN ou Orange.
                  {" "}Carte : Visa ou Mastercard, montant présenté en euros (≈{" "}
                  {(doc.price / XAF_PAR_EUR).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                  €, taux fixe 1 € = 655,957 FCFA).
                </p>
              ) : (
                <p className="text-sm text-ink-light">
                  Paiement sécurisé par Mobile Money (MTN / Orange)
                </p>
              )}
              <p className="text-xs text-ink-light max-w-md mx-auto">
                {/* [legal-v2] acceptation des CGV au moment de l'achat */}
                {CARTE_ACTIVEE ? "En choisissant un moyen de paiement" : "En cliquant sur « Acheter »"}, tu acceptes les{" "}
                <Link href="/cgv" className="underline hover:text-amber">conditions générales de vente</Link>{" "}
                et demandes l&apos;accès immédiat au document : il n&apos;est plus remboursable une fois accessible, sauf cas
                prévus à l&apos;article 6.
              </p>
            </div>
          )}
        </div>
        </>
      )}

      {/* ─── RESSOURCES LIÉES ──────────────────────────────── */}
      {showRelated && (doc.type !== "guide") && (
        <div className="mt-14 pt-12 border-t border-neutral-mid">
          <p className="text-amber font-semibold text-xs uppercase tracking-wider mb-2">
            Aller plus loin
          </p>
          <h3
            className="text-2xl font-bold text-forest-dark mb-6"
            style={{ fontFamily: "var(--serif)" }}
          >
            {doc.type === "business_plan"
              ? "La fiche technique de la même spéculation"
              : "Le business plan de la même spéculation"}
          </h3>

          {relatedDoc ? (
            /* Contrepartie disponible → carte cliquable */
            <Link
              href={`/bibliotheque/${relatedDoc.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Vignette */}
                <div
                  className="sm:w-52 aspect-[4/3] sm:aspect-auto bg-cover bg-center bg-forest-dark relative overflow-hidden"
                  style={{
                    backgroundImage: `url(/images/bibliotheque/${relatedDoc.slug}.jpg), url(/images/hero-home.jpg)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center gap-1.5 bg-white/95 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: TYPE_CONFIG[relatedDoc.type].accent }}
                    >
                      {TYPE_CONFIG[relatedDoc.type].label}
                    </span>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <h4
                    className="text-lg font-bold text-forest-dark mb-2 leading-tight group-hover:text-forest transition-colors"
                    style={{ fontFamily: "var(--serif)" }}
                  >
                    {relatedDoc.title}
                  </h4>
                  {relatedDoc.description && (
                    <p className="text-ink-light text-sm leading-relaxed mb-4 line-clamp-2">
                      {relatedDoc.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-mid">
                    <div>
                      <span
                        className="text-lg font-bold"
                        style={{
                          fontFamily: "var(--mono)",
                          color: TYPE_CONFIG[relatedDoc.type].accent,
                        }}
                      >
                        {relatedDoc.price.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-xs text-ink-light ml-1">FCFA</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-forest font-medium text-sm group-hover:gap-2 transition-all">
                      Consulter
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            /* Contrepartie manquante → bloc grisé "Bientôt disponible" */
            <div className="bg-white/60 border border-dashed border-neutral-mid rounded-2xl p-6 md:p-8 flex items-center gap-4 opacity-80">
              <div className="w-12 h-12 rounded-full bg-neutral-mid/40 flex items-center justify-center flex-shrink-0">
                <Clock size={22} className="text-ink-light" />
              </div>
              <div>
                <p className="font-semibold text-forest-dark mb-1">
                  Bientôt disponible
                </p>
                <p className="text-sm text-ink-light">
                  {doc.type === "business_plan"
                    ? `La fiche technique ITK ${doc.speculation ? `« ${doc.speculation} »` : "de cette spéculation"} est en cours de rédaction.`
                    : `Le business plan ${doc.speculation ? `« ${doc.speculation} »` : "de cette spéculation"} est en cours de rédaction.`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── SUGGESTIONS GUIDES ───────────────────────────── */}
      {showRelated && doc.type === "guide" && (
        <div className="mt-14 pt-12 border-t border-neutral-mid">
          <p className="text-amber font-semibold text-xs uppercase tracking-wider mb-2">
            Continuer à apprendre
          </p>
          <h3
            className="text-2xl font-bold text-forest-dark mb-6"
            style={{ fontFamily: "var(--serif)" }}
          >
            D&apos;autres guides à découvrir
          </h3>

          {relatedGuides.length > 0 ? (
            <div className={`grid gap-4 ${relatedGuides.length === 1 ? "sm:grid-cols-1" : relatedGuides.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
              {relatedGuides.map((g) => (
                <Link
                  key={g.id}
                  href={`/bibliotheque/${g.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div
                    className="aspect-[4/3] bg-cover bg-center bg-forest-dark relative overflow-hidden"
                    style={{
                      backgroundImage: `url(/images/bibliotheque/${g.slug}.jpg), url(/images/hero-home.jpg)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span
                        className="inline-flex items-center gap-1.5 bg-white/95 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: TYPE_CONFIG.guide.accent }}
                      >
                        <GraduationCap size={12} />
                        Guide
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4
                      className="text-base font-bold text-forest-dark leading-tight mb-2 line-clamp-2 group-hover:text-forest transition-colors"
                      style={{ fontFamily: "var(--serif)" }}
                    >
                      {g.title}
                    </h4>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-mid">
                      <span
                        className="text-sm font-bold"
                        style={{ fontFamily: "var(--mono)", color: TYPE_CONFIG.guide.accent }}
                      >
                        {g.price.toLocaleString("fr-FR")}
                        <span className="text-xs text-ink-light ml-1">FCFA</span>
                      </span>
                      <ArrowRight size={14} className="text-forest group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Aucun autre guide → CTA vers la bibliothèque */
            <Link
              href="/bibliotheque"
              className="group flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div>
                <p className="font-semibold text-forest-dark mb-1">
                  Explorer toute la bibliothèque
                </p>
                <p className="text-sm text-ink-light">
                  Business plans, fiches techniques et guides éducatifs
                </p>
              </div>
              <ArrowRight size={20} className="text-forest group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
