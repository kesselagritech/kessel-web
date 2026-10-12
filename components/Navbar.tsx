"use client";
// components/Navbar.tsx — [nav-v3]
// Une barre, trois formes :
//  - Ordinateur (souris)      : icônes à droite, le nom se déplie au survol ou au clavier (Tab).
//  - Tablette (écran tactile) : 1er toucher = le nom se déplie (l'onglet courant replie le sien
//                               mais reste en surbrillance), 2e toucher = ouverture de la page.
//  - Téléphone (< 768 px)     : en haut à droite, le bouton du compte puis le bouton « Menu »
//                               qui déploie toute la navigation sous la barre.
// L'onglet de la page en cours reste toujours en surbrillance.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authHref } from "@/lib/authHref";

// ─── Icônes (tracé Lucide, inline : aucune dépendance de version) ────────────
type IconName =
  | "home" | "book" | "video" | "mic" | "chart" | "phone" | "users" | "mail"
  | "user" | "menu" | "x" | "logout" | "login" | "receipt";

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
  menu: (<><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>),
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
type Tab = { key: string; href: string; label: string; icon: IconName; soon?: boolean };

const TABS: Tab[] = [
  { key: "home", href: "/", label: "Accueil", icon: "home" },
  { key: "biblio", href: "/bibliotheque", label: "Bibliothèque", icon: "book" },
  { key: "videos", href: "/videos", label: "Vidéos", icon: "video", soon: true },
  { key: "podcasts", href: "/podcasts", label: "Podcasts", icon: "mic", soon: true },
  { key: "comparateur", href: "/comparateur", label: "Comparateur", icon: "chart" },
  { key: "app", href: "/application", label: "Application", icon: "phone" },
  { key: "collab", href: "/collaborateurs", label: "Espace collaborateur", icon: "users" },
  { key: "contact", href: "/contact", label: "Contact", icon: "mail" },
];

const RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84D]";

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
  const [menu, setMenu] = useState(false);            // navigation déployée (téléphone)
  const [accountMenu, setAccountMenu] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

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
    setMenu(false);
    setAccountMenu(false);
  }, [pathname]);

  // Toucher ailleurs : replie le nom ouvert et le menu du compte
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (barRef.current && !barRef.current.contains(t)) setOpenKey(null);
      if (!t.closest?.("[data-account]")) setAccountMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Échap : ferme tout ; le focus revient sur le bouton « Menu » s'il était ouvert
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu((wasOpen) => {
        if (wasOpen) menuBtnRef.current?.focus();
        return false;
      });
      setAccountMenu(false);
      setOpenKey(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Menu déployé : la page derrière ne défile plus ; passage en tablette/ordinateur : il se ferme
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = () => { if (mq.matches) setMenu(false); };
    mq.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = prev;
      mq.removeEventListener("change", onWide);
    };
  }, [menu]);

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

  // Bouton du compte : « Connexion » si visiteur, sinon initiale + menu (Mes achats, Déconnexion)
  const account = (phone: boolean) => {
    if (authLoading) return <span className="w-11 h-11" />;
    if (!user) {
      return (
        <Link
          href={loginHref}
          aria-label="Connexion"
          className={
            "flex items-center gap-2 h-11 rounded-full border-[1.5px] border-white/35 text-white text-sm font-medium hover:bg-white/12 transition-colors " + RING +
            (phone ? " w-11 justify-center min-[400px]:w-auto min-[400px]:px-3" : " px-3 lg:px-4")
          }
        >
          <Icon name="user" size={20} />
          <span className={phone ? "hidden min-[400px]:inline" : "hidden lg:inline"}>Connexion</span>
        </Link>
      );
    }
    return (
      <div data-account className="relative">
        <button
          type="button"
          onClick={() => { setAccountMenu((v) => !v); setMenu(false); }}
          aria-expanded={accountMenu}
          aria-haspopup="menu"
          aria-label="Mon compte"
          className={
            "flex items-center gap-2 h-11 rounded-full border-[1.5px] border-white/35 text-white hover:bg-white/12 transition-colors " + RING +
            (phone ? " w-11 justify-center" : " pl-1 pr-1 lg:pr-4")
          }
        >
          <span className={(phone ? "w-8 h-8" : "w-9 h-9") + " rounded-full bg-[#E8B84D] text-forest-dark font-semibold text-sm flex items-center justify-center"}>
            {userInitial}
          </span>
          {!phone && <span className="hidden lg:inline text-sm font-medium">Mon compte</span>}
        </button>
        {accountMenu && (
          <div role="menu" className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-lg p-2 text-forest-dark">
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
    );
  };

  return (
    <>
      {/* ═══ BARRE DU HAUT ═══════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50 bg-forest-dark shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <nav aria-label="Navigation principale" className="max-w-7xl mx-auto h-[60px] md:h-[76px] px-4 md:px-6 lg:px-8 flex items-center">
          {/* Logo */}
          <Link href="/" aria-label="Kessel Agritech, accueil" className="flex items-center gap-2.5 shrink-0 min-w-0">
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
                    "knav-tab group relative flex items-center h-11 min-w-11 px-3 rounded-full transition-colors duration-150 " + RING + " " +
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
            {account(false)}
          </div>

          {/* Téléphone : compte + bouton « Menu », en haut à droite */}
          <div className="md:hidden ml-auto flex items-center gap-2 pl-2">
            {account(true)}
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => { setMenu((v) => !v); setAccountMenu(false); }}
              aria-expanded={menu}
              aria-controls="kessel-menu-mobile"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              className={"w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors " + RING + (menu ? " bg-white/15" : " hover:bg-white/12")}
            >
              <Icon name={menu ? "x" : "menu"} />
            </button>
          </div>
        </nav>
      </header>

      {/* ═══ TÉLÉPHONE : NAVIGATION DÉPLOYÉE ═════════════════════════════ */}
      {menu && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 z-40">
          <button type="button" tabIndex={-1} aria-label="Fermer le menu" onClick={() => setMenu(false)} className="absolute inset-0 w-full h-full bg-[rgba(15,40,24,0.45)]" />
          <nav
            id="kessel-menu-mobile"
            aria-label="Navigation principale (mobile)"
            className="kmenu-panel relative bg-white rounded-b-2xl shadow-lg p-3 max-h-full overflow-y-auto overscroll-contain"
          >
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onClick={() => setMenu(false)}
                  aria-current={active ? "page" : undefined}
                  className={
                    "flex items-center gap-3.5 min-h-[52px] px-4 rounded-xl text-base font-medium " +
                    (active ? "bg-forest-light text-forest-dark font-semibold" : "text-forest-dark hover:bg-forest-light")
                  }
                >
                  <Icon name={tab.icon} />
                  {tab.label}
                  {tab.soon && <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-light text-amber-dark text-xs font-semibold">Bientôt</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
