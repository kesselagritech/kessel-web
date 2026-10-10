import { FileText, BookOpen, GraduationCap } from "lucide-react";

// ─── Types partagés (serveur + client) ────────────────────────────────────────

export type DocType = "business_plan" | "fiche_technique" | "guide";

export const TYPE_CONFIG: Record<string, { label: string; icon: typeof FileText; accent: string }> = {
  business_plan:   { label: "Business Plan",   icon: FileText,      accent: "#BA7517" },
  fiche_technique: { label: "Fiche Technique", icon: BookOpen,      accent: "#2D4A35" },
  guide:           { label: "Guide Éducatif",  icon: GraduationCap, accent: "#185FA5" },
};

export interface DocumentDetail {
  id: string;
  title: string;
  slug: string;
  type: DocType;
  category_id: string | null;
  speculation: string | null;
  price: number;
  description: string | null;
  status: string;
  published_at: string | null;
  content_revised_at: string | null;
  document_categories: { name: string }[] | null;
}

export interface RelatedDoc {
  id: string;
  title: string;
  slug: string;
  type: DocType;
  speculation: string | null;
  description: string | null;
  price: number;
}

// Colonnes publiques de la vitrine — JAMAIS la colonne du contenu payant
export const DOC_PUBLIC_COLUMNS =
  "id, title, slug, type, category_id, speculation, price, description, status, published_at, content_revised_at, document_categories(name)";

export function formatDateFr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Douala",
  });
}
