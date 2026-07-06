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
