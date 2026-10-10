import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

const BASE_URL = "https://www.kesselagritech.com";

// Le plan est régénéré au plus toutes les heures : un document publié
// apparaît donc dans le sitemap sans redéploiement.
export const revalidate = 3600;

// Pages publiques uniquement.
// Exclues volontairement : /connexion, /mes-documents, /mot-de-passe-oublie, /auth/callback
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  // Fiches publiées de la bibliothèque
  const { data, error } = await supabaseServer
    .from("documents")
    .select("slug, published_at, content_revised_at")
    .eq("status", "published");

  if (error) {
    // En cas d'échec, on publie quand même les pages fixes plutôt que rien
    console.error("sitemap documents:", error.message);
    return pages;
  }

  const docs: MetadataRoute.Sitemap = (data ?? []).map((d) => {
    const last = d.content_revised_at || d.published_at;
    return {
      url: `${BASE_URL}/bibliotheque/${d.slug}`,
      ...(last ? { lastModified: new Date(last) } : {}),
    };
  });

  return [...pages, ...docs];
}
