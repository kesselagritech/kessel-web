"use client";

// [bibliotheque-compte v2] 25/11/2026 — Bibliothèque gratuite, réservée aux comptes du site.
// Visiteur : aperçu (rendu serveur, lisible par Google) + invitation à se connecter.
// Connecté sans pays/numéro : aperçu + demande du pays puis du numéro (enregistrés sur le compte).
// Connecté avec pays + numéro : document complet, chargé par la fonction get_document_content
// (qui vérifie elle aussi la connexion, le pays et le numéro). Plus aucun paiement.

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { authHref } from "@/lib/authHref";
import { normaliserTelephone, coordonneesDuCompte } from "@/lib/telephone";
import ChampTelephone from "@/components/ChampTelephone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, GraduationCap, Clock, Lock, LogIn } from "lucide-react";
import { TYPE_CONFIG, type DocumentDetail, type DocumentPreview, type RelatedDoc } from "./shared";

export default function DocumentInteractive({
  doc,
  preview,
}: {
  doc: DocumentDetail;
  preview: DocumentPreview | null;
}) {
  useScrollReveal();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const coordonnees = coordonneesDuCompte(user);
  const compteComplet = Boolean(coordonnees);

  const [content, setContent] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(false);

  // Saisie du pays et du numéro (comptes créés avant l'obligation)
  const [paysSaisi, setPaysSaisi] = useState("");
  const [telSaisi, setTelSaisi] = useState("");
  const [telBusy, setTelBusy] = useState(false);
  const [telError, setTelError] = useState<string | null>(null);

  // Ressources liées
  const [relatedDoc, setRelatedDoc] = useState<RelatedDoc | null>(null);
  const [relatedGuides, setRelatedGuides] = useState<RelatedDoc[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // 1. Journaliser la consultation de la fiche (compteur bibliothèque)
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

  // Charger le document complet : connecté + pays et numéro enregistrés
  useEffect(() => {
    if (!user || !compteComplet) {
      setContent(null);
      return;
    }
    let annule = false;
    setContentLoading(true);
    setContentError(false);
    supabase
      .rpc("get_document_content", { p_document_id: doc.id })
      .then(({ data, error }) => {
        if (annule) return;
        if (error) console.error("get_document_content:", error.message);
        if (typeof data === "string" && data.trim()) setContent(data);
        else setContentError(true);
        setContentLoading(false);
      });
    return () => {
      annule = true;
    };
  }, [user, compteComplet, doc.id]);

  async function enregistrerTelephone(e: React.FormEvent) {
    e.preventDefault();
    setTelError(null);
    const tel = normaliserTelephone(telSaisi, paysSaisi);
    if (tel.erreur !== undefined) {
      setTelError(tel.erreur);
      return;
    }
    setTelBusy(true);
    const { error } = await supabase.auth.updateUser({ data: { telephone: tel.telephone, pays: paysSaisi } });
    setTelBusy(false);
    if (error) setTelError("Enregistrement impossible pour le moment. Réessaie dans un instant.");
    // En cas de succès, le compte est mis à jour (AuthContext) et le document se charge tout seul.
  }

  const showRelated = !relatedLoading;

  // Aperçu : affiché dès le rendu serveur (lisible par Google) tant que le document complet n'est pas ouvert.
  const hasPreview = Boolean(preview && preview.preview.trim());
  const previewBlock = hasPreview && preview ? (
    <div className="mb-8">
      <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
        <article className="prose-kessel p-6 md:p-10 pb-24 md:pb-28">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {preview.preview.replace(/^#\s+.+\n*/m, "")}
          </ReactMarkdown>
        </article>
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
      {content ? (
        /* ── DOCUMENT COMPLET (connecté + numéro) ── */
        <article className="bg-white rounded-2xl shadow-sm p-6 md:p-10 prose-kessel">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.replace(/^#\s+.+\n*/m, "")}
          </ReactMarkdown>
        </article>
      ) : (
        <>
          {previewBlock}

          {authLoading || contentLoading ? (
            <div className="text-center py-10">
              <div className="animate-pulse text-ink-light">Chargement…</div>
            </div>
          ) : !user ? (
            /* ── VISITEUR : se connecter pour lire ── */
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 text-center">
              <p className="text-amber font-semibold text-xs uppercase tracking-wider mb-3">Gratuit</p>
              <h3 className="text-2xl font-bold text-forest-dark mb-3" style={{ fontFamily: "var(--serif)" }}>
                Lis ce document en entier
              </h3>
              <p className="text-ink-light text-sm mb-6 max-w-md mx-auto">
                Crée ton compte gratuit avec ton adresse e-mail, ton pays et ton numéro de téléphone, puis accède à toute la bibliothèque.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={authHref(pathname, { mode: "register" })}
                  className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Créer mon compte gratuit
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href={authHref(pathname)}
                  className="inline-flex items-center justify-center gap-2 border-2 border-forest text-forest hover:bg-forest-light font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <LogIn size={18} />
                  J&apos;ai déjà un compte
                </Link>
              </div>
            </div>
          ) : !compteComplet ? (
            /* ── CONNECTÉ SANS NUMÉRO : le demander une fois ── */
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              <h3 className="text-xl font-bold text-forest-dark mb-2 text-center" style={{ fontFamily: "var(--serif)" }}>
                Encore une étape
              </h3>
              <p className="text-ink-light text-sm mb-6 text-center max-w-md mx-auto">
                Indique ton pays et ton numéro de téléphone (WhatsApp) pour lire toute la bibliothèque. Ils ne te seront demandés qu&apos;une fois.
              </p>
              <form onSubmit={enregistrerTelephone} className="max-w-sm mx-auto space-y-3">
                <ChampTelephone
                  pays={paysSaisi}
                  onPays={(c) => { setPaysSaisi(c); setTelError(null); }}
                  telephone={telSaisi}
                  onTelephone={setTelSaisi}
                />
                {telError && <p className="text-sm text-red-700">{telError}</p>}
                <button
                  type="submit"
                  disabled={telBusy}
                  className="w-full bg-forest hover:bg-forest-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {telBusy ? "Enregistrement…" : "Enregistrer et lire le document"}
                </button>
              </form>
            </div>
          ) : contentError ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <p className="font-semibold text-forest-dark mb-2">Document momentanément indisponible</p>
              <p className="text-sm text-ink-light">
                Recharge la page dans quelques instants. Si le problème continue, écris-nous sur WhatsApp.
              </p>
            </div>
          ) : null}
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
                        className="text-sm font-semibold"
                        style={{ color: TYPE_CONFIG[relatedDoc.type].accent }}
                      >
                        Gratuit
                      </span>
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
                        Gratuit
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
