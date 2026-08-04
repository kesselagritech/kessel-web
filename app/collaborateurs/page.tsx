"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useMemo, useEffect } from "react";
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
  Camera,
  RotateCcw,
  Building2,
  ChevronRight,
} from "lucide-react";

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
  main_oeuvre: "Main d'\u0153uvre",
  materiel: "Mat\u00e9riel",
  transport: "Transport",
  irrigation: "Irrigation",
  alimentation_animaux: "Alimentation animaux",
  veterinaire: "V\u00e9t\u00e9rinaire",
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
  "janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin",
  "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c.",
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
  d ? new Date(d).toLocaleDateString("fr-FR") : "\u2014";

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
          {budget > 0 ? Math.round(pct * 100) : "\u2014"}
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
          Budget d\u00e9pass\u00e9 de {fmt(total - budget)} FCFA.
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
    return <p className="text-sm text-ink-light">Aucune d\u00e9pense enregistr\u00e9e.</p>;
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

  if (data.months.length === 0)
    return <p className="text-sm text-ink-light">Aucun mouvement dat\u00e9 \u00e0 afficher.</p>;

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
          <span className="w-3 h-3 rounded-sm" style={{ background: C.forestMid }} /> Entr\u00e9es
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: C.brick }} /> Sorties
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5" style={{ background: C.amberDark }} /> Tr\u00e9sorerie
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label="Entr\u00e9es, sorties et tr\u00e9sorerie par mois"
        >
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
        </svg>
      </div>
      <p className="text-sm text-ink-mid mt-3">
        Tr\u00e9sorerie actuelle :{" "}
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
    return <p className="text-sm text-ink-light">Aucune t\u00e2che enregistr\u00e9e.</p>;

  const seg = [
    { n: termine, c: C.forest, label: "Termin\u00e9es" },
    { n: enCours, c: C.amber, label: "En cours" },
    { n: aFaire, c: C.neutralMid, label: "\u00c0 faire" },
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
          {late} t\u00e2che{late > 1 ? "s" : ""} en retard (\u00e9ch\u00e9ance
          d\u00e9pass\u00e9e, non cl\u00f4tur\u00e9e{late > 1 ? "s" : ""}).
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
    return <p className="text-sm text-ink-light">Aucune r\u00e9colte enregistr\u00e9e.</p>;

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

  return (
    <>
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
            Projet partag\u00e9 \u00b7 lecture seule
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
              .join(" \u00b7 ")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Budget" value={`${fmt(project.budget)}`} />
            <Stat label="D\u00e9penses" value={`${fmt(totalDep)}`} />
            <Stat label="Recettes" value={`${fmt(totalRev)}`} />
            <Stat label="Tr\u00e9sorerie" value={`${fmt(treso)}`} />
          </div>
        </div>
      </section>

      {/* Graphiques */}
      <section className="py-12 bg-neutral">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-5">
          <Card icon={Wallet} title="Budget consomm\u00e9">
            <BudgetGauge total={totalDep} budget={project.budget ?? 0} />
          </Card>
          <Card icon={PieChart} title="O\u00f9 part l'argent">
            <ExpensesByPoste expenses={expenses} />
          </Card>
          <Card icon={ListChecks} title="Avancement des t\u00e2ches">
            <TasksProgress tasks={tasks} />
          </Card>
          <Card icon={Wheat} title="R\u00e9colte cumul\u00e9e">
            <HarvestSummary tasks={tasks} projectUnit={project.unite_recolte} />
          </Card>
          <div className="md:col-span-2">
            <Card icon={TrendingUp} title="Entr\u00e9es, sorties et tr\u00e9sorerie">
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
              <ListChecks size={18} className="text-forest" /> T\u00e2ches ({tasks.length})
            </h2>
            {tasks.length ? (
              <div className="overflow-x-auto rounded-xl border border-neutral-mid">
                <table className="w-full text-sm">
                  <thead className="bg-neutral text-ink-mid">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold">T\u00e2che</th>
                      <th className="text-left px-4 py-2.5 font-semibold">\u00c9tat</th>
                      <th className="text-left px-4 py-2.5 font-semibold">\u00c9ch\u00e9ance</th>
                      <th className="text-right px-4 py-2.5 font-semibold">R\u00e9colte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => {
                      const s = taskState(t);
                      const label =
                        s === "termine"
                          ? "Termin\u00e9e"
                          : s === "en_cours"
                            ? "En cours"
                            : "\u00c0 faire";
                      return (
                        <tr key={t.id} className="border-t border-neutral-mid">
                          <td className="px-4 py-2.5 text-ink">{t.name || "\u2014"}</td>
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
                            {t.quantite_recoltee
                              ? `${t.quantite_recoltee.toLocaleString("fr-FR")} ${
                                  t.unite_recoltee || ""
                                }`
                              : "\u2014"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-ink-light">Aucune t\u00e2che.</p>
            )}
          </div>

          {/* Caisse : depenses / revenus / depots */}
          <div className="grid lg:grid-cols-3 gap-6">
            <FinanceList
              icon={Receipt}
              title={`D\u00e9penses (${expenses.length})`}
              rows={expenses.map((e) => ({
                id: e.id,
                left: posteLabel(e.poste),
                sub: e.description || dateFR(e.date),
                amount: e.montant,
                color: C.brick,
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
              }))}
            />
            <FinanceList
              icon={ArrowDownToLine}
              title={`D\u00e9p\u00f4ts (${deposits.length})`}
              rows={deposits.map((d) => ({
                id: d.id,
                left: d.operateur || "D\u00e9p\u00f4t",
                sub: d.note || dateFR(d.date_depot),
                amount: d.montant,
                color: C.forestMid,
              }))}
            />
          </div>

          {/* Rapports de terrain */}
          {reports.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold text-forest-dark mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--serif)" }}
              >
                <FileText size={18} className="text-forest" /> Rapports de terrain (
                {reports.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-neutral-mid p-4 bg-forest-xlight"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-forest-dark">
                        {r.titre || "Rapport"}
                      </span>
                      <span className="text-xs text-ink-light">
                        {dateFR(r.date_visite)}
                      </span>
                    </div>
                    {r.observations && (
                      <p className="text-sm text-ink-mid leading-relaxed mb-2 whitespace-pre-line">
                        {r.observations}
                      </p>
                    )}
                    {r.problemes_detectes && (
                      <p className="text-sm text-brick mb-1">
                        <span className="font-semibold">Probl\u00e8mes : </span>
                        {r.problemes_detectes}
                      </p>
                    )}
                    {r.actions_recommandees && (
                      <p className="text-sm text-forest-dark">
                        <span className="font-semibold">Actions : </span>
                        {r.actions_recommandees}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preuves / photos */}
          {evidence.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold text-forest-dark mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--serif)" }}
              >
                <Camera size={18} className="text-forest" /> Preuves ({evidence.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-neutral-mid overflow-hidden bg-neutral"
                  >
                    {ev.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ev.photo_url}
                        alt={ev.notes || "Preuve"}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : null}
                    <div className="px-3 py-2">
                      <p className="text-xs text-ink-mid truncate">
                        {ev.notes || ev.evidence_type || "Preuve"}
                      </p>
                      <p className="text-[11px] text-ink-light">
                        {dateFR(ev.captured_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FinanceList({
  icon: Icon,
  title,
  rows,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  rows: {
    id: string;
    left: string;
    sub: string;
    amount: number | null;
    color: string;
  }[];
}) {
  return (
    <div className="rounded-xl border border-neutral-mid overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral border-b border-neutral-mid">
        <Icon size={16} className="text-forest" />
        <span className="font-semibold text-forest-dark text-sm">{title}</span>
      </div>
      {rows.length ? (
        <div className="divide-y divide-neutral-mid max-h-72 overflow-y-auto">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0 pr-2">
                <p className="text-sm text-ink truncate">{r.left}</p>
                <p className="text-xs text-ink-light truncate">{r.sub}</p>
              </div>
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: r.color }}
              >
                {fmt(r.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-light px-4 py-4">Aucune ligne.</p>
      )}
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
                  href="/connexion"
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
