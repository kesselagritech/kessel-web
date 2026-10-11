import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kesselagritech.com"),
  title: "Kessel Agritech - Savoir et outils pour l'agriculture africaine",
  description:
    "Kessel accompagne les promoteurs de projets agricoles en Afrique : bibliothèque de guides, fiches techniques et business plans, comparateur de projets, et application de gestion de terrain.",
  keywords: [
    "agriculture",
    "agriculture africaine",
    "Afrique",
    "Cameroun",
    "gestion agricole",
    "promoteur",
    "technicien",
    "projet agricole",
  ],
  authors: [{ name: "Atine Mvom Philippe Andre" }],
  openGraph: {
    title: "Kessel Agritech - L'agriculture africaine mérite des outils à sa hauteur",
    description:
      "Guides, fiches techniques, business plans et comparateur de projets pour les promoteurs agricoles africains.",
    siteName: "Kessel Agritech",
    locale: "fr_CM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
