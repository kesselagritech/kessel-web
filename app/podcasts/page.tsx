// app/podcasts/page.tsx — [nav-v2b] Podcasts (bientôt disponible)
import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Podcasts — bientôt disponible | Kessel Agritech",
  description: "Des récits de terrain inspirants sur l'agriculture africaine. Bientôt sur Kessel Agritech.",
  alternates: { canonical: "/podcasts" },
  robots: { index: false, follow: true },
};

export default function PodcastsPage() {
  return (
    <ComingSoon
      heroImage="/images/podcast-hero.jpg"
      kicker="Podcasts"
      title="La réalité du terrain,"
      accent="racontée par ceux qui la vivent."
      text="Des épisodes audio avec des promoteurs, des techniciens et des professionnels actifs en Afrique : réussites, échecs et leçons que peu de gens montrent."
      points={[
        "Des témoignages de promoteurs et de techniciens.",
        "Les vrais chiffres, les vraies difficultés.",
        "Des fichiers légers, pensés pour les connexions mobiles.",
        "À écouter directement sur le site.",
      ]}
    />
  );
}
