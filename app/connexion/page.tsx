"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ConnexionContent() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, loading, signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect cible : paramètre ?redirect= ou /bibliotheque par défaut
  // Sécurité : uniquement les chemins internes (commence par /)
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = rawRedirect?.startsWith("/") ? rawRedirect : "/bibliotheque";

  // Déjà connecté → redirection
  useEffect(() => {
    if (user && !loading) router.replace(redirectTo);
  }, [user, loading, router, redirectTo]);

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
        router.push(redirectTo);
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
        router.push(redirectTo);
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

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionContent />
    </Suspense>
  );
}