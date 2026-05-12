"use client";

import { useState, useTransition } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  useScrollReveal();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus(null);
    startTransition(async () => {
      const res = await sendContactMessage(data);
      if (res.ok) {
        setStatus({ ok: true, msg: "Message envoye. Nous vous repondrons rapidement." });
        form.reset();
      } else {
        setStatus({ ok: false, msg: res.error || "Erreur inconnue." });
      }
    });
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Contact</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Parlons de<br /><em className="text-amber-light">votre projet.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-2xl mx-auto">
            Une question ? Un projet ? Contactez-nous par le canal qui vous convient le mieux.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Infos */}
            <div>
              <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Coordonnees</p>
              <h2 className="reveal reveal-delay-1 text-3xl font-bold text-forest-dark mb-8" style={{ fontFamily: "var(--serif)" }}>
                Nous sommes<br /><em>a votre ecoute.</em>
              </h2>

              <div className="space-y-6">
                <div className="reveal reveal-delay-2 flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-light rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-dark mb-1">Email</h3>
                    <a href="mailto:contact@kesselagritech.com" className="text-ink-mid hover:text-amber transition-colors">contact@kesselagritech.com</a>
                  </div>
                </div>

                <div className="reveal reveal-delay-3 flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-light rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-dark mb-1">WhatsApp</h3>
                    <a href="https://wa.me/237659374501" className="text-ink-mid hover:text-amber transition-colors">+237 659 374 501</a>
                    <p className="text-ink-light text-sm mt-1">Reponse rapide garantie</p>
                  </div>
                </div>

                <div className="reveal reveal-delay-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-light rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-dark mb-1">Adresse</h3>
                    <p className="text-ink-mid">Kribi, Region du Sud</p>
                    <p className="text-ink-light text-sm">Cameroun</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Formulaire */}
            <div className="reveal reveal-delay-2 bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-forest-dark mb-6" style={{ fontFamily: "var(--serif)" }}>Envoyez-nous un message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot anti-bot - cache aux humains */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-forest-dark mb-2">Nom complet</label>
                    <input name="nom" type="text" required maxLength={200} className="w-full px-4 py-3 rounded-xl border border-neutral-mid focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-dark mb-2">Telephone</label>
                    <input name="telephone" type="tel" maxLength={50} className="w-full px-4 py-3 rounded-xl border border-neutral-mid focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all" placeholder="+237 6XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-dark mb-2">Email</label>
                  <input name="email" type="email" required maxLength={200} className="w-full px-4 py-3 rounded-xl border border-neutral-mid focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all" placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-dark mb-2">Sujet</label>
                  <select name="sujet" className="w-full px-4 py-3 rounded-xl border border-neutral-mid focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all bg-white">
                    <option value="">Selectionnez un sujet</option>
                    <option value="question">Question generale</option>
                    <option value="demo">Demande de demonstration</option>
                    <option value="organisation">Offre Organisations</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-dark mb-2">Message</label>
                  <textarea name="message" required rows={5} maxLength={5000} className="w-full px-4 py-3 rounded-xl border border-neutral-mid focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all resize-none" placeholder="Decrivez votre demande..."></textarea>
                </div>

                {status && (
                  <div className={`p-4 rounded-xl text-sm ${status.ok ? "bg-forest-light text-forest-dark border border-forest/20" : "bg-brick-light text-brick border border-brick/20"}`}>
                    {status.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-amber hover:bg-amber-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  {isPending ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
