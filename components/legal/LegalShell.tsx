"use client";
// components/legal/LegalShell.tsx — [legal-v2]
// Briques communes des pages légales (CGU, CGV, confidentialité, mentions légales),
// en FR et en EN. Une seule mise en page : modifier ici change toutes les pages.

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

const SERIF = { fontFamily: "var(--serif)" } as const;

export function LegalShell(props: {
  title: ReactNode;
  accent: ReactNode;
  meta: ReactNode;
  footerNote: ReactNode;
  children: ReactNode;
}) {
  useScrollReveal();

  return (
    <>
      <Navbar />

      <section className="bg-forest-dark pt-28 pb-16 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Legal</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={SERIF}>
            {props.title}
            <br />
            <em className="text-amber-light">{props.accent}</em>
          </h1>
          <p className="reveal reveal-delay-2 text-white/70 text-sm">{props.meta}</p>
        </div>
      </section>

      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="max-w-none">{props.children}</div>
            <div className="mt-12 pt-8 border-t border-neutral-mid text-center">
              <p className="text-ink-light text-sm">{props.footerNote}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="reveal">
      <h2 className="text-2xl font-bold text-forest-dark mb-4" style={SERIF}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-6">{children}</h3>;
}

export function P({ children, last = false }: { children: ReactNode; last?: boolean }) {
  return <p className={`text-ink-mid leading-relaxed ${last ? "mb-8" : "mb-4"}`}>{children}</p>;
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-amber hover:underline">
      {children}
    </a>
  );
}

export function List({ items, variant = "check" }: { items: ReactNode[]; variant?: "check" | "cross" }) {
  return (
    <ul className="space-y-2 mb-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-ink-mid">
          {variant === "check" ? (
            <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-brick shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-forest-dark text-white">
            {head.map((h) => (
              <th key={h} className="p-3 text-left font-semibold" style={SERIF}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i < rows.length - 1 ? "border-b border-neutral-mid" : ""}>
              {row.map((cell, j) => (
                <td key={j} className={`p-3 align-top ${j === 0 ? "font-medium text-forest-dark" : "text-ink-mid"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Box({ children, tone = "forest" }: { children: ReactNode; tone?: "forest" | "amber" }) {
  return tone === "forest" ? (
    <div className="bg-forest-light p-6 rounded-xl mb-6 space-y-1">{children}</div>
  ) : (
    <div className="bg-amber-light/30 border border-amber/30 rounded-xl p-5 mb-6 space-y-2">{children}</div>
  );
}

/** Identité de l'éditeur — source unique, reprise par toutes les pages légales. */
export const EDITOR = {
  tradeName: "ETS KESSELAGRITECH",
  brand: "Kessel Agritech",
  owner: "Atine Mvom Philippe André",
  rccm: "CM-DLA-01-2026-A10-01810",
  niu: "P020018912337M",
  seat: "Douala, Cameroun",
  operations: "Kribi, Région du Sud, Cameroun",
  email: "contact@kesselagritech.com",
  phone: "+237 659 374 501",
  wa: "https://wa.me/237659374501",
} as const;

export function EditorBox({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const fr = lang === "fr";
  const c = fr ? " : " : ": ";
  return (
    <Box>
      <p className="text-forest-dark">
        <strong>{EDITOR.tradeName}</strong> ({fr ? "nom commercial" : "trade name"}
        {c}
        {EDITOR.brand})
      </p>
      <p className="text-ink-mid">
        {fr ? `Entreprise individuelle de ${EDITOR.owner}` : `Sole proprietorship of ${EDITOR.owner}`}
      </p>
      <p className="text-ink-mid">RCCM{c}{EDITOR.rccm}</p>
      <p className="text-ink-mid">{fr ? "NIU" : "Tax ID (NIU)"}{c}{EDITOR.niu}</p>
      <p className="text-ink-mid">
        {fr ? "Siège (RCCM)" : "Registered office"}
        {c}
        {fr ? EDITOR.seat : "Douala, Cameroon"}
      </p>
      <p className="text-ink-mid">
        {fr ? "Exploitation" : "Operations"}
        {c}
        {fr ? EDITOR.operations : "Kribi, South Region, Cameroon"}
      </p>
      <p className="text-ink-mid">
        Email{c}
        <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>
      </p>
      <p className="text-ink-mid">
        WhatsApp{c}
        <A href={EDITOR.wa}>{EDITOR.phone}</A>
      </p>
    </Box>
  );
}
