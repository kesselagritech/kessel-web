"use client";
// app/confidentialite/en/page.tsx — Privacy Policy v2.0 (EN) — [legal-v2]
// The French version prevails in case of discrepancy.

import Link from "next/link";
import { LegalShell, Section, H3, P, A, List, Table, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;

export default function PrivacyEnPage() {
  return (
    <LegalShell
      title="Privacy"
      accent="Policy."
      meta={
        <>
          Version 2.1 · Updated October 12, 2026 ·{" "}
          <Link href="/confidentialite" className="underline hover:text-amber">Version française</Link>
        </>
      }
      footerNote="Last updated: October 12, 2026 · Version 2.1 · The French version prevails in case of discrepancy."
    >
      <div className="reveal">
        <P last>
          This policy explains which personal data Kessel Agritech (&quot;<strong>Kessel</strong>&quot;, &quot;we&quot;) collects,
          why, who it is shared with, how long it is kept and what your rights are. It covers all our services: the{" "}
          <strong>kesselagritech.com</strong> website (including the paid library, the project comparator and the collaborator
          space) and the <strong>Kessel</strong> mobile app (iOS and Android). <strong>We never sell personal data.</strong>
        </P>
      </div>

      <Section title="1. Data controller">
        <EditorBox lang="en" />
        <P last>
          Given the size of our organisation, the data controller also acts as data protection officer. One address for any
          question: {MAIL}.
        </P>
      </Section>

      <Section title="2. Legal framework">
        <P last>
          Our processing is governed by <strong>Cameroonian Law No. 2024/017 of December 23, 2024 on the protection of personal
          data</strong>. As the website serves users across Africa, we apply the same rules to everyone, without prejudice to any
          additional rights granted by the law of your country of residence.
        </P>
      </Section>

      <Section title="3. Data we collect">
        <H3>3.1 Kessel mobile app</H3>
        <Table
          head={["Category", "Data"]}
          rows={[
            ["Identity", "Phone number, name, profile photo (optional), role (promoter, technician, supervisor), language, agro-ecological zone, region, country of residence"],
            ["Sign-in", "PIN code, stored only in hashed and salted form"],
            ["Farm data", "Projects, tasks, expenses, revenues, harvests, investments and equipment, field reports"],
            ["Photos and location", "Photos taken in the app and GPS coordinates at the time they are taken"],
            ["Exchanges", "Project messages, exchanges with Kessel supervisors, specifications issued, approved or rejected"],
            ["Suggestions", "Messages you send us from the app, with your name and phone number"],
            ["Technical", "Notification token, session identifiers, device model; at each sign-in, IP address and device type"],
            ["Crashes", "Pseudonymised crash reports (no name or phone number)"],
          ]}
        />

        <H3>3.2 Website and library</H3>
        <Table
          head={["Category", "Data"]}
          rows={[
            ["Website account", "Email address and password (stored in hashed form). This account is separate from the app account."],
            ["Purchases", "Document purchased, amount, date, payment status, CamPay transaction reference, operator used"],
            ["Audience measurement", "Pages viewed (page address, without parameters), a random identifier stored in your browser, IP address, country and city derived from the IP address, device type, referring website. If you are signed in, these visits are linked to your account."],
            ["Document views", "Number of views of each document, counted per browsing session"],
            ["Contact form", "Name, email, phone (optional), subject and message"],
          ]}
        />

        <H3>3.3 Collaborator space</H3>
        <P>
          A promoter may give a farm code to a person of their choice. That person, signed in with a website account, can then
          view the farm&apos;s projects read-only: tasks, expenses, revenues, harvests, reports and photos. We record which
          account has access to which farm and the date of last access.
        </P>
        <P last>
          The promoter alone decides who receives the code and remains responsible for that choice. To withdraw access, write to{" "}
          {MAIL}.
        </P>

        <H3>3.4 What we do not collect</H3>
        <List
          variant="cross"
          items={[
            "Your phone's contact list.",
            "Photos or files on your phone other than those taken in the app.",
            "Biometric data.",
            "Your bank card number or Mobile Money PIN: they are entered on CamPay's secure page, never on ours.",
            "Your browsing on other websites.",
          ]}
        />
      </Section>

      <Section title="4. Why we use your data">
        <Table
          head={["Purpose", "Legal basis"]}
          rows={[
            ["Create and manage your account, run the app", "Performance of the contract (Terms of Use)"],
            ["Sell and give access to library documents", "Performance of the contract (Terms of Sale)"],
            ["Geotag photos, access the camera, send notifications", "Your consent, which you can withdraw at any time in your phone settings"],
            ["Share a farm with a collaborator", "The promoter's choice (performance of the contract)"],
            ["Measure website audience and improve our content", "Legitimate interest; you may object (section 12)"],
            ["Security, fraud prevention, crash diagnosis", "Legitimate interest"],
            ["Keep purchase records", "Legal obligation (accounting)"],
            ["Answer your messages", "Your request"],
          ]}
        />
      </Section>

      <Section title="5. App permissions">
        <Table
          head={["Permission", "Why", "Can be refused?"]}
          rows={[
            ["Camera", "Take field photos", "Yes"],
            ["Precise location", "Geotag photos", "Yes"],
            ["Notifications", "Reminders, messages, alerts", "Yes"],
            ["Local storage", "Work offline", "No (essential)"],
            ["Internet", "Sync your data", "No (essential)"],
          ]}
        />
      </Section>

      <Section title="6. Who receives your data">
        <P>
          Your data is accessible, each to the extent relevant, to: you; the people you invite to a project (technicians) or to
          whom you give a farm code; Kessel supervisors for the projects they support; the data controller for running the
          service; and authorities where required by law. We also rely on the following technical providers:
        </P>
        <Table
          head={["Provider", "Role", "Location"]}
          rows={[
            ["Supabase Inc.", "Database, authentication, account emails, storage of photos and documents", "United States (Oregon)"],
            ["Vercel Inc.", "Website hosting, aggregated audience measurement", "United States, global network"],
            ["CamPay", "Mobile Money and card payments for the library", "Cameroon"],
            ["Resend", "Delivery of contact form messages", "United States"],
            ["Expo (EAS), Google (FCM), Apple (APNs)", "Delivery of app notifications", "United States"],
            ["Sentry", "App crash diagnosis", "European Union"],
          ]}
        />
      </Section>

      <Section title="7. Transfers outside Cameroon">
        <P last>
          Several providers are located outside Cameroon, mainly in the United States. Law No. 2024/017 makes such transfers
          subject to conditions, including an adequate level of protection in the destination country and authorisation from the
          Personal Data Protection Authority. To date, this Authority has not yet been organised and the authorisation procedure
          is not open. In the meantime, Kessel keeps a record of its processing activities and security measures, limits
          transferred data to what the service requires, and will apply for authorisation as soon as the Authority is in place.
          For any question about these transfers: {MAIL}.
        </P>
      </Section>

      <Section title="8. Retention periods">
        <Table
          head={["Data", "Period"]}
          rows={[
            ["App account", "As long as you use it"],
            ["Inactive app account", "Deleted with its projects after 6 consecutive months without sign-in (rule applied from November 12, 2026)"],
            ["App account deleted at your request", "Account and projects erased from our databases upon request; photos and backup copies erased within 30 days at most"],
            ["Website account (library)", "Never deleted for inactivity, so your purchases remain accessible; deleted at your request"],
            ["Purchase records", "10 years, even after account deletion (accounting obligation)"],
            ["Website audience measurement", "60 days"],
            ["Sign-in attempts (security)", "30 days"],
            ["Sign-in data (IP address, device)", "90 days at most after the session ends"],
            ["Suggestions sent from the app", "Kept to improve the service; name and number removed when the account is deleted"],
            ["Crash reports", "90 days at most"],
            ["Contact form messages", "3 years at most after the last exchange"],
          ]}
        />
      </Section>

      <Section title="9. Your rights">
        <List
          items={[
            "Access: obtain a copy of the data we hold about you.",
            "Rectification: correct inaccurate or incomplete data.",
            "Erasure: request deletion of your account and data.",
            "Objection: object to processing based on our legitimate interest, such as audience measurement.",
            "Portability: receive your data in a structured format.",
            "Withdrawal of consent: at any time, without affecting prior processing.",
          ]}
        />
        <P>
          Write to {MAIL} stating the phone number (app) or email address (website) of your account. We may ask you to prove
          the account is yours. We reply within <strong>30 days</strong> at most.
        </P>
        <P last>
          If you disagree with our answer, you may contact the <strong>Personal Data Protection Authority</strong> established by
          Law No. 2024/017 once it is in place, the competent courts, or the data protection authority of your country of
          residence.
        </P>
      </Section>

      <Section title="10. Security">
        <List
          items={[
            "Data encrypted in transit between your device and our servers (HTTPS).",
            "PIN codes and passwords stored only in hashed and salted form.",
            "Database access rules: each account only sees the data that concerns it.",
            "Payments checked directly with CamPay before any document is unlocked.",
            "Data encrypted at rest by our database host.",
          ]}
        />
        <P last>
          In the event of a data breach likely to affect your rights, we inform the people concerned without undue delay, and the
          Authority once it is in place.
        </P>
      </Section>

      <Section title="11. Minors">
        <P last>
          Accounts and purchases are reserved for people aged 18 and over. If you believe a minor has sent us data, write to us
          and we will delete it.
        </P>
      </Section>

      <Section title="12. Cookies and local storage">
        <P>
          The website uses <strong>no advertising cookies</strong>. It stores in your browser: your sign-in session; a random
          visitor identifier, kept until you clear the site&apos;s data; and a visit identifier, renewed after 30 minutes of
          inactivity. Vercel&apos;s audience tool works without cookies. To object to audience measurement, clear the site&apos;s
          data in your browser or write to us.
        </P>
        <P last>
          The app keeps on your phone your session tokens (in the iOS or Android secure store), a copy of your data for offline
          use and your preferences. Everything is erased when you sign out or uninstall the app.
        </P>
      </Section>

      <Section title="13. Changes">
        <P last>
          For any significant change, we notify you at least 30 days in advance: by in-app notification, by email for website
          accounts, and on this page.
        </P>
      </Section>

      <Section title="14. Governing law">
        <P last>
          This policy is governed by Cameroonian law. Any dispute falls under the competent courts of Douala, unless a mandatory
          rule of your country of residence provides otherwise.
        </P>
      </Section>

      <Section title="15. Contact">
        <Box>
          <p className="text-ink-mid">Email: {MAIL}</p>
          <p className="text-ink-mid">
            WhatsApp: <A href={EDITOR.wa}>{EDITOR.phone}</A>
          </p>
        </Box>
      </Section>
    </LegalShell>
  );
}
