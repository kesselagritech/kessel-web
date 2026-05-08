"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const APK_URL = "https://github.com/kesselagritech/kessel-releases/releases/latest/download/kessel.apk";

export default function InstallationAndroidPage() {
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  useEffect(() => {
    const link = document.createElement("a");
    link.href = APK_URL;
    link.download = "kessel.apk";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadTriggered(true);
  }, []);

  const relaunchDownload = () => {
    const link = document.createElement("a");
    link.href = APK_URL;
    link.download = "kessel.apk";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-forest-dark text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Badge plateforme */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber/20 text-amber-light px-4 py-2 rounded-full text-sm font-semibold border border-amber/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 12.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM17 7.5l1.4-2.4a.3.3 0 0 0-.5-.3L16.5 7.2A8 8 0 0 0 12 6a8 8 0 0 0-4.5 1.2L6.1 4.8a.3.3 0 1 0-.5.3L7 7.5A7 7 0 0 0 4 13h16a7 7 0 0 0-3-5.5z"/>
            </svg>
            Pour téléphones Android uniquement
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--serif)" }}>
            Téléchargement <em className="text-amber-light">en cours...</em>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            L&apos;application Kessel s&apos;installe sur votre téléphone. Suivez les 3 étapes ci-dessous une fois le fichier téléchargé.
          </p>

          {downloadTriggered && (
            <button
              onClick={relaunchDownload}
              className="mt-6 text-amber-light underline hover:text-amber text-sm"
            >
              Le téléchargement n&apos;a pas démarré ? Cliquez ici pour relancer
            </button>
          )}
        </div>

        {/* Étapes */}
        <div className="space-y-6">

          {/* Étape 1 */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber text-white font-bold flex items-center justify-center">1</div>
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--serif)" }}>
                Ouvrez le fichier téléchargé
              </h2>
            </div>
            <p className="text-white/70 mb-6 text-center">
              Une fois le téléchargement terminé, une notification apparaît en haut de votre écran : <strong className="text-white">kessel.apk – Ouvrir</strong>. Touchez-la.
            </p>
            <div className="bg-white/5 rounded-lg aspect-[9/16] max-w-[180px] mx-auto flex items-center justify-center text-white/30 text-xs border border-white/10">
              Capture à venir
            </div>
          </div>

          {/* Étape 2 */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber text-white font-bold flex items-center justify-center">2</div>
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--serif)" }}>
                Autorisez l&apos;installation
              </h2>
            </div>
            <p className="text-white/70 mb-3 text-center">
              Votre téléphone affichera : <em>«&nbsp;Pour votre sécurité, votre téléphone n&apos;est pas autorisé à installer des applications inconnues de cette source&nbsp;»</em>.
            </p>
            <p className="text-white/70 mb-6 text-center">
              Touchez <strong className="text-amber-light">Paramètres</strong>, puis activez l&apos;option <strong className="text-amber-light">Autoriser cette source</strong>. Revenez ensuite à l&apos;installation.
            </p>
            <div className="bg-white/5 rounded-lg aspect-[9/16] max-w-[180px] mx-auto flex items-center justify-center text-white/30 text-xs border border-white/10">
              Capture à venir
            </div>
          </div>

          {/* Étape 3 */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber text-white font-bold flex items-center justify-center">3</div>
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--serif)" }}>
                Installez l&apos;application
              </h2>
            </div>
            <p className="text-white/70 mb-6 text-center">
              Touchez <strong className="text-amber-light">Installer</strong>. L&apos;icône Kessel apparaît sur votre écran d&apos;accueil en quelques secondes. Vous pouvez l&apos;ouvrir et créer votre compte.
            </p>
            <div className="bg-white/5 rounded-lg aspect-[9/16] max-w-[180px] mx-auto flex items-center justify-center text-white/30 text-xs border border-white/10">
              Capture à venir
            </div>
          </div>

        </div>

        {/* Bloc support WhatsApp */}
        <div className="mt-12 bg-amber/10 border border-amber/30 rounded-2xl p-6 text-center">
          <p className="text-white/80 text-sm mb-2">
            Vous bloquez à une étape ?
          </p>
          <p className="text-white/60 text-sm mb-3">
            Contactez-nous sur WhatsApp, nous vous guidons en direct.
          </p>
          <a
            href="https://wa.me/237659374501"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-light font-semibold hover:text-amber"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6 0-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6 0 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.6-.4M12 21.8c-1.7 0-3.3-.4-4.7-1.3l-3.3.9.9-3.2c-1-1.4-1.5-3.1-1.5-4.8C3.4 8.7 7.2 4.9 12 4.9c4.8 0 8.6 3.8 8.6 8.6.1 4.7-3.8 8.3-8.6 8.3M12 3C7.2 3 3 7.2 3 12c0 1.8.5 3.6 1.5 5.1L3 22l5-1.3c1.4.8 3 1.2 4.7 1.2h.3c5 0 9-4.1 9-9.1 0-2.4-1-4.7-2.7-6.4S14.4 3 12 3"/>
            </svg>
            +237 659 374 501
          </a>
        </div>

        {/* Lien retour */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-white/50 hover:text-white text-sm">
            ← Retour à l&apos;accueil
          </Link>
        </div>

      </div>
    </main>
  );
}
