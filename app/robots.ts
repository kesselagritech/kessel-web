import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/connexion",
        "/mes-documents",
        "/mot-de-passe-oublie",
      ],
    },
    sitemap: "https://www.kesselagritech.com/sitemap.xml",
  };
}
