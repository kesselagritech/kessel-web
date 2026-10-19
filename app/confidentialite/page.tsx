"use client";
// app/confidentialite/page.tsx — Politique de confidentialité v2.3 — [legal-v2] [nokash-v1]

import Link from "next/link";
import { LegalShell, Section, H3, P, A, List, Table, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;

export default function ConfidentialitePage() {
  return (
    <LegalShell
      title="Politique de"
      accent="confidentialité."
      meta={
        <>
          Version 2.3 · Mise à jour le 19 octobre 2026 ·{" "}
          <Link href="/confidentialite/en" className="underline hover:text-amber">English version</Link>
        </>
      }
      footerNote="Dernière mise à jour : 19 octobre 2026 · Version 2.3"
    >
      <div className="reveal">
        <P last>
          Cette politique explique quelles données personnelles Kessel Agritech (« <strong>Kessel</strong> », « nous ») collecte,
          pourquoi, avec qui elles sont partagées, combien de temps elles sont gardées et quels sont vos droits. Elle couvre
          l&apos;ensemble de nos services : le site <strong>kesselagritech.com</strong> (dont la bibliothèque payante, le comparateur
          de projets et l&apos;espace collaborateur) et l&apos;application mobile <strong>Kessel</strong> (iOS et Android).
          <strong> Nous ne vendons aucune donnée personnelle.</strong>
        </P>
      </div>

      <Section title="1. Responsable du traitement">
        <EditorBox />
        <P last>
          Compte tenu de la taille de notre structure, le responsable du traitement assure lui-même le rôle de délégué à la
          protection des données. Une seule adresse pour toute question : {MAIL}.
        </P>
      </Section>

      <Section title="2. Cadre légal">
        <P last>
          Nos traitements sont soumis à la <strong>loi camerounaise n° 2024/017 du 23 décembre 2024 relative à la protection des
          données à caractère personnel</strong>. Le site s&apos;adressant à des utilisateurs de toute l&apos;Afrique, nous
          appliquons les mêmes règles à tous, sans préjudice des droits supplémentaires que vous accorde la loi de votre pays de
          résidence.
        </P>
      </Section>

      <Section title="3. Données collectées">
        <H3>3.1 Application mobile Kessel</H3>
        <Table
          head={["Catégorie", "Données"]}
          rows={[
            ["Identité", "Numéro de téléphone, nom, photo de profil (facultative), rôle (promoteur, technicien, superviseur), langue, zone agro-écologique, région, pays de résidence"],
            ["Connexion", "Code PIN, conservé uniquement sous forme hachée et salée"],
            ["Données agricoles", "Projets, tâches, dépenses, revenus, récoltes, investissements et équipements, rapports de terrain"],
            ["Photos et localisation", "Photos prises dans l'application et coordonnées GPS au moment de la prise"],
            ["Échanges", "Messages de projet, échanges avec les superviseurs Kessel, cahiers des charges émis, validés ou refusés"],
            ["Suggestions", "Messages que vous nous envoyez depuis l'application, avec votre nom et votre numéro"],
            ["Technique", "Jeton de notification, identifiants de session, modèle d'appareil ; à chaque connexion, adresse IP et type d'appareil"],
            ["Pannes", "Rapports de plantage pseudonymisés (sans nom ni numéro de téléphone)"],
          ]}
        />

        <H3>3.2 Site web et bibliothèque</H3>
        <Table
          head={["Catégorie", "Données"]}
          rows={[
            ["Compte du site", "Adresse e-mail et mot de passe (conservé sous forme hachée). Ce compte est distinct de celui de l'application."],
            ["Achats", "Document acheté, montant, date, statut du paiement, prestataire et référence de transaction (NOKASH), opérateur ou type de carte utilisé, historique des consultations du document acheté. Votre adresse e-mail est transmise à NOKASH pour le paiement."],
            ["Mesure d'audience", "Pages consultées (adresse de la page, sans paramètres), identifiant aléatoire enregistré dans votre navigateur, adresse IP, pays et ville déduits de l'adresse IP, type d'appareil, site d'origine. Si vous êtes connecté, ces visites sont rattachées à votre compte."],
            ["Lecture des fiches", "Nombre de consultations de chaque fiche, compté par session de navigation"],
            ["Formulaire de contact", "Nom, e-mail, téléphone (facultatif), sujet et message"],
          ]}
        />

        <H3>3.3 Espace collaborateur</H3>
        <P>
          Un promoteur peut transmettre un code d&apos;exploitation à une personne de son choix. Celle-ci, connectée avec un
          compte du site, consulte alors en lecture seule les projets de cette exploitation : tâches, dépenses, revenus,
          récoltes, rapports et photos. Nous enregistrons quel compte a accès à quelle exploitation et la date du dernier accès.
        </P>
        <P last>
          Le promoteur décide seul à qui il communique son code et reste responsable de ce choix. Pour retirer un accès,
          écrivez-nous à {MAIL}.
        </P>

        <H3>3.4 Ce que nous ne collectons pas</H3>
        <List
          variant="cross"
          items={[
            "Le carnet de contacts de votre téléphone.",
            "Les photos ou fichiers de votre téléphone autres que ceux pris dans l'application.",
            "Vos données biométriques.",
            "Vos numéros de carte bancaire ou votre code Mobile Money : ils sont saisis sur la page sécurisée du prestataire de paiement (NOKASH), jamais chez nous.",
            "Votre navigation sur d'autres sites.",
          ]}
        />
      </Section>

      <Section title="4. Pourquoi nous utilisons vos données">
        <Table
          head={["Finalité", "Fondement"]}
          rows={[
            ["Créer et gérer votre compte, faire fonctionner l'application", "Exécution du contrat (CGU)"],
            ["Vendre et donner accès aux documents de la bibliothèque", "Exécution du contrat (CGV)"],
            ["Géolocaliser les photos, accéder à la caméra, envoyer des notifications", "Votre consentement, retirable à tout moment dans les réglages du téléphone"],
            ["Partager une exploitation avec un collaborateur", "Choix du promoteur (exécution du contrat)"],
            ["Mesurer l'audience du site et améliorer nos contenus", "Intérêt légitime ; vous pouvez vous y opposer (section 12)"],
            ["Sécurité, prévention de la fraude (dont la preuve des achats en cas de paiement contesté), diagnostic des pannes", "Intérêt légitime"],
            ["Conserver les pièces des achats", "Obligation légale (comptabilité)"],
            ["Répondre à vos messages", "Votre demande"],
          ]}
        />
      </Section>

      <Section title="5. Autorisations demandées par l'application">
        <Table
          head={["Autorisation", "Pourquoi", "Refusable ?"]}
          rows={[
            ["Caméra", "Prendre les photos de terrain", "Oui"],
            ["Localisation précise", "Situer les photos", "Oui"],
            ["Notifications", "Rappels, messages, alertes", "Oui"],
            ["Stockage local", "Fonctionner sans connexion", "Non (indispensable)"],
            ["Internet", "Synchroniser vos données", "Non (indispensable)"],
          ]}
        />
      </Section>

      <Section title="6. Qui reçoit vos données">
        <P>
          Ont accès à vos données, chacun pour ce qui le concerne : vous ; les personnes que vous invitez sur un projet
          (techniciens) ou à qui vous transmettez un code d&apos;exploitation ; les superviseurs Kessel pour les projets
          qu&apos;ils accompagnent ; le responsable du traitement pour l&apos;administration du service ; les autorités, lorsque la
          loi nous y oblige. Nous faisons aussi appel aux prestataires techniques suivants :
        </P>
        <Table
          head={["Prestataire", "Rôle", "Localisation"]}
          rows={[
            ["Supabase Inc.", "Base de données, authentification, e-mails de compte, stockage des photos et documents", "États-Unis (Oregon)"],
            ["Vercel Inc.", "Hébergement du site, mesure d'audience agrégée", "États-Unis, réseau mondial"],
            ["NOKASH", "Paiement de la bibliothèque (Mobile Money et carte bancaire), vérification des paiements contestés", "Cameroun"],
            ["Resend", "Acheminement des messages du formulaire de contact", "États-Unis"],
            ["Expo (EAS), Google (FCM), Apple (APNs)", "Acheminement des notifications de l'application", "États-Unis"],
            ["Sentry", "Diagnostic des pannes de l'application", "Union européenne"],
          ]}
        />
      </Section>

      <Section title="7. Transferts hors du Cameroun">
        <P last>
          Plusieurs prestataires sont situés hors du Cameroun, principalement aux États-Unis. La loi n° 2024/017 soumet ces
          transferts à des conditions, dont un niveau de protection suffisant dans le pays de destination et une autorisation de
          l&apos;Autorité de protection des données à caractère personnel. À ce jour, cette Autorité n&apos;est pas encore
          organisée et la procédure d&apos;autorisation n&apos;est pas ouverte. En attendant, Kessel tient un registre de ses
          traitements et de ses mesures de sécurité, limite les données transférées à ce qui est nécessaire au service, et
          demandera l&apos;autorisation dès que l&apos;Autorité sera en place. Pour toute question sur ces transferts : {MAIL}.
        </P>
      </Section>

      <Section title="8. Durée de conservation">
        <Table
          head={["Données", "Durée"]}
          rows={[
            ["Compte de l'application", "Tant que vous l'utilisez"],
            ["Compte de l'application inactif", "Supprimé avec ses projets après 6 mois consécutifs sans connexion (règle appliquée à partir du 12 novembre 2026)"],
            ["Compte de l'application supprimé à votre demande", "Compte et projets effacés de nos bases dès la demande ; photos et copies de sauvegarde effacées sous 30 jours au plus"],
            ["Compte du site (bibliothèque)", "Jamais supprimé pour inactivité, afin de préserver l'accès à vos achats ; supprimé à votre demande"],
            ["Pièces des achats", "10 ans, même après suppression du compte (obligation comptable)"],
            ["Mesure d'audience du site (adresse IP, pays, appareil)", "180 jours, pour la mesure d'audience et la preuve des achats en cas de paiement contesté"],
            ["Tentatives de connexion (sécurité)", "30 jours"],
            ["Données de connexion (adresse IP, appareil)", "90 jours au plus après la fin de la session"],
            ["Suggestions envoyées depuis l'application", "Conservées pour améliorer le service ; nom et numéro retirés à la suppression du compte"],
            ["Rapports de pannes", "90 jours au plus"],
            ["Messages du formulaire de contact", "3 ans au plus après le dernier échange"],
          ]}
        />
      </Section>

      <Section title="9. Vos droits">
        <List
          items={[
            "Accès : obtenir une copie des données que nous détenons sur vous.",
            "Rectification : corriger une donnée inexacte ou incomplète.",
            "Effacement : demander la suppression de votre compte et de vos données.",
            "Opposition : vous opposer à un traitement fondé sur notre intérêt légitime, comme la mesure d'audience.",
            "Portabilité : recevoir vos données dans un format structuré.",
            "Retrait du consentement : à tout moment, sans effet sur ce qui a été fait avant.",
          ]}
        />
        <P>
          Écrivez à {MAIL} en indiquant le numéro de téléphone (application) ou l&apos;adresse e-mail (site) de votre compte.
          Nous pouvons vous demander de prouver que le compte est bien le vôtre. Réponse sous <strong>30 jours</strong> au plus.
        </P>
        <P last>
          En cas de désaccord, vous pouvez saisir l&apos;<strong>Autorité de protection des données à caractère personnel</strong>{" "}
          instituée par la loi n° 2024/017, dès qu&apos;elle sera en place, les juridictions compétentes, ou l&apos;autorité de
          protection des données de votre pays de résidence.
        </P>
      </Section>

      <Section title="10. Sécurité">
        <List
          items={[
            "Échanges chiffrés pendant leur transport entre votre appareil et nos serveurs (HTTPS).",
            "Codes PIN et mots de passe conservés uniquement sous forme hachée et salée.",
            "Règles d'accès en base de données : chaque compte ne voit que les données qui le concernent.",
            "Paiements vérifiés directement auprès du prestataire de paiement (NOKASH) avant tout déblocage de document.",
            "Données chiffrées au repos chez notre hébergeur de base de données.",
          ]}
        />
        <P last>
          En cas de violation de données susceptible de porter atteinte à vos droits, nous informons les personnes concernées
          dans les meilleurs délais, ainsi que l&apos;Autorité dès qu&apos;elle sera en place.
        </P>
      </Section>

      <Section title="11. Mineurs">
        <P last>
          Les comptes et les achats sont réservés aux personnes de 18 ans et plus. Si vous pensez qu&apos;un mineur nous a
          transmis des données, écrivez-nous : nous les supprimerons.
        </P>
      </Section>

      <Section title="12. Cookies et stockage local">
        <P>
          Le site n&apos;utilise <strong>aucun cookie publicitaire</strong>. Il enregistre dans votre navigateur : votre session de
          connexion ; un identifiant aléatoire de visiteur, conservé jusqu&apos;à ce que vous effaciez les données du site ; un
          identifiant de visite, renouvelé après 30 minutes d&apos;inactivité. L&apos;outil de mesure d&apos;audience de Vercel
          fonctionne sans cookie. Pour vous opposer à la mesure d&apos;audience, effacez les données du site dans votre navigateur
          ou écrivez-nous.
        </P>
        <P last>
          L&apos;application conserve sur votre téléphone vos jetons de session (dans le coffre sécurisé d&apos;iOS ou
          d&apos;Android), une copie de vos données pour le mode hors-ligne et vos préférences. Tout est effacé à la déconnexion ou
          à la désinstallation de l&apos;application.
        </P>
      </Section>

      <Section title="13. Modifications">
        <P last>
          En cas de changement important, nous vous prévenons au moins 30 jours à l&apos;avance : par notification dans
          l&apos;application, par e-mail pour les comptes du site, et sur cette page.
        </P>
      </Section>

      <Section title="14. Loi applicable">
        <P last>
          Cette politique est régie par le droit camerounais. Tout litige relève des juridictions compétentes de Douala, sauf
          règle impérative contraire de votre pays de résidence.
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
