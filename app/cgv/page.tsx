"use client";
// app/cgv/page.tsx — Conditions générales de vente (bibliothèque) v1.2 — [legal-v2] [nokash-v1]

import Link from "next/link";
import { LegalShell, Section, H3, P, A, List, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;

export default function CGVPage() {
  return (
    <LegalShell
      title="Conditions générales"
      accent="de vente."
      meta={
        <>
          Version 1.2 · En vigueur le 19 octobre 2026 ·{" "}
          <Link href="/cgv/en" className="underline hover:text-amber">English version</Link>
        </>
      }
      footerNote="Dernière mise à jour : 19 octobre 2026 · Version 1.2"
    >
      <div className="reveal">
        <P last>
          Les présentes Conditions générales de vente (« <strong>CGV</strong> ») s&apos;appliquent à tout achat de document de la{" "}
          <strong>bibliothèque Kessel</strong> sur kesselagritech.com. Cliquer sur « Acheter » (ou sur le bouton du moyen de paiement choisi) vaut acceptation des CGV en vigueur
          à ce moment. Elles complètent les{" "}
          <Link href="/cgu" className="text-amber hover:underline">Conditions générales d&apos;utilisation</Link> et la{" "}
          <Link href="/confidentialite" className="text-amber hover:underline">Politique de confidentialité</Link>.
        </P>
      </div>

      <Section title="1. Vendeur">
        <EditorBox />
      </Section>

      <Section title="2. Ce que vous achetez">
        <P>
          La bibliothèque propose des documents numériques à vocation éducative : <strong>business plans</strong>,{" "}
          <strong>fiches techniques</strong> (itinéraires techniques) et <strong>guides éducatifs</strong>. Chaque fiche présente,
          avant achat, son titre, sa description, son prix et sa date de dernière mise à jour.
        </P>
        <P last>
          Un document acheté se lit <strong>en ligne, sur le site</strong>, depuis votre compte. Aucun fichier n&apos;est
          téléchargé ni envoyé par e-mail, et aucun bien physique n&apos;est livré.
        </P>
      </Section>

      <Section title="3. Prix">
        <List
          items={[
            "Les prix sont indiqués en francs CFA (FCFA) sur chaque fiche, avant tout paiement.",
            "Le prix payé est celui affiché au moment où vous cliquez sur « Acheter » (ou sur le bouton du moyen de paiement choisi). Kessel n'ajoute aucun frais.",
            "Le paiement est facturé en FCFA, y compris par carte bancaire. Les frais éventuels de votre opérateur Mobile Money ou de votre banque, dont les frais de change pour une carte émise hors zone FCFA, ne dépendent pas de Kessel.",
            "Kessel peut modifier ses prix à tout moment ; un changement ne s'applique jamais à un achat déjà payé.",
          ]}
        />
      </Section>

      <Section title="4. Commande et paiement">
        <List
          items={[
            "Un compte du site (adresse e-mail et mot de passe) est nécessaire. Il est distinct de votre compte de l'application mobile.",
            "Le paiement se fait sur la page sécurisée de notre prestataire de paiement NOKASH, par Mobile Money (Orange Money, MTN Mobile Money) ou par carte bancaire (Visa, Mastercard). Kessel ne reçoit ni ne conserve jamais les données de votre carte.",
            "L'achat n'est validé qu'après confirmation du paiement par NOKASH, vérifiée par nos serveurs. Un simple retour sur le site ne suffit pas.",
            "Avec le Mobile Money, la confirmation peut arriver avec retard si la transaction est validée plus tard sur votre téléphone : le document se débloque alors automatiquement.",
          ]}
        />
        <Box tone="amber">
          <p className="text-forest-dark font-semibold">Votre compte a été débité mais le document reste verrouillé ?</p>
          <p className="text-ink-mid text-sm">
            Écrivez à {MAIL} ou sur WhatsApp au {EDITOR.phone} en indiquant l&apos;adresse e-mail de votre compte, le document,
            la date et la référence de la transaction (reçue par SMS ou par e-mail). Nous vérifions auprès de NOKASH et débloquons le document ou
            vous remboursons.
          </p>
        </Box>
      </Section>

      <Section title="5. Livraison et accès au document">
        <List
          items={[
            "Délai de livraison : l'accès est ouvert immédiatement dès la confirmation du paiement, dans l'espace « Mes achats ».",
            "Modalité : lecture en ligne sur le site, depuis votre compte, sur ordinateur ou téléphone.",
            "L'accès est personnel et lié à votre compte. Il dure aussi longtemps que votre compte existe et que la bibliothèque est exploitée.",
            "Les mises à jour d'un document acheté sont incluses, sans frais supplémentaires.",
            "Votre compte du site n'est jamais supprimé pour inactivité. Si vous demandez sa suppression, l'accès à vos achats est définitivement perdu.",
            "Si Kessel devait cesser d'exploiter la bibliothèque, vous seriez prévenu par e-mail au moins 30 jours à l'avance.",
          ]}
        />
      </Section>

      <Section title="6. Annulation, rétractation et remboursement">
        <H3>6.1 Annulation avant paiement</H3>
        <P>
          Tant que le paiement n&apos;est pas confirmé, vous pouvez abandonner l&apos;achat sans frais : fermez la page de paiement
          ou ne validez pas la transaction sur votre téléphone. Aucun montant n&apos;est alors débité et aucun achat n&apos;est enregistré.
        </P>
        <H3>6.2 Pas de rétractation après l&apos;accès</H3>
        <P>
          Le document est un contenu numérique fourni immédiatement, à votre demande, dès le paiement confirmé. En cliquant sur
          « Acheter » (ou sur le bouton du moyen de paiement choisi), vous demandez cet accès immédiat : <strong>aucun remboursement n&apos;est dû une fois le document
          accessible</strong>, sauf dans les cas prévus au point 6.3.
        </P>
        <H3>6.3 Cas de remboursement</H3>
        <List
          items={[
            "Double paiement pour le même document.",
            "Paiement débité sans que le document soit débloqué, sans solution dans les 7 jours suivant votre réclamation.",
            "Document retiré de la bibliothèque, illisible, ou manifestement différent de sa description.",
            "Paiement par carte effectué sans l'autorisation du titulaire de la carte (point 6.5).",
          ]}
        />
        <H3>6.4 Procédure</H3>
        <P>
          La demande se fait à {MAIL} dans les 30 jours suivant l&apos;achat, avec l&apos;adresse e-mail du compte, le document,
          la date et la référence de la transaction. Un remboursement accepté est versé sous 14 jours, par le moyen de paiement
          utilisé (carte ou compte Mobile Money débité), via NOKASH. L&apos;accès au document remboursé est alors retiré du compte.
        </P>
        <H3>6.5 Paiement contesté ou frauduleux</H3>
        <P last>
          Si le titulaire d&apos;une carte ou d&apos;un compte Mobile Money signale un paiement qu&apos;il n&apos;a pas autorisé,
          Kessel suspend sans délai l&apos;accès au document concerné, vérifie la transaction avec NOKASH, rembourse le paiement
          reconnu frauduleux et peut bloquer le compte utilisé. Kessel conserve les éléments de preuve de l&apos;achat (date,
          compte, référence de transaction, accès au document) et les transmet à NOKASH en cas de contestation.
        </P>
      </Section>

      <Section title="7. Ce que vous pouvez faire du document">
        <P>Vous pouvez lire le document et l&apos;utiliser pour votre propre projet ou votre activité professionnelle.</P>
        <List
          variant="cross"
          items={[
            "Revendre, louer ou diffuser le document, en tout ou en partie.",
            "Partager votre compte ou vos identifiants.",
            "Copier, imprimer en série, capturer ou republier le contenu sur un autre support, site ou réseau social.",
            "Extraire le contenu de manière automatisée.",
          ]}
        />
        <P last>
          Citer un court extrait en mentionnant « Kessel Agritech » comme source est autorisé. Les documents restent la propriété
          exclusive de Kessel Agritech.
        </P>
      </Section>

      <Section title="8. Nature des contenus et responsabilité">
        <H3>8.1 Des documents éducatifs, pas une garantie de résultat</H3>
        <P>
          Rendements, prix, coûts, marges et projections financières sont des estimations établies à la date du document, à partir
          de sources signalées. Ils varient selon le terrain, le climat, le marché et la conduite du projet. Les documents ne sont
          ni une étude de faisabilité de votre projet, ni un conseil financier ou d&apos;investissement. Faites valider votre
          projet par un technicien ou un agronome avant d&apos;engager des fonds.
        </P>
        <H3>8.2 Limite de responsabilité</H3>
        <P last>
          La responsabilité de Kessel au titre d&apos;un achat est limitée au prix payé pour le document concerné. Kessel ne
          répond pas des pertes de récolte, manques à gagner ou décisions d&apos;investissement prises sur la base d&apos;un
          document, sauf faute lourde ou disposition légale impérative contraire.
        </P>
      </Section>

      <Section title="9. Service client et réclamations">
        <P last>
          Toute réclamation s&apos;adresse à {MAIL} ou sur WhatsApp au {EDITOR.phone}. Nous répondons sous 15 jours au plus.
        </P>
      </Section>

      <Section title="10. Données personnelles">
        <P last>
          Les données liées aux achats sont traitées selon notre{" "}
          <Link href="/confidentialite" className="text-amber hover:underline">Politique de confidentialité</Link>. Les pièces des
          achats sont conservées 10 ans, comme l&apos;exige la loi comptable.
        </P>
      </Section>

      <Section title="11. Modification des CGV">
        <P last>Kessel peut modifier les CGV. S&apos;applique à chaque achat la version en vigueur au jour de cet achat.</P>
      </Section>

      <Section title="12. Loi applicable et litiges">
        <P last>
          Les CGV sont régies par le droit camerounais, notamment la loi n° 2010/021 du 21 décembre 2010 régissant le commerce
          électronique et la loi-cadre n° 2011/012 du 6 mai 2011 portant protection du consommateur. En cas de litige, une
          solution amiable est recherchée d&apos;abord. À défaut, les juridictions compétentes de Douala sont saisies, sauf règle
          impérative contraire du pays de résidence de l&apos;acheteur.
        </P>
      </Section>
    </LegalShell>
  );
}
