"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sanitizeRedirect } from "@/lib/authHref";
import { CheckCircle, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Cible finale : ?redirect= valide, ou "/" (home) par defaut.
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"), "/");

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setConfirmed(true);
        setTimeout(() => router.replace(redirectTo), 2000);
      } else {
        router.replace("/connexion");
      }
    });
  }, [router, redirectTo]);

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
    } else {
      setDone(true);
      setTimeout(() => router.replace(redirectTo), 2000);
    }
    setBusy(false);
  };

  if (isRecovery) {
    return (
      <>
        <Navbar />
        <main
          className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16"
          style={{ background: "linear-gradient(135deg, #f8f7f4 0%, #eef2ef 100%)" }}
        >
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {done ? (
                <div className="text-center space-y-4">
                  <CheckCircle size={48} className="text-green-600 mx-auto" />
                  <p className="text-lg font-semibold" style={{ color: "#2D4A35" }}>
                    Mot de passe modifié !
                  </p>
                  <p className="text-gray-500 text-sm">Redirection...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--serif)", color: "#2D4A35" }}
                    >
                      Nouveau mot de passe
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                      Choisis ton nouveau mot de passe.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleNewPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nouveau mot de passe
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
                          placeholder="6 caractères minimum"
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
                        <span className="animate-pulse">Modification...</span>
                      ) : (
                        <>
                          Confirmer
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {confirmed ? (
          <>
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
            <p className="text-lg font-semibold" style={{ color: "#2D4A35" }}>
              Compte confirmé !
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Redirection...
            </p>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-[#2D4A35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Vérification en cours...</p>
          </>
        )}
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
