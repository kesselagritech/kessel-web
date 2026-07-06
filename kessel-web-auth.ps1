#Requires -Version 7.0
# ============================================================
# Kessel-web — Système de comptes web (Palier 0)
# 7 fichiers : 5 nouveaux + 2 remplacements
# ============================================================

$BaseDir = "C:\Users\user\Desktop\kessel-web"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ErrorCount = 0

function Write-Step { param([string]$Msg) Write-Host "`n=== $Msg ===" -ForegroundColor Cyan }
function Write-Ok { param([string]$Msg) Write-Host "[OK] $Msg" -ForegroundColor Green }
function Write-Skip { param([string]$Msg) Write-Host "[SKIP] $Msg" -ForegroundColor Yellow }
function Write-Err { param([string]$Msg) Write-Host "[ERROR] $Msg" -ForegroundColor Red; $script:ErrorCount++ }

# --- Vérification du répertoire ---
if (-not (Test-Path $BaseDir)) { Write-Err "Répertoire $BaseDir introuvable"; exit 1 }
Set-Location $BaseDir

# ============================================================
# 1. contexts/AuthContext.tsx (NOUVEAU)
# ============================================================
Write-Step "1/7 — contexts/AuthContext.tsx"
$dir = Join-Path $BaseDir "contexts"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$file = Join-Path $dir "AuthContext.tsx"

$content = @'
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    const needsConfirmation = !error && !!data.user && !data.session;
    return { error, needsConfirmation };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Créé : $file"

# ============================================================
# 2. components/Providers.tsx (NOUVEAU)
# ============================================================
Write-Step "2/7 — components/Providers.tsx"
$file = Join-Path $BaseDir "components" "Providers.tsx"

$content = @'
"use client";

import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Créé : $file"

# ============================================================
# 3. app/connexion/page.tsx (NOUVEAU)
# ============================================================
Write-Step "3/7 — app/connexion/page.tsx"
$dir = Join-Path $BaseDir "app" "connexion"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$file = Join-Path $dir "page.tsx"

$content = @'
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConnexionPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, loading, signIn, signUp } = useAuth();
  const router = useRouter();

  // Déjà connecté → bibliothèque
  useEffect(() => {
    if (user && !loading) router.replace("/bibliotheque");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    if (mode === "login") {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(
          err.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect."
            : err.message
        );
      } else {
        router.push("/bibliotheque");
      }
    } else {
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        setBusy(false);
        return;
      }
      const { error: err, needsConfirmation } = await signUp(email, password);
      if (err) {
        if (err.message?.includes("already registered")) {
          setError("Cette adresse est déjà utilisée. Connecte-toi ou réinitialise ton mot de passe.");
        } else {
          setError(err.message);
        }
      } else if (needsConfirmation) {
        setSuccess(
          "Un email de confirmation a été envoyé à " +
            email +
            ". Vérifie ta boîte de réception (et les spams)."
        );
      } else {
        router.push("/bibliotheque");
      }
    }
    setBusy(false);
  };

  // Pendant le chargement initial de l'auth
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-24">
          <p className="text-gray-400 animate-pulse">Chargement...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16"
        style={{
          background: "linear-gradient(135deg, #f8f7f4 0%, #eef2ef 100%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Titre */}
            <div className="text-center mb-8">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--serif)", color: "#2D4A35" }}
              >
                Kessel<span style={{ color: "#BA7517" }}> Agritech</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                {mode === "login"
                  ? "Connecte-toi à ton compte"
                  : "Crée ton compte gratuit"}
              </p>
            </div>

            {/* Toggle Connexion / Inscription */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className={
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all " +
                  (mode === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500")
                }
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
                className={
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all " +
                  (mode === "register"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500")
                }
              >
                Inscription
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Formulaire */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ton@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800/20 focus:border-green-800 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder={
                        mode === "register"
                          ? "6 caractères minimum"
                          : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800/20 focus:border-green-800 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {mode === "login" && (
                  <div className="text-right">
                    <Link
                      href="/mot-de-passe-oublie"
                      className="text-sm text-green-800 hover:text-green-900 underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 bg-[#2D4A35] hover:bg-[#1e3425] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {busy ? (
                    <span className="animate-pulse">Chargement...</span>
                  ) : (
                    <>
                      {mode === "login" ? "Se connecter" : "S\u0027inscrire"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Note de clarification */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Ce compte est réservé au site web kesselagritech.com.
            <br />
            Il est distinct de ton compte dans l&apos;application mobile Kessel.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Créé : $file"

# ============================================================
# 4. app/mot-de-passe-oublie/page.tsx (NOUVEAU)
# ============================================================
Write-Step "4/7 — app/mot-de-passe-oublie/page.tsx"
$dir = Join-Path $BaseDir "app" "mot-de-passe-oublie"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$file = Join-Path $dir "page.tsx"

$content = @'
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const { error: err } = await resetPassword(email);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setBusy(false);
  };

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16"
        style={{
          background: "linear-gradient(135deg, #f8f7f4 0%, #eef2ef 100%)",
        }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--serif)", color: "#2D4A35" }}
              >
                Mot de passe oublié
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                {sent
                  ? "Vérifie ta boîte mail."
                  : "Entre ton adresse email pour recevoir un lien de réinitialisation."}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {sent ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Si un compte existe avec l&apos;adresse <strong>{email}</strong>,
                  tu recevras un email avec un lien pour choisir un nouveau mot
                  de passe. Pense à vérifier tes spams.
                </p>
                <Link
                  href="/connexion"
                  className="inline-flex items-center gap-2 text-green-800 hover:text-green-900 font-medium text-sm"
                >
                  <ArrowLeft size={16} />
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ton@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800/20 focus:border-green-800 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 bg-[#2D4A35] hover:bg-[#1e3425] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {busy ? (
                    <span className="animate-pulse">Envoi...</span>
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href="/connexion"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft size={14} />
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Créé : $file"

# ============================================================
# 5. app/auth/callback/page.tsx (NOUVEAU)
# ============================================================
Write-Step "5/7 — app/auth/callback/page.tsx"
$dir = Join-Path $BaseDir "app" "auth" "callback"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$file = Join-Path $dir "page.tsx"

$content = @'
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase détecte automatiquement les tokens dans le hash de l'URL
    // (access_token, refresh_token) grâce à detectSessionInUrl: true (défaut)
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Petite temporisation pour laisser le state se propager via onAuthStateChange
      setTimeout(() => {
        router.replace(session ? "/bibliotheque" : "/connexion");
      }, 300);
    });
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#2D4A35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Vérification en cours...</p>
      </div>
    </main>
  );
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Créé : $file"

# ============================================================
# 6. app/layout.tsx (REMPLACEMENT avec backup)
# ============================================================
Write-Step "6/7 — app/layout.tsx (patch)"
$file = Join-Path $BaseDir "app" "layout.tsx"
$backup = "${file}.bak_${Timestamp}"

if (Test-Path $file) {
  Copy-Item $file $backup -Force
  Write-Ok "Backup : $backup"
} else {
  Write-Err "layout.tsx introuvable"
}

$content = @'
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Kessel - Gestion de projets agricoles | Cameroun",
  description:
    "Kessel accompagne les promoteurs de projets agricoles camerounais avec des outils de gestion professionnels : finances, taches, marches, techniciens.",
  keywords: [
    "agriculture",
    "Cameroun",
    "gestion agricole",
    "promoteur",
    "technicien",
    "projet agricole",
  ],
  authors: [{ name: "Atine Mvom Philippe Andre" }],
  openGraph: {
    title: "Kessel - Gestion de projets agricoles",
    description:
      "Application mobile de gestion de projets agricoles pour les promoteurs camerounais.",
    url: "https://kesselagritech.com",
    siteName: "Kessel Agritech",
    locale: "fr_CM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Remplacé : $file"

# ============================================================
# 7. components/Navbar.tsx (REMPLACEMENT avec backup)
# ============================================================
Write-Step "7/7 — components/Navbar.tsx (patch)"
$file = Join-Path $BaseDir "components" "Navbar.tsx"
$backup = "${file}.bak_${Timestamp}"

if (Test-Path $file) {
  Copy-Item $file $backup -Force
  Write-Ok "Backup : $backup"
} else {
  Write-Err "Navbar.tsx introuvable"
}

$content = @'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ========================================
// NAVBAR — coquille unique, logo unique
// + état de connexion (comptes web)
// ========================================
export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainLinks = [
    { href: "/application", label: "Application" },
    { href: "/bibliotheque", label: "Bibliothèque" },
    { href: "/comparateur", label: "Comparateur" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Initiale de l'utilisateur pour l'avatar
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo texte — unique, partout */}
          <Link href="/" className="flex items-center">
            <span
              className="font-bold text-2xl tracking-[0.02em]"
              style={{ fontFamily: "var(--serif)", color: "#2D4A35" }}
            >
              Kessel<span style={{ color: "#BA7517" }}> Agritech</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-forest-700 hover:text-forest-900 font-medium transition-colors"
              >
                <Home size={18} />
                Accueil
              </Link>
            )}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-forest-700 hover:text-forest-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="text-forest-700 hover:text-forest-900 font-medium transition-colors"
            >
              Contact
            </Link>

            {/* Auth — Desktop */}
            {!authLoading &&
              (user ? (
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: "#2D4A35" }}
                    title={user.email ?? ""}
                  >
                    {userInitial}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-forest-700 hover:text-forest-900 font-medium transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/connexion"
                  className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <LogIn size={18} />
                  Connexion
                </Link>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-forest-700"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-forest-100">
          <div className="px-4 py-4 space-y-1">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-3 py-3 text-forest-700 hover:text-forest-900 font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Home size={20} className="text-forest-400" />
                Accueil
              </Link>
            )}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-forest-700 hover:text-forest-900 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="block py-3 text-forest-700 hover:text-forest-900 font-medium border-t border-forest-100"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {/* Auth — Mobile */}
            <div className="pt-3 border-t border-forest-100">
              {!authLoading &&
                (user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: "#2D4A35" }}
                      >
                        {userInitial}
                      </div>
                      <span className="text-sm text-gray-600 truncate">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 w-full text-forest-700 hover:text-forest-900 font-semibold py-3 rounded-xl border border-forest-200 transition-colors"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/connexion"
                    className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold py-3 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={18} />
                    Connexion
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
'@

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Ok "Remplacé : $file"

# ============================================================
# Vérification TypeScript
# ============================================================
Write-Step "Vérification TypeScript"
$tscResult = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Ok "TypeScript : aucune erreur"
} else {
  Write-Err "TypeScript : erreurs détectées"
  $tscResult | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}

# ============================================================
# Résumé
# ============================================================
Write-Host "`n============================================" -ForegroundColor White
if ($ErrorCount -eq 0) {
  Write-Host "TERMINÉ — 7/7 fichiers OK, 0 erreur" -ForegroundColor Green
} else {
  Write-Host "TERMINÉ — $ErrorCount erreur(s) à corriger" -ForegroundColor Red
}
Write-Host "============================================`n" -ForegroundColor White
