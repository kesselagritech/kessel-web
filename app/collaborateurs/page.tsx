"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  KeyRound,
  LogIn,
  Loader2,
  Search,
  Wallet,
  PieChart,
  TrendingUp,
  ListChecks,
  Wheat,
  Receipt,
  ArrowDownToLine,
  FileText,
  RotateCcw,
  Building2,
  ChevronRight,
  ChevronLeft,
  Users,
  ImageOff,
  Image as ImageIcon,
  AlertTriangle,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { authHref } from "@/lib/authHref";

/* ────────────────────────────────────────────
   Types du bundle renvoye par get_shared_project
──────────────────────────────────────────── */

interface Task {
  id: string;
  name: string | null;
  categorie: string | null;
  statut: string | null;
  priorite: string | null;
  date_debut: string | null;
  date_fin: string | null;
  date_demarrage_reelle: string | null;
  date_cloture_reelle: string | null;
  quantite_recoltee: number | null;
  unite_recoltee: string | null;
  nb_travailleurs: number | null;
  description: string | null;
  note: string | null;
  duree_heures: number | null;
}
interface Expense {
  id: string;
  poste: string | null;
  montant: number | null;
  date: string | null;
  description: string | null;
}
interface Revenue {
  id: string;
  source: string | null;
  categorie: string | null;
  montant: number | null;
  date: string | null;
  quantite: number | null;
  prix_unitaire: number | null;
  acheteur: string | null;
  description: string | null;
}
interface Deposit {
  id: string;
  montant: number | null;
  date_depot: string | null;
  operateur: string | null;
  note: string | null;
}
interface Report {
  id: string;
  titre: string | null;
  date_visite: string | null;
  statut_projet: string | null;
  observations: string | null;
  problemes_detectes: string | null;
  actions_recommandees: string | null;
  photos_urls: string[] | null;
}
interface Evidence {
  id: string;
  task_id: string | null;
  evidence_type: string | null;
  photo_url: string | null;
  captured_at: string | null;
  notes: string | null;
}
interface SharedProject {
  project: {
    id: string;
    name: string;
    type_production: string | null;
    surface: number | null;
    budget: number | null;
    revenu_previsionnel: number | null;
    date_debut: string | null;
    date_fin: string | null;
    statut: string | null;
    unite_recolte: string | null;
    speculation_id: string | null;
    speculation_autre: string | null;
  };
  tasks: Task[];
  expenses: Expense[];
  revenues: Revenue[];
  deposits: Deposit[];
  reports: Report[];
  evidence: Evidence[];
}

/* ────────────────────────────────────────────
   Palette (miroir de globals.css @theme)
──────────────────────────────────────────── */
interface Exploitation {
  owner_id: string;
  name: string | null;
  project_count: number;
}
interface ProjectSummary {
  id: string;
  name: string;
  type_production: string | null;
  surface: number | null;
  statut: string | null;
  budget: number | null;
  date_debut: string | null;
  date_fin: string | null;
  date_cloture: string | null;
  speculation_autre: string | null;
}

const C = {
  forest: "#2D4A35",
  forestMid: "#3D6348",
  forestDark: "#1A3D25",
  amber: "#BA7517",
  amberDark: "#854F0B",
  brick: "#993C1D",
  inkLight: "#6B7F6D",
  neutralMid: "#E0E0DC",
};

const POSTE_LABELS: Record<string, string> = {
  semences: "Semences",
  engrais: "Engrais",
  pesticides: "Pesticides",
  main_oeuvre: "Main d'œuvre",
  materiel: "Matériel",
  transport: "Transport",
  irrigation: "Irrigation",
  alimentation_animaux: "Alimentation animaux",
  veterinaire: "Vétérinaire",
  emballage: "Emballage",
  divers: "Divers",
  loyer: "Loyer",
  salaire_permanent: "Salaire permanent",
  assurance: "Assurance",
  abonnement: "Abonnement",
};
const posteLabel = (p: string | null) => (p && POSTE_LABELS[p]) || p || "Divers";

/* ────────────────────────────────────────────
   Utilitaires
──────────────────────────────────────────── */
const fmt = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString("fr-FR");
const monthKey = (d: string | null) => (d ? d.slice(0, 7) : null);
const MONTHS = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];
const monthLabel = (ym: string) => {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
};
const todayISO = new Date().toISOString().slice(0, 10);
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

function taskState(t: Task): "termine" | "en_cours" | "a_faire" {
  if (t.date_cloture_reelle) return "termine";
  if (t.date_demarrage_reelle) return "en_cours";
  return "a_faire";
}
function isLate(t: Task): boolean {
  return !t.date_cloture_reelle && !!t.date_fin && t.date_fin < todayISO;
}
const dateFR = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const PRIORITE_LABELS: Record<string, string> = {
  haute: "Haute",
  moyenne: "Moyenne",
  basse: "Basse",
  urgente: "Urgente",
  normale: "Normale",
  faible: "Faible",
};
const prioriteLabel = (p: string | null) =>
  (p && PRIORITE_LABELS[p]) || p || null;

/* ════════════════════════════════════════════
   Modale de détail (lecture seule, réutilisable)
════════════════════════════════════════════ */

type Field = { label: string; value: React.ReactNode };

/* Ferme sur Échap + bloque le défilement de la page tant que la modale est ouverte */
function useModalDismiss(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

/* Monté côté client (le portail a besoin de document) */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/* Media query réactive (mobile → feuille par le bas ; desktop → dialogue centré) */
function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/* Image d'un bucket privé : demande une URL signée temporaire (1 h) */
function StorageImage({
  bucket,
  path,
  alt,
  linkable,
}: {
  bucket: string;
  path: string;
  alt: string;
  linkable?: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setUrl(null);
    setFailed(false);
    supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600)
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data?.signedUrl) setFailed(true);
        else setUrl(data.signedUrl);
      });
    return () => {
      active = false;
    };
  }, [bucket, path]);

  const fill: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };
  const box: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F1F1EC",
    color: C.inkLight,
  };

  if (failed)
    return (
      <div style={box} title="Image indisponible">
        <ImageOff size={18} />
      </div>
    );
  if (!url) return <div style={box} />;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} style={fill} onError={() => setFailed(true)} />
  );
  if (linkable)
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={fill}
        title="Ouvrir en grand"
      >
        {img}
      </a>
    );
  return img;
}

function DetailModal({
  open,
  onClose,
  title,
  icon: Icon,
  accent,
  headline,
  badge,
  fields,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  accent?: string;
  headline?: React.ReactNode;
  badge?: React.ReactNode;
  fields: Field[];
  children?: React.ReactNode;
}) {
  const mounted = useMounted();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [visible, setVisible] = useState(false);
  useModalDismiss(open, onClose);
  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  if (!open || !mounted) return null;

  const accentColor = accent || C.forest;
  const shown = fields.filter(
    (f) => f.value !== null && f.value !== undefined && f.value !== "",
  );

  const node = (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 24,
        background: "rgba(15,40,24,0.55)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 540,
          background: "#FFFFFF",
          borderRadius: isMobile ? "20px 20px 0 0" : 20,
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
          maxHeight: isMobile ? "90vh" : "86vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: visible
            ? "translateY(0) scale(1)"
            : isMobile
              ? "translateY(28px)"
              : "translateY(10px) scale(0.985)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 240ms cubic-bezier(.16,1,.3,1), opacity 180ms ease",
        }}
      >
        {isMobile && (
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 999,
              background: C.neutralMid,
              margin: "10px auto 2px",
            }}
          />
        )}

        {/* En-tête */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "20px 22px",
            borderBottom: `1px solid ${C.neutralMid}`,
          }}
        >
          {Icon && (
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                flexShrink: 0,
                background: accentColor + "1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={20} color={accentColor} />
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 700,
                fontSize: 19,
                lineHeight: 1.25,
                color: C.forestDark,
                overflowWrap: "anywhere",
              }}
            >
              {title}
            </h3>
            {headline && (
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: accentColor,
                }}
              >
                {headline}
              </div>
            )}
            {badge && <div style={{ marginTop: 8 }}>{badge}</div>}
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.inkLight,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F4F4F0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div style={{ padding: "16px 22px 22px", overflowY: "auto" }}>
          {shown.length > 0 && (
            <div>
              {shown.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 16,
                    padding: "11px 0",
                    borderBottom:
                      i < shown.length - 1 ? "1px solid #F0F0EC" : "none",
                  }}
                >
                  <span style={{ color: C.inkLight, fontSize: 14, flexShrink: 0 }}>
                    {f.label}
                  </span>
                  <span
                    style={{
                      color: C.forestDark,
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: "right",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

/* Badge d'état d'une tâche (dérivé des dates, comme le reste de la page) */
function TaskStateBadge({ t }: { t: Task }) {
  const s = taskState(t);
  const map = {
    termine: { label: "Terminée", color: C.forest, bg: "#EBF2EC" },
    en_cours: { label: "En cours", color: C.amberDark, bg: "#FAEEDA" },
    a_faire: { label: "À faire", color: C.inkLight, bg: "#F4F4F0" },
  } as const;
  const b = map[s];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ color: b.color, background: b.bg }}
      >
        {b.label}
      </span>
      {isLate(t) && (
        <span className="text-xs text-brick font-medium">en retard</span>
      )}
    </span>
  );
}

/* Modale détaillée d'une tâche + ses preuves liées */
function TaskModal({
  task,
  evidence,
  projectUnit,
  onClose,
}: {
  task: Task | null;
  evidence: Evidence[];
  projectUnit: string | null;
  onClose: () => void;
}) {
  const linked = useMemo(
    () =>
      task
        ? evidence.filter((e) => e.task_id === task.id && !!e.photo_url)
        : [],
    [task, evidence],
  );
  if (!task) return null;

  const unit = (task.unite_recoltee || projectUnit || "").trim();
  const recolte =
    task.quantite_recoltee && task.quantite_recoltee > 0
      ? `${task.quantite_recoltee.toLocaleString("fr-FR")} ${unit}`.trim()
      : null;
  const prevu =
    task.date_debut || task.date_fin
      ? `${dateFR(task.date_debut)} → ${dateFR(task.date_fin)}`
      : null;
  const demarre = task.date_demarrage_reelle
    ? dateFR(task.date_demarrage_reelle)
    : null;
  const cloture = task.date_cloture_reelle
    ? dateFR(task.date_cloture_reelle)
    : null;

  const stateAccent = {
    termine: C.forest,
    en_cours: C.amber,
    a_faire: C.inkLight,
  }[taskState(task)];

  const fields: Field[] = [
    { label: "Catégorie", value: task.categorie },
    { label: "Priorité", value: prioriteLabel(task.priorite) },
    {
      label: "Durée",
      value: task.duree_heures ? `${task.duree_heures} h` : null,
    },
  ];

  const sectionLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: C.inkLight,
    marginBottom: 10,
  };
  const timelineRow = (label: string, value: string, dot: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: dot,
          flexShrink: 0,
        }}
      />
      <span style={{ color: C.inkLight, fontSize: 14 }}>{label}</span>
      <span
        style={{
          marginLeft: "auto",
          color: C.forestDark,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <DetailModal
      open={!!task}
      onClose={onClose}
      title={task.name || "Tâche"}
      icon={ListChecks}
      accent={stateAccent}
      badge={<TaskStateBadge t={task} />}
      fields={fields}
    >
      {task.description && task.description.trim() !== "" && (
        <div style={{ marginTop: 18 }}>
          <p style={sectionLabel}>Description</p>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.65,
              color: C.forestDark,
              whiteSpace: "pre-line",
            }}
          >
            {task.description}
          </p>
        </div>
      )}

      {task.note && task.note.trim() !== "" && (
        <div style={{ marginTop: 18 }}>
          <p style={sectionLabel}>Note</p>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.65,
              color: C.forestDark,
              whiteSpace: "pre-line",
            }}
          >
            {task.note}
          </p>
        </div>
      )}

      {(prevu || demarre || cloture) && (
        <div style={{ marginTop: 18 }}>
          <p style={sectionLabel}>Suivi</p>
          <div style={{ display: "grid", gap: 11 }}>
            {prevu && timelineRow("Prévu", prevu, C.inkLight)}
            {demarre && timelineRow("Démarré le", demarre, C.amberDark)}
            {cloture && timelineRow("Clôturé le", cloture, C.forest)}
          </div>
        </div>
      )}

      {recolte && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 14,
            background: C.forest + "12",
          }}
        >
          <Wheat size={20} color={C.forest} />
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                color: C.inkLight,
              }}
            >
              Récolte
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontWeight: 700,
                fontSize: 18,
                color: C.forestDark,
              }}
            >
              {recolte}
            </div>
          </div>
        </div>
      )}

      {task.nb_travailleurs ? (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: C.forestDark,
            fontSize: 14,
          }}
        >
          <Users size={16} color={C.inkLight} />
          <span>
            {task.nb_travailleurs} travailleur
            {task.nb_travailleurs > 1 ? "s" : ""}
          </span>
        </div>
      ) : null}

      {linked.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <p style={sectionLabel}>Preuves ({linked.length})</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {linked.map((ev) => (
              <div
                key={ev.id}
                title={ev.notes || undefined}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${C.neutralMid}`,
                  aspectRatio: "1 / 1",
                }}
              >
                <StorageImage
                  bucket="evidence"
                  path={ev.photo_url!}
                  alt={ev.notes || "Preuve"}
                  linkable
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </DetailModal>
  );
}

/* ════════════════════════════════════════════
   Petits composants graphiques (SVG / CSS purs)
════════════════════════════════════════════ */

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-mid p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} className="text-forest" />
        <h3
          className="text-base font-bold text-forest-dark"
          style={{ fontFamily: "var(--serif)" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* Jauge budget (barre horizontale) */
function BudgetGauge({ total, budget }: { total: number; budget: number }) {
  const pct = budget > 0 ? total / budget : 0;
  const color = pct > 1 ? C.brick : pct > 0.9 ? C.amber : C.forest;
  const width = Math.min(pct, 1) * 100;
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--mono)", color }}
        >
          {budget > 0 ? Math.round(pct * 100) : "—"}
          {budget > 0 && "%"}
        </span>
        <span className="text-sm text-ink-light">
          {fmt(total)} / {fmt(budget)} FCFA
        </span>
      </div>
      <div className="h-4 w-full rounded-full bg-neutral overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {pct > 1 && (
        <p className="text-xs text-brick font-medium mt-2">
          Budget dépassé de {fmt(total - budget)} FCFA.
        </p>
      )}
    </div>
  );
}

/* Depenses par poste (barres horizontales) */
function ExpensesByPoste({ expenses }: { expenses: Expense[] }) {
  const rows = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      const k = e.poste ?? "divers";
      map.set(k, (map.get(k) ?? 0) + (e.montant ?? 0));
    }
    let arr = [...map.entries()]
      .map(([poste, total]) => ({ poste, total }))
      .sort((a, b) => b.total - a.total);
    if (arr.length > 6) {
      const rest = sum(arr.slice(6).map((x) => x.total));
      arr = arr.slice(0, 6).concat([{ poste: "__autres", total: rest }]);
    }
    return arr;
  }, [expenses]);

  if (!rows.length)
    return <p className="text-sm text-ink-light">Aucune dépense enregistrée.</p>;
  const max = Math.max(...rows.map((r) => r.total), 1);

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.poste}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-mid">
              {r.poste === "__autres" ? "Autres" : posteLabel(r.poste)}
            </span>
            <span className="text-forest-dark font-semibold">
              {fmt(r.total)}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-neutral overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(r.total / max) * 100}%`,
                backgroundColor: r.poste === "__autres" ? C.inkLight : C.forest,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Entrees vs sorties par mois + tresorerie (SVG, un seul axe FCFA) */
function CashFlowChart({
  expenses,
  revenues,
  deposits,
}: {
  expenses: Expense[];
  revenues: Revenue[];
  deposits: Deposit[];
}) {
  const data = useMemo(() => {
    const set = new Set<string>();
    const add = (d: string | null) => {
      const k = monthKey(d);
      if (k) set.add(k);
    };
    expenses.forEach((e) => add(e.date));
    revenues.forEach((r) => add(r.date));
    deposits.forEach((d) => add(d.date_depot));
    const months = [...set].sort();
    const per = months.map((m) => {
      const entrees =
        sum(revenues.filter((r) => monthKey(r.date) === m).map((r) => r.montant ?? 0)) +
        sum(deposits.filter((d) => monthKey(d.date_depot) === m).map((d) => d.montant ?? 0));
      const sorties = sum(
        expenses.filter((e) => monthKey(e.date) === m).map((e) => e.montant ?? 0),
      );
      return { m, entrees, sorties };
    });
    let cum = 0;
    const treso = per.map((p) => (cum += p.entrees - p.sorties));
    return { months, per, treso };
  }, [expenses, revenues, deposits]);

  // Colonne survolée (desktop) ou tapée (mobile) pour l'info-bulle
  const [hover, setHover] = useState<number | null>(null);

  if (data.months.length === 0)
    return <p className="text-sm text-ink-light">Aucun mouvement daté à afficher.</p>;

  const { per, treso } = data;
  const vals = per.flatMap((p) => [p.entrees, p.sorties]).concat(treso).concat([0]);
  const vmax = Math.max(...vals);
  const vmin = Math.min(...vals, 0);
  const span = vmax - vmin || 1;

  const H = 200;
  const padT = 12;
  const padB = 34;
  const plotH = H - padT - padB;
  const slot = 60;
  const W = Math.max(320, per.length * slot);
  const y = (v: number) => padT + ((vmax - v) / span) * plotH;
  const y0 = y(0);
  const bw = 12;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: C.forestMid }} /> Entrées
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: C.brick }} /> Sorties
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5" style={{ background: C.amberDark }} /> Trésorerie
        </span>
      </div>
      <div className="overflow-x-auto relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label="Entrées, sorties et trésorerie par mois"
        >
          {hover !== null && (
            <rect
              x={hover * slot}
              y={0}
              width={slot}
              height={H}
              fill={C.forest}
              opacity={0.06}
              pointerEvents="none"
            />
          )}
          <line x1={0} y1={y0} x2={W} y2={y0} stroke={C.neutralMid} strokeWidth={1} />
          {per.map((p, i) => {
            const cx = i * slot + slot / 2;
            return (
              <g key={p.m}>
                <rect
                  x={cx - bw - 2}
                  y={y(p.entrees)}
                  width={bw}
                  height={Math.max(0, y0 - y(p.entrees))}
                  rx={2}
                  fill={C.forestMid}
                />
                <rect
                  x={cx + 2}
                  y={y(p.sorties)}
                  width={bw}
                  height={Math.max(0, y0 - y(p.sorties))}
                  rx={2}
                  fill={C.brick}
                />
                <text
                  x={cx}
                  y={H - 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill={C.inkLight}
                >
                  {monthLabel(p.m)}
                </text>
              </g>
            );
          })}
          <polyline
            fill="none"
            stroke={C.amberDark}
            strokeWidth={2}
            points={treso
              .map((v, i) => `${i * slot + slot / 2},${y(v)}`)
              .join(" ")}
          />
          {treso.map((v, i) => (
            <circle
              key={i}
              cx={i * slot + slot / 2}
              cy={y(v)}
              r={3}
              fill={C.amberDark}
            />
          ))}
          {/* Zones transparentes au-dessus, pour capter survol (desktop) et tap (mobile) */}
          {per.map((p, i) => (
            <rect
              key={`hit-${p.m}`}
              x={i * slot}
              y={0}
              width={slot}
              height={H}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              onClick={() => setHover((h) => (h === i ? null : i))}
            />
          ))}
        </svg>
        {hover !== null &&
          (() => {
            const cx = hover * slot + slot / 2;
            const tw = 168;
            const left = Math.min(Math.max(cx, tw / 2 + 4), W - tw / 2 - 4);
            const p = per[hover];
            return (
              <div
                className="pointer-events-none absolute -translate-x-1/2 z-10 rounded-lg bg-forest-dark text-white shadow-lg px-3 py-2 text-xs"
                style={{ left, top: 4, width: tw }}
              >
                <div className="font-semibold mb-1.5">{monthLabel(p.m)}</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: C.forestMid }} />
                  <span>Entrées</span>
                  <span className="ml-auto font-semibold" style={{ fontFamily: "var(--mono)" }}>
                    {fmt(p.entrees)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: C.brick }} />
                  <span>Sorties</span>
                  <span className="ml-auto font-semibold" style={{ fontFamily: "var(--mono)" }}>
                    {fmt(p.sorties)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-3 h-0.5 shrink-0" style={{ background: C.amber }} />
                  <span>Trésorerie</span>
                  <span className="ml-auto font-semibold" style={{ fontFamily: "var(--mono)" }}>
                    {fmt(treso[hover])}
                  </span>
                </div>
              </div>
            );
          })()}
      </div>
      <p className="text-sm text-ink-mid mt-3">
        Trésorerie actuelle :{" "}
        <span
          className="font-bold"
          style={{ color: treso[treso.length - 1] < 0 ? C.brick : C.forest }}
        >
          {fmt(treso[treso.length - 1])} FCFA
        </span>
      </p>
    </div>
  );
}

/* Avancement des taches (barre segmentee, etats derives des dates) */
function TasksProgress({ tasks }: { tasks: Task[] }) {
  const { termine, enCours, aFaire, late, total } = useMemo(() => {
    let termine = 0, enCours = 0, aFaire = 0, late = 0;
    for (const t of tasks) {
      const s = taskState(t);
      if (s === "termine") termine++;
      else if (s === "en_cours") enCours++;
      else aFaire++;
      if (isLate(t)) late++;
    }
    return { termine, enCours, aFaire, late, total: tasks.length };
  }, [tasks]);

  if (!total)
    return <p className="text-sm text-ink-light">Aucune tâche enregistrée.</p>;

  const seg = [
    { n: termine, c: C.forest, label: "Terminées" },
    { n: enCours, c: C.amber, label: "En cours" },
    { n: aFaire, c: C.neutralMid, label: "À faire" },
  ];

  return (
    <div>
      <div className="flex h-5 w-full rounded-full overflow-hidden bg-neutral">
        {seg.map(
          (s) =>
            s.n > 0 && (
              <div
                key={s.label}
                style={{ width: `${(s.n / total) * 100}%`, backgroundColor: s.c }}
                title={`${s.label}: ${s.n}`}
              />
            ),
        )}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm">
        {seg.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: s.c }}
            />
            <span className="text-ink-mid">{s.label}</span>
            <span className="font-semibold text-forest-dark">{s.n}</span>
          </span>
        ))}
      </div>
      {late > 0 && (
        <p className="text-xs text-brick font-medium mt-3">
          {late} tâche{late > 1 ? "s" : ""} en retard (échéance
          dépassée, non clôturée{late > 1 ? "s" : ""}).
        </p>
      )}
    </div>
  );
}

/* Recolte cumulee — jamais melanger deux unites */
function HarvestSummary({
  tasks,
  projectUnit,
}: {
  tasks: Task[];
  projectUnit: string | null;
}) {
  const perUnit = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tasks) {
      const q = t.quantite_recoltee ?? 0;
      if (q <= 0) continue;
      const u = (t.unite_recoltee || projectUnit || "kg").trim();
      map.set(u, (map.get(u) ?? 0) + q);
    }
    return [...map.entries()].map(([unit, total]) => ({ unit, total }));
  }, [tasks, projectUnit]);

  if (!perUnit.length)
    return <p className="text-sm text-ink-light">Aucune récolte enregistrée.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {perUnit.map((p) => (
        <div
          key={p.unit}
          className="rounded-xl bg-forest-light border border-forest/15 px-4 py-3 text-center"
        >
          <div
            className="text-2xl font-bold text-forest-dark"
            style={{ fontFamily: "var(--mono)" }}
          >
            {p.total.toLocaleString("fr-FR")}
          </div>
          <div className="text-xs text-ink-light uppercase tracking-wide">
            {p.unit}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Petite stat pour l'entete */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3">
      <div className="text-xs text-white/70 uppercase tracking-wide">{label}</div>
      <div
        className="text-lg font-bold text-white"
        style={{ fontFamily: "var(--mono)" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Vue projet (une fois le code valide)
════════════════════════════════════════════ */

/* ════════════════════════════════════════════
   Rapports de terrain — cartes compactes + modal swipeable + recherche
════════════════════════════════════════════ */

/* Recherche client-side sur les champs texte du rapport */
function matchesReport(r: Report, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    (r.titre || "").toLowerCase().includes(needle) ||
    (r.observations || "").toLowerCase().includes(needle) ||
    (r.problemes_detectes || "").toLowerCase().includes(needle) ||
    (r.actions_recommandees || "").toLowerCase().includes(needle) ||
    (r.statut_projet || "").toLowerCase().includes(needle) ||
    (r.date_visite || "").includes(needle)
  );
}

/* Barre de recherche discrète */
function ReportSearch({
  query,
  onQuery,
  filteredCount,
  totalCount,
}: {
  query: string;
  onQuery: (v: string) => void;
  filteredCount: number;
  totalCount: number;
}) {
  return (
    <div className="mb-4">
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Rechercher un mot-clé…"
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-neutral-mid text-ink text-sm outline-none focus:border-forest transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Effacer la recherche"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-ink-light hover:text-forest hover:bg-neutral transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {query && (
        <p className="text-xs text-ink-light mt-2">
          {filteredCount} sur {totalCount} rapport{totalCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

/* Carte compacte — clic ouvre le modal */
function ReportCard({ r, onClick }: { r: Report; onClick: () => void }) {
  const photoCount = r.photos_urls?.length ?? 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-neutral-mid p-4 bg-forest-xlight hover:border-forest hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-forest-dark leading-tight line-clamp-2">
          {r.titre || "Rapport"}
        </span>
        <span className="text-xs text-ink-light shrink-0 whitespace-nowrap">
          {dateFR(r.date_visite)}
        </span>
      </div>
      {r.observations && (
        <p className="text-sm text-ink-mid leading-relaxed line-clamp-2 mb-3">
          {r.observations}
        </p>
      )}
      <div className="flex items-center gap-1.5 flex-wrap">
        {photoCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs bg-white text-forest border border-neutral-mid px-2 py-0.5 rounded-full">
            <ImageIcon size={11} /> {photoCount}
          </span>
        )}
        {r.problemes_detectes && (
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: C.brick + "1A", color: C.brick }}
          >
            <AlertTriangle size={11} /> Problèmes
          </span>
        )}
        {r.statut_projet && (
          <span className="inline-flex items-center text-xs bg-neutral text-ink-mid px-2 py-0.5 rounded-full truncate max-w-[140px]">
            {r.statut_projet}
          </span>
        )}
      </div>
    </button>
  );
}

/* Modal — navigation prev/next + swipe tactile + touches ← → */
function ReportsModal({
  reports,
  index,
  onIndexChange,
  onClose,
}: {
  reports: Report[];
  index: number;
  onIndexChange: (idx: number) => void;
  onClose: () => void;
}) {
  const mounted = useMounted();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [visible, setVisible] = useState(false);
  useModalDismiss(true, onClose);

  const current = reports[index];
  const hasPrev = index > 0;
  const hasNext = index < reports.length - 1;

  const go = useCallback(
    (dir: -1 | 1) => {
      const next = index + dir;
      if (next < 0 || next >= reports.length) return;
      onIndexChange(next);
    },
    [index, reports.length, onIndexChange],
  );

  // Raccourcis clavier ← → (Escape est déjà géré par useModalDismiss)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  // Swipe tactile — seuil 50px, horizontal dominant pour éviter conflit scroll
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) go(-1);
      else go(1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Animation d'entrée (fade + scale)
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: C.inkLight,
    marginBottom: 6,
    fontWeight: 600,
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: 14,
    color: C.forestDark,
    lineHeight: 1.6,
    whiteSpace: "pre-line",
    margin: 0,
  };

  const navButtonStyle = (enabled: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: enabled ? "#F4F4F0" : "transparent",
    color: enabled ? C.forestDark : C.neutralMid,
    border: "none",
    cursor: enabled ? "pointer" : "not-allowed",
    flexShrink: 0,
    transition: "background 120ms ease",
  });

  const node = (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={current.titre || "Rapport"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 24,
        background: "rgba(15,40,24,0.55)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 640,
          background: "#FFFFFF",
          borderRadius: isMobile ? "20px 20px 0 0" : 20,
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
          maxHeight: isMobile ? "90vh" : "86vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : isMobile
              ? "translateY(28px)"
              : "translateY(10px) scale(0.985)",
          transition: "transform 240ms cubic-bezier(.16,1,.3,1), opacity 180ms ease",
        }}
      >
        {isMobile && (
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 999,
              background: C.neutralMid,
              margin: "10px auto 2px",
            }}
          />
        )}

        {/* Header avec navigation + fermeture */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 16px",
            borderBottom: `1px solid ${C.neutralMid}`,
          }}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!hasPrev}
            aria-label="Rapport précédent"
            style={navButtonStyle(hasPrev)}
          >
            <ChevronLeft size={20} />
          </button>

          <div style={{ flex: 1, textAlign: "center", minWidth: 0, padding: "0 6px" }}>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 700,
                fontSize: 16,
                color: C.forestDark,
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {current.titre || "Rapport"}
            </div>
            <div style={{ fontSize: 12, color: C.inkLight, marginTop: 2 }}>
              {dateFR(current.date_visite)}
              {reports.length > 1 && ` · ${index + 1} / ${reports.length}`}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            disabled={!hasNext}
            aria-label="Rapport suivant"
            style={navButtonStyle(hasNext)}
          >
            <ChevronRight size={20} />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.inkLight,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginLeft: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps du rapport */}
        <div style={{ padding: "18px 22px 22px", overflowY: "auto" }}>
          {current.statut_projet && (
            <div style={{ marginBottom: 14 }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: C.forestMid + "1A",
                  color: C.forestDark,
                  fontWeight: 500,
                }}
              >
                {current.statut_projet}
              </span>
            </div>
          )}

          {current.observations && (
            <section style={{ marginBottom: 16 }}>
              <h4 style={sectionTitleStyle}>Observations</h4>
              <p style={paragraphStyle}>{current.observations}</p>
            </section>
          )}

          {current.problemes_detectes && (
            <section
              style={{
                marginBottom: 16,
                padding: 12,
                background: C.brick + "0D",
                borderLeft: `3px solid ${C.brick}`,
                borderRadius: 6,
              }}
            >
              <h4 style={{ ...sectionTitleStyle, color: C.brick }}>
                Problèmes détectés
              </h4>
              <p style={paragraphStyle}>{current.problemes_detectes}</p>
            </section>
          )}

          {current.actions_recommandees && (
            <section
              style={{
                marginBottom: 16,
                padding: 12,
                background: C.forest + "0D",
                borderLeft: `3px solid ${C.forest}`,
                borderRadius: 6,
              }}
            >
              <h4 style={{ ...sectionTitleStyle, color: C.forest }}>
                Actions recommandées
              </h4>
              <p style={paragraphStyle}>{current.actions_recommandees}</p>
            </section>
          )}

          {current.photos_urls && current.photos_urls.length > 0 && (
            <section>
              <h4 style={sectionTitleStyle}>
                Photos ({current.photos_urls.length})
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                }}
              >
                {current.photos_urls.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      border: `1px solid ${C.neutralMid}`,
                      aspectRatio: "1 / 1",
                    }}
                  >
                    <StorageImage
                      bucket="field-reports"
                      path={p}
                      alt={`Photo ${i + 1}`}
                      linkable
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Hint navigation (mobile uniquement + si plusieurs rapports) */}
        {isMobile && reports.length > 1 && (
          <div
            style={{
              padding: "8px 22px 14px",
              fontSize: 11,
              color: C.inkLight,
              textAlign: "center",
              borderTop: `1px solid ${C.neutralMid}`,
            }}
          >
            ← Balayez pour naviguer →
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

/* Section rapports — état recherche + grille + modal */
function ReportsSection({ reports }: { reports: Report[] }) {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = useMemo(
    () => reports.filter((r) => matchesReport(r, query)),
    [reports, query],
  );

  // Si le rapport ouvert sort du filtre, refermer proprement
  useEffect(() => {
    if (openIdx !== null && openIdx >= filtered.length) {
      setOpenIdx(null);
    }
  }, [filtered.length, openIdx]);

  return (
    <div>
      <h2
        className="text-xl font-bold text-forest-dark mb-4 flex items-center gap-2"
        style={{ fontFamily: "var(--serif)" }}
      >
        <FileText size={18} className="text-forest" /> Rapports de terrain (
        {reports.length})
      </h2>

      <ReportSearch
        query={query}
        onQuery={setQuery}
        filteredCount={filtered.length}
        totalCount={reports.length}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-ink-light text-sm bg-forest-xlight rounded-xl border border-neutral-mid">
          Aucun rapport ne correspond à « {query} ».
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((r, i) => (
            <ReportCard key={r.id} r={r} onClick={() => setOpenIdx(i)} />
          ))}
        </div>
      )}

      {openIdx !== null && filtered[openIdx] && (
        <ReportsModal
          reports={filtered}
          index={openIdx}
          onIndexChange={setOpenIdx}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </div>
  );
}

function ProjectView({
  data,
  onReset,
}: {
  data: SharedProject;
  onReset: () => void;
}) {
  const { project, tasks, expenses, revenues, deposits, reports, evidence } = data;
  const totalDep = sum(expenses.map((e) => e.montant ?? 0));
  const totalRev = sum(revenues.map((r) => r.montant ?? 0));
  const totalDepots = sum(deposits.map((d) => d.montant ?? 0));
  const treso = totalDepots + totalRev - totalDep;

  // Tâche ouverte dans la modale de détail (lecture seule)
  const [openTask, setOpenTask] = useState<Task | null>(null);

  return (
    <>
      <TaskModal
        task={openTask}
        evidence={evidence}
        projectUnit={project.unite_recolte}
        onClose={() => setOpenTask(null)}
      />
      {/* En-tete projet */}
      <section className="relative bg-forest-dark pt-28 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors"
          >
            <RotateCcw size={14} /> Tous les projets
          </button>
          <p className="text-amber-light text-sm font-semibold uppercase tracking-wider mb-2">
            Projet partagé · lecture seule
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--serif)" }}
          >
            {project.name}
          </h1>
          <p className="text-white/70 mb-8">
            {[
              project.type_production,
              project.speculation_autre,
              project.surface ? `${project.surface} ha` : null,
              project.statut,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Budget" value={`${fmt(project.budget)}`} />
            <Stat label="Dépenses" value={`${fmt(totalDep)}`} />
            <Stat label="Recettes" value={`${fmt(totalRev)}`} />
            <Stat label="Trésorerie" value={`${fmt(treso)}`} />
          </div>
        </div>
      </section>

      {/* Graphiques */}
      <section className="py-12 bg-neutral">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-5">
          <Card icon={Wallet} title="Budget consommé">
            <BudgetGauge total={totalDep} budget={project.budget ?? 0} />
          </Card>
          <Card icon={PieChart} title="Où part l'argent">
            <ExpensesByPoste expenses={expenses} />
          </Card>
          <Card icon={ListChecks} title="Avancement des tâches">
            <TasksProgress tasks={tasks} />
          </Card>
          <Card icon={Wheat} title="Récolte cumulée">
            <HarvestSummary tasks={tasks} projectUnit={project.unite_recolte} />
          </Card>
          <div className="md:col-span-2 min-w-0">
            <Card icon={TrendingUp} title="Entrées, sorties et trésorerie">
              <CashFlowChart
                expenses={expenses}
                revenues={revenues}
                deposits={deposits}
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Detail des donnees */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {/* Taches */}
          <div>
            <h2
              className="text-xl font-bold text-forest-dark mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--serif)" }}
            >
              <ListChecks size={18} className="text-forest" /> Tâches ({tasks.length})
            </h2>
            {tasks.length ? (
              <div className="overflow-x-auto rounded-xl border border-neutral-mid">
                <table className="w-full text-sm">
                  <thead className="bg-neutral text-ink-mid">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold">Tâche</th>
                      <th className="text-left px-4 py-2.5 font-semibold">État</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Échéance</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Récolte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => {
                      const s = taskState(t);
                      const label =
                        s === "termine"
                          ? "Terminée"
                          : s === "en_cours"
                            ? "En cours"
                            : "À faire";
                      return (
                        <tr
                          key={t.id}
                          onClick={() => setOpenTask(t)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setOpenTask(t);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`Voir le détail : ${t.name || "tâche"}`}
                          className="border-t border-neutral-mid cursor-pointer hover:bg-neutral/60 focus:bg-neutral/60 focus:outline-none transition-colors"
                        >
                          <td className="px-4 py-2.5 text-ink">{t.name || "—"}</td>
                          <td className="px-4 py-2.5">
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                color:
                                  s === "termine"
                                    ? C.forest
                                    : s === "en_cours"
                                      ? C.amberDark
                                      : C.inkLight,
                                background:
                                  s === "termine"
                                    ? "#EBF2EC"
                                    : s === "en_cours"
                                      ? "#FAEEDA"
                                      : "#F4F4F0",
                              }}
                            >
                              {label}
                            </span>
                            {isLate(t) && (
                              <span className="ml-2 text-xs text-brick font-medium">
                                en retard
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-ink-light">
                            {dateFR(t.date_fin)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-ink">
                            <span className="inline-flex items-center justify-end gap-1.5">
                              <span>
                                {t.quantite_recoltee
                                  ? `${t.quantite_recoltee.toLocaleString("fr-FR")} ${
                                      t.unite_recoltee || ""
                                    }`
                                  : "—"}
                              </span>
                              <ChevronRight
                                size={14}
                                className="text-ink-light shrink-0"
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-ink-light">Aucune tâche.</p>
            )}
          </div>

          {/* Caisse : depenses / revenus / depots */}
          <div className="grid lg:grid-cols-3 gap-6">
            <FinanceList
              icon={Receipt}
              title={`Dépenses (${expenses.length})`}
              rows={expenses.map((e) => ({
                id: e.id,
                left: posteLabel(e.poste),
                sub: e.description || dateFR(e.date),
                amount: e.montant,
                color: C.brick,
                title: posteLabel(e.poste),
                fields: [
                  { label: "Poste", value: posteLabel(e.poste) },
                  { label: "Date", value: dateFR(e.date) },
                  { label: "Description", value: e.description },
                ],
              }))}
            />
            <FinanceList
              icon={TrendingUp}
              title={`Revenus (${revenues.length})`}
              rows={revenues.map((r) => ({
                id: r.id,
                left: r.source || r.categorie || "Vente",
                sub: r.acheteur || dateFR(r.date),
                amount: r.montant,
                color: C.forest,
                title: r.source || r.categorie || "Vente",
                fields: [
                  { label: "Catégorie", value: r.categorie },
                  { label: "Date", value: dateFR(r.date) },
                  { label: "Acheteur", value: r.acheteur },
                  {
                    label: "Quantité",
                    value: r.quantite ? r.quantite.toLocaleString("fr-FR") : null,
                  },
                  {
                    label: "Prix unitaire",
                    value: r.prix_unitaire ? `${fmt(r.prix_unitaire)} FCFA` : null,
                  },
                  { label: "Description", value: r.description },
                ],
              }))}
            />
            <FinanceList
              icon={ArrowDownToLine}
              title={`Dépôts (${deposits.length})`}
              rows={deposits.map((d) => ({
                id: d.id,
                left: d.operateur || "Dépôt",
                sub: d.note || dateFR(d.date_depot),
                amount: d.montant,
                color: C.forestMid,
                title: d.operateur || "Dépôt",
                fields: [
                  { label: "Opérateur", value: d.operateur },
                  { label: "Date", value: dateFR(d.date_depot) },
                  { label: "Note", value: d.note },
                ],
              }))}
            />
          </div>

          {/* Rapports de terrain — cartes compactes + modal swipeable + recherche */}
          {reports.length > 0 && <ReportsSection reports={reports} />}
        </div>
      </section>
    </>
  );
}

type FinanceRow = {
  id: string;
  left: string;
  sub: string;
  amount: number | null;
  color: string;
  title: string;
  fields: Field[];
};

function FinanceList({
  icon: Icon,
  title,
  rows,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  rows: FinanceRow[];
}) {
  const [open, setOpen] = useState<FinanceRow | null>(null);
  return (
    <div className="rounded-xl border border-neutral-mid overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral border-b border-neutral-mid">
        <Icon size={16} className="text-forest" />
        <span className="font-semibold text-forest-dark text-sm">{title}</span>
      </div>
      {rows.length ? (
        <div className="divide-y divide-neutral-mid max-h-72 overflow-y-auto">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setOpen(r)}
              className="w-full text-left flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-neutral/60 focus:bg-neutral/60 focus:outline-none transition-colors"
            >
              <div className="min-w-0 pr-1">
                <p className="text-sm text-ink truncate">{r.left}</p>
                <p className="text-xs text-ink-light truncate">{r.sub}</p>
              </div>
              <span className="flex items-center gap-1.5 shrink-0">
                <span
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: r.color }}
                >
                  {fmt(r.amount)}
                </span>
                <ChevronRight size={14} className="text-ink-light" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-light px-4 py-4">Aucune ligne.</p>
      )}

      <DetailModal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.title ?? ""}
        icon={Icon}
        accent={open?.color}
        headline={open ? `${fmt(open.amount)} FCFA` : undefined}
        fields={open?.fields ?? []}
      />
    </div>
  );
}


/* ════════════════════════════════════════════
   Tableau de bord : projets d'une exploitation
════════════════════════════════════════════ */

function Dashboard({
  exploitations,
  selectedOwnerId,
  onSelectExploitation,
  projects,
  loadingProjects,
  onOpenProject,
  onAddExploitation,
}: {
  exploitations: Exploitation[];
  selectedOwnerId: string | null;
  onSelectExploitation: (id: string) => void;
  projects: ProjectSummary[] | null;
  loadingProjects: boolean;
  onOpenProject: (id: string) => void;
  onAddExploitation: () => void;
}) {
  const current =
    exploitations.find((e) => e.owner_id === selectedOwnerId) ?? exploitations[0];
  const count = current?.project_count ?? 0;

  return (
    <>
      <section className="relative bg-forest-dark pt-28 pb-10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-amber-light text-sm font-semibold uppercase tracking-wider mb-2">
            Suivi d&apos;exploitation · lecture seule
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--serif)" }}
          >
            {current?.name || "Exploitation"}
          </h1>
          <p className="text-white/70">
            {count} projet{count > 1 ? "s" : ""}
          </p>

          {exploitations.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {exploitations.map((e) => (
                <button
                  key={e.owner_id}
                  onClick={() => onSelectExploitation(e.owner_id)}
                  className={
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors " +
                    (e.owner_id === current?.owner_id
                      ? "bg-white text-forest-dark"
                      : "bg-white/10 text-white hover:bg-white/20")
                  }
                >
                  <Building2 size={14} className="inline mr-1.5 -mt-0.5" />
                  {e.name || "Exploitation"}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-neutral min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-6">
          {loadingProjects || projects === null ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-forest" size={28} />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-center text-ink-light py-16">
              Aucun projet dans cette exploitation pour l&apos;instant.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => {
                const done = !!p.date_cloture;
                return (
                  <button
                    key={p.id}
                    onClick={() => onOpenProject(p.id)}
                    className="text-left bg-white rounded-2xl shadow-sm border border-neutral-mid p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className="font-bold text-forest-dark leading-tight"
                        style={{ fontFamily: "var(--serif)" }}
                      >
                        {p.name}
                      </h3>
                      <span
                        className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={
                          done
                            ? { color: C.inkLight, background: "#F4F4F0" }
                            : { color: C.forest, background: "#EBF2EC" }
                        }
                      >
                        {done ? "Terminé" : "En cours"}
                      </span>
                    </div>
                    <p className="text-sm text-ink-light mb-4 flex-1">
                      {[
                        p.type_production,
                        p.speculation_autre,
                        p.surface ? `${p.surface} ha` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-forest font-medium">
                      Voir le détail <ChevronRight size={16} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={onAddExploitation}
              className="text-sm text-ink-light hover:text-forest transition-colors underline"
            >
              Ajouter une autre exploitation
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════
   Page
════════════════════════════════════════════ */

export default function CollaborateursPage() {
  useScrollReveal();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const [exploitations, setExploitations] = useState<Exploitation[] | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [detail, setDetail] = useState<SharedProject | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [showCodeForm, setShowCodeForm] = useState(false);
  const [code, setCode] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Mes exploitations (une fois connecté)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("list_my_exploitations");
      if (cancelled) return;
      if (error) {
        setExploitations([]);
        return;
      }
      const list = (data as Exploitation[]) ?? [];
      setExploitations(list);
      if (list.length > 0) {
        setSelectedOwnerId((cur) => cur ?? list[0].owner_id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Projets de l'exploitation sélectionnée
  useEffect(() => {
    if (!selectedOwnerId) {
      setProjects(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingProjects(true);
      const { data } = await supabase.rpc("get_exploitation_projects", {
        p_owner_id: selectedOwnerId,
      });
      if (!cancelled) {
        setProjects((data as ProjectSummary[]) ?? []);
        setLoadingProjects(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedOwnerId]);

  async function openProject(id: string) {
    setLoadingDetail(true);
    const { data } = await supabase.rpc("get_shared_project", {
      p_project_id: id,
    });
    setLoadingDetail(false);
    if (data) setDetail(data as SharedProject);
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    setCodeLoading(true);
    setCodeError(null);
    const { data, error } = await supabase.rpc("redeem_exploitation_code", {
      p_code: c,
    });
    setCodeLoading(false);
    if (error) {
      setCodeError("Une erreur est survenue. Assurez-vous d'être connecté.");
      return;
    }
    if (!data) {
      setCodeError("Code invalide.");
      return;
    }
    const owner = (data as { owner_id: string }).owner_id;
    const { data: list } = await supabase.rpc("list_my_exploitations");
    setExploitations((list as Exploitation[]) ?? []);
    setSelectedOwnerId(owner);
    setShowCodeForm(false);
    setCode("");
  }

  // 1) Détail d'un projet
  if (detail) {
    return (
      <>
        <Navbar />
        <main>
          <ProjectView data={detail} onReset={() => setDetail(null)} />
        </main>
        <Footer />
      </>
    );
  }

  // 2) Tableau de bord (membre d'au moins une exploitation)
  const showDashboard =
    !!user && exploitations !== null && exploitations.length > 0 && !showCodeForm;

  if (showDashboard) {
    return (
      <>
        <Navbar />
        <main>
          {loadingDetail && (
            <div className="fixed inset-0 z-[60] bg-forest-dark/30 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}
          <Dashboard
            exploitations={exploitations!}
            selectedOwnerId={selectedOwnerId}
            onSelectExploitation={(id) => setSelectedOwnerId(id)}
            projects={projects}
            loadingProjects={loadingProjects}
            onOpenProject={openProject}
            onAddExploitation={() => setShowCodeForm(true)}
          />
        </main>
        <Footer />
      </>
    );
  }

  // 3) Entrée : connexion + code d'exploitation
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-forest-xlight">
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-light mb-5">
                <KeyRound size={26} className="text-forest" />
              </div>
              <h1
                className="text-3xl font-bold text-forest-dark mb-3"
                style={{ fontFamily: "var(--serif)" }}
              >
                Espace collaborateur
              </h1>
              <p className="text-ink-light leading-relaxed">
                Le promoteur vous a transmis un code d&apos;exploitation ?
                Saisissez-le une fois pour suivre tous ses projets en lecture
                seule.
              </p>
            </div>

            {authLoading || (user && exploitations === null && !showCodeForm) ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-forest" size={28} />
              </div>
            ) : !user ? (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-mid p-6 text-center">
                <p className="text-ink-mid mb-5">
                  Connectez-vous avec votre adresse e-mail pour accéder à une
                  exploitation partagée.
                </p>
                <Link
                  href={authHref(pathname)}
                  className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full"
                >
                  <LogIn size={18} /> Se connecter
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleRedeem}
                className="bg-white rounded-2xl shadow-sm border border-neutral-mid p-6"
              >
                <label
                  htmlFor="collab-code"
                  className="block text-sm text-ink-mid mb-2 font-medium"
                >
                  Code d&apos;exploitation
                </label>
                <input
                  id="collab-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex : A1B2C3D4E5F6G7H8"
                  autoCapitalize="characters"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl bg-forest-xlight border border-neutral-mid text-forest-dark font-semibold tracking-widest outline-none focus:border-forest transition-colors"
                  style={{ fontFamily: "var(--mono)" }}
                />
                {codeError && <p className="text-sm text-brick mt-3">{codeError}</p>}
                <button
                  type="submit"
                  disabled={codeLoading || !code.trim()}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  {codeLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Search size={18} />
                  )}
                  {codeLoading ? "Vérification…" : "Accéder à l'exploitation"}
                </button>
                {exploitations && exploitations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCodeForm(false);
                      setCodeError(null);
                      setCode("");
                    }}
                    className="mt-3 w-full text-sm text-ink-light hover:text-forest transition-colors"
                  >
                    Retour à mes exploitations
                  </button>
                )}
                <p className="text-xs text-ink-light mt-4 text-center">
                  Connecté en tant que {user.email}
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
