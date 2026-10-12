"use client";
// app/cgu/page.tsx — Conditions générales d'utilisation v2.0 — [legal-v2]

import Link from "next/link";
import { LegalShell, Section, H3, P, A, List, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;
const CGV = <Link href="/cgv" className="text-amber hover:underline">Conditions générales de vente</Link>;

export default function CGUPage() {
  return (
    <LegalShell
      title="Conditions générales"
      accent="d'utilisation."
      meta={
        <>
          Version 2.0 · Publiée le 12 octobre 2026 ·{" "}
          <Link href="/cgu/en" className="underline hover:text-amber">English version</Link>
        </>
      }
      footerNote="Dernière mise à jour : 12 octobre 2026 · Version 2.0"
    >
      <div className="reveal">
        <P last>
          Les présentes Conditions générales d&apos;utilisation (« <strong>CGU</strong> ») régissent l&apos;utilisation du site{" "}
          <strong>kesselagritech.com</strong> et de l&apos;application mobile <strong>Kessel</strong> (ensemble, le «{" "}
          <strong>Service</strong> »), édités par Kessel Agritech. En utilisant le Service, vous (« <strong>Utilisateur</strong> »)
          acceptez les présentes CGU. Les achats de la bibliothèque relèvent en plus des {CGV}.
        </P>
      </div>

      <Section title="1. Éditeur">
        <EditorBox />
      </Section>

      <Section title="2. Le Service">
        <H3>2.1 Le site kesselagritech.com</H3>
        <P>Ouvert aux promoteurs et porteurs de projets agricoles de toute l&apos;Afrique, il propose :</P>
        <List
          items={[
            "Une bibliothèque payante de business plans, fiches techniques et guides éducatifs.",
            "Un comparateur de projets agricoles, gratuit.",
            "Des pages d'information gratuites (spéculations, zones agro-écologiques, guides, itinéraires techniques).",
            "Un espace collaborateur pour suivre en lecture seule l'exploitation d'un promoteur qui vous a transmis son code.",
          ]}
        />
        <H3>2.2 L&apos;application mobile Kessel</H3>
        <P>Conçue pour le Cameroun et gratuite, elle permet notamment :</P>
        <List
          items={[
            "La création et le suivi de projets agricoles et de leurs tâches.",
            "Les rapports de terrain avec photos géolocalisées.",
            "Le suivi financier des projets (dépenses, revenus, récoltes).",
            "L'invitation de techniciens agricoles sur vos projets.",
            "L'accompagnement par des superviseurs Kessel : messagerie et cahiers des charges.",
            "La consultation de prix de marché indicatifs, des rappels et des alertes.",
          ]}
        />
        <Box tone="amber">
          <p className="text-forest-dark font-semibold">Règle d&apos;usage : « Kessel aide, ne prescrit pas »</p>
          <p className="text-ink-mid text-sm">
            L&apos;application, le comparateur et les documents de la bibliothèque fournissent des informations, des outils et
            des estimations. Ils ne remplacent pas l&apos;avis d&apos;un technicien, d&apos;un agronome ou d&apos;un conseiller
            financier. Les décisions agricoles et d&apos;investissement relèvent de la seule responsabilité de l&apos;Utilisateur.
          </p>
        </Box>
      </Section>

      <Section title="3. Accès et comptes">
        <H3>3.1 Âge</H3>
        <P>La création d&apos;un compte et les achats sont réservés aux personnes de 18 ans et plus.</P>
        <H3>3.2 Deux comptes distincts</H3>
        <List
          items={[
            "Compte de l'application : numéro de téléphone et code PIN.",
            "Compte du site : adresse e-mail et mot de passe. Il donne accès à vos achats et à l'espace collaborateur.",
          ]}
        />
        <P>
          Vous fournissez des informations exactes et gardez vos identifiants secrets. Toute action faite avec vos identifiants
          est réputée faite par vous.
        </P>
        <H3>3.3 Appareils compatibles (application)</H3>
        <List
          items={[
            "Android 7.0 minimum ou iPhone sous iOS 15 minimum.",
            "Connexion internet pour synchroniser ; la plupart des fonctions marchent hors connexion.",
            "200 Mo d'espace libre.",
          ]}
        />
      </Section>

      <Section title="4. Ce qui est gratuit, ce qui est payant">
        <P>
          L&apos;application, le comparateur, les pages d&apos;information et l&apos;espace collaborateur sont gratuits. Les
          documents de la bibliothèque sont payants, à l&apos;unité. En résumé :
        </P>
        <List
          items={[
            "Le prix est affiché en FCFA sur chaque fiche, avant paiement.",
            "Le paiement se fait via CamPay : Mobile Money (MTN, Orange) et, lorsqu'elle est proposée, carte bancaire.",
            "Le document se lit en ligne depuis votre compte du site, mises à jour comprises.",
            "Pas de remboursement une fois le document accessible, sauf double paiement, paiement sans accès ou document non conforme.",
            "Usage personnel ou professionnel interne uniquement : ni revente, ni partage, ni diffusion.",
          ]}
        />
        <P>Le détail figure dans les {CGV}, qui prévalent en cas de contradiction.</P>
        <P last>
          Une formule « Kessel Team » pour les organisations est à l&apos;étude. Elle n&apos;est pas active. Aucun prélèvement ne
          peut avoir lieu sans une action explicite de votre part.
        </P>
      </Section>

      <Section title="5. Vos engagements">
        <P>Vous vous engagez à ne pas :</P>
        <List
          variant="cross"
          items={[
            "Enfreindre la loi, notamment la loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité.",
            "Utiliser le Service de manière frauduleuse ou contraire aux bonnes mœurs.",
            "Contourner les mesures de sécurité, décompiler le code ou surcharger les serveurs.",
            "Usurper l'identité d'un autre utilisateur ou partager vos comptes.",
            "Copier, revendre ou diffuser les documents achetés.",
            "Harceler ou tenir des propos discriminatoires envers un technicien, un superviseur ou un promoteur.",
            "Divulguer les données d'une exploitation consultée dans l'espace collaborateur sans l'accord du promoteur.",
            "Saisir des informations agricoles ou financières que vous savez fausses.",
          ]}
        />
      </Section>

      <Section title="6. Vos contenus">
        <P last>
          Vous restez propriétaire de ce que vous publiez (photos, rapports, données de projets). Vous nous accordez une licence
          non exclusive, mondiale et gratuite pour stocker, reproduire et afficher ces contenus, uniquement dans la mesure
          nécessaire au fonctionnement du Service. Vous garantissez détenir les droits sur ces contenus.
        </P>
      </Section>

      <Section title="7. Propriété intellectuelle">
        <P last>
          La marque Kessel, son logo (l&apos;hexagone et le « K »), le site, l&apos;application, leur code, leurs textes et les
          documents de la bibliothèque sont la propriété exclusive de Kessel Agritech. Toute reproduction ou exploitation non
          autorisée est interdite et peut donner lieu à des poursuites.
        </P>
      </Section>

      <Section title="8. Disponibilité">
        <P last>
          Nous visons une disponibilité continue, sans pouvoir la garantir. Le Service peut être interrompu pour maintenance,
          mise à jour ou force majeure.
        </P>
      </Section>

      <Section title="9. Limitation de responsabilité">
        <P>Le Service est fourni « en l&apos;état ». Nous ne garantissons pas :</P>
        <List
          items={[
            "L'exactitude absolue des informations (prix de marché, estimations, projections, rappels).",
            "L'absence totale d'erreurs ou d'interruptions.",
            "L'adéquation du Service à un usage autre que celui décrit.",
          ]}
        />
        <P last>
          Notre responsabilité est limitée aux sommes que vous nous avez versées au cours des 12 derniers mois. Nous ne
          répondons pas des dommages indirects (perte de récolte, manque à gagner, perte de données), sauf faute lourde ou
          disposition légale impérative contraire.
        </P>
      </Section>

      <Section title="10. Données personnelles">
        <P last>
          Vos données sont traitées selon notre{" "}
          <Link href="/confidentialite" className="text-amber hover:underline">Politique de confidentialité</Link>, qui fait partie
          des présentes CGU.
        </P>
      </Section>

      <Section title="11. Suppression des comptes">
        <H3>11.1 Compte de l&apos;application</H3>
        <List
          items={[
            "Vous pouvez le supprimer à tout moment depuis l'application (Paramètres → Supprimer mon compte) ou en écrivant à " +
              EDITOR.email +
              ".",
            "Votre compte et vos projets sont effacés dès la demande ; photos et copies de sauvegarde sous 30 jours au plus.",
            "Les données que vous avez saisies dans les projets d'autres utilisateurs y restent, sans votre nom.",
          ]}
        />
        <Box tone="amber">
          <p className="text-forest-dark font-semibold">Inactivité : suppression après 6 mois</p>
          <p className="text-ink-mid text-sm">
            Un compte de l&apos;application sans aucune connexion pendant 6 mois consécutifs est supprimé définitivement, avec
            ses projets. Une seule connexion remet le compteur à zéro. Cette règle s&apos;applique à partir du 12 novembre 2026.
          </p>
        </Box>
        <H3>11.2 Compte du site (bibliothèque)</H3>
        <P last>
          Il n&apos;est <strong>jamais supprimé pour inactivité</strong> : vos achats restent accessibles. Vous pouvez en demander la
          suppression à {MAIL} ; l&apos;accès aux documents achetés est alors définitivement perdu. Les pièces des achats sont
          conservées 10 ans, comme l&apos;exige la loi comptable.
        </P>
      </Section>

      <Section title="12. Suspension par Kessel">
        <P last>
          Nous pouvons suspendre ou fermer un compte en cas de manquement grave aux CGU ou aux CGV, de fraude ou de menace pour
          la sécurité du Service. Sauf urgence, nous vous prévenons avant.
        </P>
      </Section>

      <Section title="13. Modification des CGU">
        <P last>
          Tout changement important vous est annoncé au moins 30 jours à l&apos;avance : par notification dans
          l&apos;application, par e-mail pour les comptes du site, et sur cette page.
        </P>
      </Section>

      <Section title="14. Loi applicable et litiges">
        <P last>
          Les CGU sont régies par le droit camerounais. En cas de litige, une solution amiable est recherchée d&apos;abord. À
          défaut, les juridictions compétentes de Douala sont saisies, sauf règle impérative contraire.
        </P>
      </Section>

      <Section title="15. Contact">
        <Box>
          <p className="text-ink-mid">Email : {MAIL}</p>
          <p className="text-ink-mid">
            WhatsApp : <A href={EDITOR.wa}>{EDITOR.phone}</A>
          </p>
        </Box>
      </Section>
    </LegalShell>
  );
}
