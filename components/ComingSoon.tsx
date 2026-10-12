// components/ComingSoon.tsx — [nav-v2] Page « bientôt disponible » (vidéos, podcasts)
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ComingSoon({
  kicker,
  title,
  accent,
  text,
  points,
}: {
  kicker: string;
  title: string;
  accent: string;
  text: string;
  points: string[];
}) {
  return (
    <>
      <Navbar />
      <section className="bg-forest-dark pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block mb-5 px-3 py-1 rounded-full bg-amber-light text-amber-dark text-xs font-semibold uppercase tracking-wider">
            Bientôt disponible
          </span>
          <p className="text-amber font-semibold text-sm uppercase tracking-wider mb-3">{kicker}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            {title}
            <br />
            <em className="text-amber-light">{accent}</em>
          </h1>
          <p className="text-lg text-white/75 leading-relaxed">{text}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <ul className="grid gap-4 sm:grid-cols-2 mb-12">
            {points.map((p) => (
              <li key={p} className="bg-white rounded-xl p-5 shadow-sm text-ink-mid leading-relaxed">
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bibliotheque"
              className="inline-flex items-center justify-center bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Explorer la bibliothèque
            </Link>
            <a
              href="https://wa.me/237659374501?text=Bonjour%20Kessel%2C%20pr%C3%A9venez-moi%20de%20la%20sortie%20des%20contenus."
              className="inline-flex items-center justify-center border-2 border-forest text-forest hover:bg-forest-light font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Être prévenu sur WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
