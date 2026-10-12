"use client";
// components/Navbar.tsx — [nav-v2]
// Une barre, trois formes :
//  - Ordinateur (souris)      : icônes à droite, le nom se déplie au survol ou au clavier (Tab).
//  - Tablette (écran tactile) : 1er toucher = le nom se déplie (l'onglet courant replie le sien
//                               mais reste en surbrillance), 2e toucher = ouverture de la page.
//  - Téléphone (< 768 px)     : en-tête fin en haut + barre fixe en bas (4 onglets + « Plus »).
// L'onglet de la page en cours reste toujours déplié et en surbrillance.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authHref } from "@/lib/authHref";

// ─── Icônes (tracé Lucide, inline : aucune dépendance de version) ────────────
type IconName =
  | "home" | "book" | "video" | "mic" | "chart" | "phone" | "users" | "mail"
  | "user" | "more" | "x" | "logout" | "login" | "receipt";

const PATHS: Record<IconName, ReactNode> = {
  home: (<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  book: (<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
  video: (<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m10 9 5 3-5 3z" /></>),
  mic: (<><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></>),
  chart: (<><line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="8" /><line x1="18" y1="20" x2="18" y2="4" /></>),
  phone: (<><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>),
  users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  mail: (<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" /></>),
  user: (<><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>),
  more: (<><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>),
  x: (<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>),
  logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>),
  login: (<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>),
  receipt: (<><path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="14" y2="13" /></>),
};

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      {PATHS[name]}
    </svg>
  );
}

// ─── Onglets ──────────────────────────────────────────────────────────────────
type Tab = { key: string; href: string; label: string; short: string; icon: IconName; soon?: boolean };

const TABS: Tab[] = [
  { key: "home", href: "/", label: "Accueil", short: "Accueil", icon: "home" },
  { key: "biblio", href: "/bibliotheque", label: "Bibliothèque", short: "Bibliothèque", icon: "book" },
  { key: "videos", href: "/videos", label: "Vidéos", short: "Vidéos", icon: "video", soon: true },
  { key: "podcasts", href: "/podcasts", label: "Podcasts", short: "Podcasts", icon: "mic", soon: true },
  { key: "comparateur", href: "/comparateur", label: "Comparateur", short: "Comparateur", icon: "chart" },
  { key: "app", href: "/application", label: "Application", short: "Application", icon: "phone" },
  { key: "collab", href: "/collaborateurs", label: "Espace collaborateur", short: "Collaborateurs", icon: "users" },
  { key: "contact", href: "/contact", label: "Contact", short: "Contact", icon: "mail" },
];

// Téléphone : 4 onglets dans la barre du bas, le reste dans « Plus »
const MOBILE_BAR = ["home", "biblio", "comparateur", "collab"];
const MOBILE_MORE = ["videos", "podcasts", "app", "contact"];

const byKey = (k: string) => TABS.find((t) => t.key === k)!;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading: authLoading, signOut } = useAuth();
  const loginHref = authHref(pathname);
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";

  const [touch, setTouch] = useState(false);          // écran sans survol (tablette)
  const [openKey, setOpenKey] = useState<string | null>(null); // nom déplié au 1er toucher
  const [sheet, setSheet] = useState(false);          // panneau « Plus » (téléphone)
  const [accountMenu, setAccountMenu] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Détecte un écran tactile sans survol (tablette, téléphone en paysage)
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Changement de page : tout se referme
  useEffect(() => {
    setOpenKey(null);
    setSheet(false);
    setAccountMenu(false);
  }, [pathname]);

  // Toucher ailleurs : replie le nom ouvert et le menu du compte
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (barRef.current && !barRef.current.contains(t)) setOpenKey(null);
      if (accountRef.current && !accountRef.current.contains(t)) setAccountMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Échap : ferme panneau et menus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSheet(false); setAccountMenu(false); setOpenKey(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Tablette : 1er toucher = déplier le nom, 2e toucher = ouvrir la page
  const onTabClick = (tab: Tab, active: boolean) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!touch || active) return;
    if (openKey !== tab.key) {
      e.preventDefault();
      setOpenKey(tab.key);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/connexion?deconnecte=1";
  };

  const moreActive = MOBILE_MORE.some((k) => isActive(pathname, byKey(k).href));

  return (
    <>
      {/* ═══ BARRE DU HAUT ═══════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50 bg-forest-dark shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <nav aria-label="Navigation principale" className="max-w-7xl mx-auto h-[60px] md:h-[76px] px-4 md:px-6 lg:px-8 flex items-center">
          {/* Logo */}
          <Link href="/" aria-label="Kessel Agritech, accueil" className="flex items-center gap-2.5 shrink-0">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
              <polygon points="16,2 28.5,9 28.5,23 16,30 3.5,23 3.5,9" fill="none" stroke="#E8B84D" strokeWidth="2.4" />
              <text x="16" y="21" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="14" fill="#FFFFFF">K</text>
            </svg>
            <span className="font-bold text-lg md:text-[22px] text-white whitespace-nowrap" style={{ fontFamily: "var(--serif)" }}>
              Kessel<span style={{ color: "#E8B84D" }}> Agritech</span>
            </span>
          </Link>

          {/* Onglets — tablette et ordinateur, groupés à droite */}
          <div ref={barRef} className="hidden md:flex items-center gap-1 ml-auto">
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              const open = openKey === tab.key;
              const folded = active && openKey !== null; // l'onglet courant replie son nom
              const expanded = (active && !folded) || open;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onClick={onTabClick(tab, active)}
                  aria-current={active ? "page" : undefined}
                  aria-label={tab.soon ? `${tab.label} (bientôt disponible)` : tab.label}
                  data-expanded={expanded ? "true" : "false"}
                  className={
                    "knav-tab group relative flex items-center h-11 min-w-11 px-3 rounded-full transition-colors duration-150 " +
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84D] " +
                    (active
                      ? "bg-forest-light text-forest-dark"
                      : open
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:bg-white/12 hover:text-white")
                  }
                >
                  <Icon name={tab.icon} />
                  {tab.soon && (
                    <span aria-hidden="true" className="absolute top-2 left-[30px] w-2 h-2 rounded-full bg-[#E8B84D] ring-2 ring-forest-dark" />
                  )}
                  <span className="knav-label text-sm font-medium whitespace-nowrap">
                    {tab.label}
                    {tab.soon && <span className="ml-1.5 text-xs font-semibold text-[#E8B84D]">· bientôt</span>}
                  </span>
                </Link>
              );
            })}

            <span aria-hidden="true" className="w-px h-7 bg-white/20 mx-2 lg:ml-3 lg:mr-3" />

            {/* Compte */}
            {authLoading ? (
              <span className="w-11 h-11" />
            ) : user ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenu((v) => !v)}
                  aria-expanded={accountMenu}
                  aria-haspopup="menu"
                  aria-label="Mon compte"
                  className="flex items-center gap-2 h-11 pl-1 pr-1 lg:pr-4 rounded-full border-[1.5px] border-white/35 text-white hover:bg-white/12 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84D]"
                >
                  <span className="w-9 h-9 rounded-full bg-[#E8B84D] text-forest-dark font-semibold text-sm flex items-center justify-center">
                    {userInitial}
                  </span>
                  <span className="hidden lg:inline text-sm font-medium">Mon compte</span>
                </button>
                {accountMenu && (
                  <div role="menu" className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg p-2 text-forest-dark">
                    <p className="px-3 py-2 text-xs text-ink-light truncate">{user.email}</p>
                    <Link role="menuitem" href="/mes-documents" className="flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-forest-light font-medium">
                      <Icon name="receipt" size={20} /> Mes achats
                    </Link>
                    <button role="menuitem" type="button" onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-forest-light font-medium text-left">
                      <Icon name="logout" size={20} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={loginHref}
                aria-label="Connexion"
                className="flex items-center gap-2 h-11 px-3 lg:px-4 rounded-full border-[1.5px] border-white/35 text-white text-sm font-medium hover:bg-white/12 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84D]"
              >
                <Icon name="user" size={20} />
                <span className="hidden lg:inline">Connexion</span>
              </Link>
            )}
          </div>

          {/* Compte — téléphone (en haut à droite) */}
          <div className="md:hidden ml-auto">
            {!authLoading && (
              <Link
                href={user ? "/mes-documents" : loginHref}
                aria-label={user ? "Mes achats" : "Connexion"}
                className="w-11 h-11 flex items-center justify-center text-white"
              >
                {user ? (
                  <span className="w-8 h-8 rounded-full bg-[#E8B84D] text-forest-dark font-semibold text-sm flex items-center justify-center">
                    {userInitial}
                  </span>
                ) : (
                  <Icon name="user" />
                )}
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* ═══ TÉLÉPHONE : PANNEAU « PLUS » ════════════════════════════════ */}
      {sheet && (
        <div className="md:hidden fixed inset-0 z-[55]">
          <button type="button" aria-label="Fermer le panneau" onClick={() => setSheet(false)} className="absolute inset-0 w-full h-full bg-[rgba(15,40,24,0.45)]" />
          <div role="dialog" aria-modal="true" aria-label="Autres rubriques" className="absolute inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] bg-white rounded-t-2xl shadow-lg p-3 pb-4">
            <div className="flex items-center justify-between pl-4 pr-1 pb-2">
              <span className="text-xl font-semibold text-forest-dark" style={{ fontFamily: "var(--serif)" }}>Plus</span>
              <button type="button" aria-label="Fermer" onClick={() => setSheet(false)} className="w-11 h-11 flex items-center justify-center text-forest-dark">
                <Icon name="x" />
              </button>
            </div>
            {MOBILE_MORE.map((k) => {
              const tab = byKey(k);
              const active = isActive(pathname, tab.href);
              return (
                <Link
                  key={k}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={"flex items-center gap-3.5 min-h-[52px] px-4 rounded-xl text-base font-medium text-forest-dark " + (active ? "bg-forest-light" : "hover:bg-forest-light")}
                >
                  <Icon name={tab.icon} />
                  {tab.label}
                  {tab.soon && <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-light text-amber-dark text-xs font-semibold">Bientôt</span>}
                </Link>
              );
            })}
            <div className="mt-2 pt-2 border-t border-neutral-mid">
              {!authLoading && (user ? (
                <>
                  <Link href="/mes-documents" className="flex items-center gap-3.5 min-h-[52px] px-4 rounded-xl text-base font-medium text-forest-dark hover:bg-forest-light">
                    <Icon name="receipt" /> Mes achats
                  </Link>
                  <button type="button" onClick={handleSignOut} className="w-full flex items-center gap-3.5 min-h-[52px] px-4 rounded-xl text-base font-medium text-forest-dark hover:bg-forest-light text-left">
                    <Icon name="logout" /> Déconnexion
                  </button>
                </>
              ) : (
                <Link href={loginHref} className="flex items-center gap-3.5 min-h-[52px] px-4 rounded-xl text-base font-medium text-forest-dark hover:bg-forest-light">
                  <Icon name="login" /> Connexion
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TÉLÉPHONE : BARRE DU BAS ════════════════════════════════════ */}
      <nav
        aria-label="Navigation principale (mobile)"
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white border-t border-[#D5E5D8] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="h-[72px] flex items-center px-1">
          {MOBILE_BAR.map((k) => {
            const tab = byKey(k);
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={k}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={"flex-1 min-w-0 h-16 flex flex-col items-center justify-center gap-1 text-[10.5px] whitespace-nowrap " + (active ? "text-forest-dark font-semibold" : "text-[#6B8A73] font-medium")}
              >
                <span className={"w-[52px] h-[30px] flex items-center justify-center rounded-full transition-colors " + (active ? "bg-[#D5E5D8]" : "")}>
                  <Icon name={tab.icon} />
                </span>
                <span className="max-w-full overflow-hidden text-ellipsis">{tab.short}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setSheet((v) => !v)}
            aria-expanded={sheet}
            aria-haspopup="dialog"
            className={"flex-1 min-w-0 h-16 flex flex-col items-center justify-center gap-1 text-[10.5px] " + (sheet || moreActive ? "text-forest-dark font-semibold" : "text-[#6B8A73] font-medium")}
          >
            <span className={"w-[52px] h-[30px] flex items-center justify-center rounded-full transition-colors " + (sheet || moreActive ? "bg-[#D5E5D8]" : "")}>
              <Icon name="more" />
            </span>
            Plus
          </button>
        </div>
      </nav>
    </>
  );
}
