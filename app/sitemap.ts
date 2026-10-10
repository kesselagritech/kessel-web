import type { MetadataRoute } from "next";

const BASE_URL = "https://www.kesselagritech.com";

// Pages publiques uniquement.
// Exclues volontairement : /connexion, /mes-documents, /mot-de-passe-oublie, /auth/callback
// A faire plus tard : ajouter les documents /bibliotheque/[slug]
const routes = [
  "",
  "/a-propos",
  "/application",
  "/bibliotheque",
  "/comparateur",
  "/collaborateurs",
  "/guide",
  "/itk",
  "/speculations",
  "/zones",
  "/faq",
  "/contact",
  "/cgu",
  "/cgu/en",
  "/confidentialite",
  "/confidentialite/en",
  "/mentions-legales",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));
}
