// app/videos/page.tsx — [nav-v2b] Vidéothèque (bientôt disponible)
import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Vidéos — bientôt disponible | Kessel Agritech",
  description: "Tutoriels vidéo gratuits, tournés sur le terrain africain. Bientôt sur Kessel Agritech.",
  alternates: { canonical: "/videos" },
  robots: { index: false, follow: true },
};

export default function VideosPage() {
  return (
    <ComingSoon
      heroImage="/images/video-hero.jpg"
      kicker="Vidéothèque"
      title="Des tutoriels tournés"
      accent="sur le terrain."
      text="Des vidéos gratuites et concrètes, filmées dans de vraies exploitations africaines, pour voir les bons gestes avant de se lancer."
      points={[
        "Tutoriels gratuits, courts et concrets.",
        "Tournés sur le terrain africain, pas en studio.",
        "Chaque vidéo renvoie vers la fiche technique et le business plan de la même culture.",
        "Lecture directement sur le site, sans publicité.",
      ]}
    />
  );
}
