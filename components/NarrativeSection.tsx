"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function NarrativeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    let rafId = 0;
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = containerRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  // MOBILE / SSR : 2 sections empilées avec photo entière
  if (isDesktop === null || !isDesktop) {
    return (
      <section className="relative bg-forest-dark py-16 px-6 overflow-hidden">
        <svg
          className="absolute -right-[15%] -top-[5%] w-[60%] opacity-[0.04] pointer-events-none"
          viewBox="0 0 600 600"
        >
          <polygon
            points="300,20 560,150 560,450 300,580 40,450 40,150"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="relative max-w-2xl mx-auto">
          {/* Photo entière mobile - 16/10 */}
          <div className="reveal relative aspect-[16/10] rounded-2xl overflow-hidden mb-12 shadow-2xl ring-1 ring-white/10">
            <Image
              src="/images/hero-bg.png"
              alt="Promoteur agricole et techniciens"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
              quality={90}
            />
          </div>

          <div className="mb-12 pb-12 border-b border-white/10">
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">
              Pour vous
            </p>
            <h2
              className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--serif)" }}
            >
              Le promoteur, <em className="text-amber-light">au pilotage.</em>
            </h2>
            <p className="reveal reveal-delay-2 text-white/80 leading-relaxed">
              Que vous soyez à Yaoundé, Douala ou en déplacement, Kessel vous donne une vue claire de vos finances, vos tâches et l&apos;avancement réel de votre exploitation — sans avoir besoin de vous y rendre chaque jour.
            </p>
          </div>

          <div>
            <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">
              Pour vos techniciens
            </p>
            <h2
              className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--serif)" }}
            >
              Le terrain, <em className="text-amber-light">connecté.</em>
            </h2>
            <p className="reveal reveal-delay-2 text-white/80 leading-relaxed">
              Votre technicien sur place remonte directement depuis son téléphone : observations, photos, dépenses, tâches accomplies. Plus de rapports perdus, plus de visites oubliées, plus de retards d&apos;information.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // DESKTOP — cadre quasi-carré qui révèle moitié de la photo selon scroll
  const opacity1 = Math.max(0, Math.min(1, (0.4 - progress) * 5));
  const opacity2 = Math.max(0, Math.min(1, (progress - 0.6) * 5));
  const photoOffset = (0.5 - progress) * 50; // +25vw (droite) à -25vw (gauche)
  const objectPosX = progress * 100; // 0% (gauche photo) à 100% (droite photo)

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-forest-dark">
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        {/* Hexagones décoratifs subtils */}
        <svg
          className="absolute -right-[6%] -top-[8%] w-[40%] opacity-[0.04] pointer-events-none"
          viewBox="0 0 600 600"
        >
          <polygon
            points="300,20 560,150 560,450 300,580 40,450 40,150"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <svg
          className="absolute -left-[6%] -bottom-[8%] w-[35%] opacity-[0.04] pointer-events-none"
          viewBox="0 0 600 600"
        >
          <polygon
            points="300,20 560,150 560,450 300,580 40,450 40,150"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        {/* CADRE PHOTO ratio 8/9 — révèle ~50% de la photo */}
        <div
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{
            height: "78vh",
            width: "calc(78vh * 8 / 9)",
            transform: `translate(calc(-50% + ${photoOffset}vw), -50%)`,
          }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15">
            <Image
              src="/images/hero-bg.png"
              alt="Promoteur agricole et techniciens"
              fill
              sizes="50vh"
              priority
              quality={95}
              style={{
                objectFit: "cover",
                objectPosition: `${objectPosX}% center`,
              }}
            />
            {/* Léger gradient pour profondeur */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* TEXTE PROMOTEUR — gauche, visible 0-40% */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-[6vw] max-w-md transition-opacity duration-300"
          style={{ opacity: opacity1, pointerEvents: opacity1 > 0.5 ? "auto" : "none" }}
        >
          <p className="text-amber font-semibold text-sm uppercase tracking-wider mb-3">
            Pour vous
          </p>
          <h2
            className="text-3xl xl:text-4xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--serif)" }}
          >
            Le promoteur, <em className="text-amber-light">au pilotage.</em>
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Que vous soyez à Yaoundé, Douala ou en déplacement, Kessel vous donne une vue claire de vos finances, vos tâches et l&apos;avancement réel de votre exploitation — sans avoir besoin de vous y rendre chaque jour.
          </p>
        </div>

        {/* TEXTE TECHNICIEN — droite, visible 60-100% */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-[6vw] max-w-md transition-opacity duration-300"
          style={{ opacity: opacity2, pointerEvents: opacity2 > 0.5 ? "auto" : "none" }}
        >
          <p className="text-amber font-semibold text-sm uppercase tracking-wider mb-3">
            Pour vos techniciens
          </p>
          <h2
            className="text-3xl xl:text-4xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--serif)" }}
          >
            Le terrain, <em className="text-amber-light">connecté.</em>
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Votre technicien sur place remonte directement depuis son téléphone : observations, photos, dépenses, tâches accomplies. Plus de rapports perdus, plus de visites oubliées, plus de retards d&apos;information.
          </p>
        </div>

        {/* INDICATEUR PROGRESSION */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <div
            className={`h-1 rounded-full transition-all duration-500 ${
              progress > 0.5 ? "w-8 bg-white/40" : "w-14 bg-amber"
            }`}
          />
          <div
            className={`h-1 rounded-full transition-all duration-500 ${
              progress > 0.5 ? "w-14 bg-amber" : "w-8 bg-white/40"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
