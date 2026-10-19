"use client";
// app/mentions-legales/page.tsx — Mentions légales v2.0 — [legal-v2]

import Link from "next/link";
import { LegalShell, Section, P, A, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;

export default function MentionsLegalesPage() {
  return (
    <LegalShell
      title="Mentions"
      accent="légales."
      meta="Version 2.1 · 19 octobre 2026"
      footerNote="Dernière mise à jour : 12 octobre 2026"
    >
      <Section title="1. Éditeur">
        <P>
          Le site <strong>kesselagritech.com</strong> et l&apos;application mobile <strong>Kessel</strong> sont édités par :
        </P>
        <EditorBox />
        <P last>Directeur de la publication : {EDITOR.owner}.</P>
      </Section>

      <Section title="2. Hébergement">
        <Box>
          <p className="text-forest-dark">
            <strong>Vercel Inc.</strong> — hébergement du site
          </p>
          <p className="text-ink-mid">340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis · vercel.com</p>
        </Box>
        <Box>
          <p className="text-forest-dark">
            <strong>Supabase Inc.</strong> — base de données, comptes et fichiers
          </p>
          <p className="text-ink-mid">Serveurs situés aux États-Unis (Oregon) · supabase.com</p>
        </Box>
        <P last>
          Les paiements de la bibliothèque sont traités par <strong>NOKASH</strong> (Mobile Money et carte bancaire), au Cameroun. La liste complète de nos
          prestataires figure dans la{" "}
          <Link href="/confidentialite" className="text-amber hover:underline">Politique de confidentialité</Link>.
        </P>
      </Section>

      <Section title="3. Propriété intellectuelle">
        <P last>
          L&apos;ensemble des contenus du site et de l&apos;application (textes, documents de la bibliothèque, images, logos,
          icônes, logiciels, bases de données) est protégé par le droit d&apos;auteur et le droit des marques, notamment la loi
          camerounaise n° 2000/011 du 19 décembre 2000 relative au droit d&apos;auteur et aux droits voisins. Toute reproduction ou
          exploitation non autorisée est interdite.
        </P>
      </Section>

      <Section title="4. Conditions applicables">
        <P last>
          L&apos;utilisation du Service est régie par les{" "}
          <Link href="/cgu" className="text-amber hover:underline">Conditions générales d&apos;utilisation</Link>, les achats par
          les <Link href="/cgv" className="text-amber hover:underline">Conditions générales de vente</Link>, et le traitement des
          données par la{" "}
          <Link href="/confidentialite" className="text-amber hover:underline">Politique de confidentialité</Link>.
        </P>
      </Section>

      <Section title="5. Responsabilité">
        <P last>
          Kessel Agritech veille à l&apos;exactitude des informations publiées, sans pouvoir garantir leur exhaustivité ni leur
          actualité permanente. Les contenus sont éducatifs et ne remplacent pas l&apos;avis d&apos;un professionnel.
        </P>
      </Section>

      <Section title="6. Contact">
        <P last>Pour toute question : {MAIL}.</P>
      </Section>
    </LegalShell>
  );
}
