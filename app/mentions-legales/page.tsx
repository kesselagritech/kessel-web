"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MentionsLegalesPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Legal</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Mentions<br /><em className="text-amber-light">legales.</em>
          </h1>
        </div>
      </section>

      {/* CONTENU */}
      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="prose prose-lg max-w-none">
              
              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Editeur du site</h2>
                <p className="text-ink-mid leading-relaxed mb-6">
                  Le site <strong>kesselagritech.com</strong> et l application mobile <strong>Kessel</strong> sont edites par :
                </p>
                <div className="bg-forest-light p-6 rounded-xl mb-8">
                  <p className="text-forest-dark"><strong>Kessel Agritech</strong></p>
                  <p className="text-ink-mid">Entreprise individuelle</p>
                  <p className="text-ink-mid">Fondateur : Atine Mvom Philippe Andre</p>
                  <p className="text-ink-mid">Siege social : Kribi, Region du Sud, Cameroun</p>
                  <p className="text-ink-mid">Email : contact@kesselagritech.com</p>
                  <p className="text-ink-mid">WhatsApp : +237 659 374 501</p>
                </div>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Hebergement</h2>
                <p className="text-ink-mid leading-relaxed mb-6">
                  Le site web est heberge par :
                </p>
                <div className="bg-forest-light p-6 rounded-xl mb-8">
                  <p className="text-forest-dark"><strong>Vercel Inc.</strong></p>
                  <p className="text-ink-mid">340 S Lemon Ave #4133</p>
                  <p className="text-ink-mid">Walnut, CA 91789, USA</p>
                  <p className="text-ink-mid">Site : vercel.com</p>
                </div>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Les donnees de l application sont hebergees par <strong>Supabase Inc.</strong> sur des serveurs securises.
                </p>
              </div>

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Propriete intellectuelle</h2>
                <p className="text-ink-mid leading-relaxed mb-6">
                  L ensemble du contenu du site et de l application Kessel (textes, images, logos, icones, logiciels, bases de donnees) est protege par le droit d auteur et le droit des marques.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Toute reproduction, representation, modification ou exploitation non autorisee est interdite et constitue une contrefacon sanctionnee par le Code de la propriete intellectuelle.
                </p>
              </div>

              <div className="reveal reveal-delay-3">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Donnees personnelles</h2>
                <p className="text-ink-mid leading-relaxed mb-6">
                  Les informations concernant la collecte et le traitement des donnees personnelles sont detaillees dans notre <a href="/confidentialite" className="text-amber hover:underline">Politique de confidentialite</a>.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Conformement a la legislation en vigueur, vous disposez d un droit d acces, de rectification et de suppression des donnees vous concernant.
                </p>
              </div>

              <div className="reveal reveal-delay-4">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Responsabilite</h2>
                <p className="text-ink-mid leading-relaxed mb-6">
                  Kessel Agritech s efforce d assurer l exactitude des informations diffusees sur le site et l application. Toutefois, nous ne pouvons garantir l exactitude, la completude ou l actualite des informations.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  L utilisation des informations et contenus disponibles sur le site ou l application se fait sous la seule responsabilite de l utilisateur.
                </p>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Contact</h2>
                <p className="text-ink-mid leading-relaxed">
                  Pour toute question concernant ces mentions legales, vous pouvez nous contacter a l adresse <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a>.
                </p>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-neutral-mid text-center">
              <p className="text-ink-light text-sm">Derniere mise a jour : Avril 2026</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}